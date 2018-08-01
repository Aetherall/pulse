function resolveOp(op) {
	if (op instanceof SetOp) return { attr: { $set: op._value } }
	if (op instanceof UnsetOp) return { attr: { $unset: true } }
	if (op instanceof OneOp) {
	}
}

function dataToMongo(data) {
	for (const attr in data) {
		const op = data[attr]
		if (op instanceof core.SetOp) {
		}
	}
}

export default class Stepper {
	constructor(core, actions) {
		this.core = core
		this.actions = new Set(actions.map(action => this.core.Action.fromJson(action)))
		this.steps = []
		this.savedPointers = new core.PointerSet()
		this.clean()
		this.split()
		this.clean()
		if (this.actions.size > 0) throw new Error('[ Pulse - Stepper ] The actions could not be saved, some cyclic dependencies could not be resolved')
	}

	execute() {}

	executeStep(action, session) {
		if (action.mutation === 'create') return this.create(action, session)
		if (action.mutation === 'update') return this.update(action, session)
		if (action.mutation === 'destroy') return this.delete(action, session)
	}

	async create(action, session) {
		const pointer = action.pointer
		const data = action.data
		const Collection = this.core.CM.get(pointer.typename)
		const item = new Collection(this.core, pointer)
		await item.apply(data)
		console.log(item)

		// HANDLE RELATIONS

		// item.apply(data)
		// const can = await Collection.perm('create', session.user, item)
		// await item.apply(data)
	}

	async update(action, session) {
		const pointer = action.pointer
		const data = action.data
		const Collection = this.core.CM.get(pointer.typename)
		const item = await session.findByPointer(pointer)
		// const can = await Collection.perm('update', session.user, item)
		// await item.apply(data)
	}

	async destroy(ac) {
		throw new Error()
	}

	clean() {
		let changed = false
		for (const action of this.actions) {
			if (!action.hasOtherDeps(this.savedPointers)) {
				if (action.mutation === 'update' && !action.pointer.exists && !this.savedPointers.has(action.pointer)) continue
				this.steps.push(action)
				if (!action.pointer.exists && action.mutation === 'create') this.savedPointers.add(action.pointer)
				this.actions.delete(action)
				changed = true
			}
		}
		if (changed) return this.clean()
		else return
	}

	split() {
		const actions = [...this.actions]
		for (const action of actions) {
			const localAction = new this.core.Action(action)
			localAction.mutation = 'update'
			const actionRelation = new Map(action.relation)
			for (const [attr, op] of actionRelation.entries()) {
				const local = op.split()
				if (local) localAction.relation.set(attr, local)
			}
			if (localAction.relation.size) this.actions.add(localAction)
		}
	}
}
