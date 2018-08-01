class PointerCache extends Map {
	constructor() {
		super()
		this.counter = 0
	}

	newLocalId() {
		return this.counter++
	}

	get(config) {
		const { typename, id, localId } = config
		if (!typename || (!id && !localId)) throw new Error('A pointer should have a typename and an id or  localId')
		if (id && super.has(typename + id)) return super.get(typename + id)
		if (localId && super.has(typename + localId)) return super.get(typename + localId)
		const pointer = new Pointer(config, true)
		if (id) {
			super.set(typename + id, pointer)
			return pointer
		}
		if (localId) {
			super.set(typename + localId, pointer)
			return pointer
		}
	}

	set(typename, id, localId, pointer) {
		if (id) return super.set(typename + id, pointer)
		if (localId) return super.set(typename + localId, pointer)
		throw new Error('A pointer should have an id or a localId')
	}
}

const cache = new PointerCache()

const payload = [
	{
		pointer: { typename: 'Post', localId: 'a' },
		mutation: 'create',
		data: {
			title: { op: 'set', value: 'H' },
			comments: {
				op: 'many',
				add: [{ typename: 'Comment', id: 'z' }, { typename: 'Comment', localId: 'b' }]
			}
		}
	},
	{
		pointer: { typename: 'Comment', localId: 'b' },
		mutation: 'create',
		data: {
			message: { op: 'set', value: 'coucou' },
			post: {
				op: 'one',
				connect: { typename: 'Post', localId: 'a' }
			}
		}
	},
	{
		pointer: { typename: 'Comment', localId: 'c' },
		mutation: 'create',
		data: {
			message: { op: 'set', value: 'coucsou' }
		}
	},
	{
		pointer: { typename: 'Comment', id: 'e' },
		mutation: 'update',
		data: {
			message: { op: 'set', value: 'coucssssou' }
		}
	}
]

const payloadf = [
	{
		pointer: { typename: 'Comment', localId: 'c' },
		mutation: 'create',
		data: {
			message: { op: 'set', value: 'coucsou' }
		}
	},
	{
		pointer: { typename: 'Post', localId: 'a' },
		mutation: 'create',
		data: {
			title: { op: 'set', value: 'H' },
			comments: {
				op: 'many',
				add: [{ typename: 'Comment', id: 'z' }]
			}
		}
	},
	{
		pointer: { typename: 'Comment', localId: 'b' },
		mutation: 'create',
		data: {
			message: { op: 'set', value: 'coucou' },
			post: {
				op: 'one',
				connect: { typename: 'Post', localId: 'a' }
			}
		}
	},
	{
		pointer: { typename: 'Post', localId: 'a' },
		action: 'update',
		data: {
			add: [{ typename: 'Comment', localId: 'b' }]
		}
	}
]

class Stepper {
	constructor(actions) {
		this.actions = new PulseSet(actions)
		this.steps = []
		this.savedPointers = new PulseSet()
		this.clean()
		this.split()
		this.clean()
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
			const localAction = new Action(action)
			localAction.mutation = 'update'
			const actionRelation = [...action.relation]
			for (const op of actionRelation) {
				const local = op.split()
				if (local) localAction.relation.add(local)
			}

			if (localAction.relation.size) this.actions.add(localAction)
		}
	}
}

function parsePayload(payload) {
	const actions = payload.map(action => Action.fromJson(action))
	const stepper = new Stepper(actions)
	return stepper
}

class Pointer {
	constructor(config, force) {
		if (config instanceof Pointer) return config
		if (!force) return cache.get(config)
		if (config.typename) this.typename = config.typename
		if (config.id) this.id = config.id
		if (config.localId) this.localId = config.localId
	}

	static fromJson(config) {
		return cache.get(config)
	}

	get exists() {
		return !!this.id
	}
}

class SetOp {
	constructor(value) {
		this._value = value
	}
}

class UnsetOp {}

class RelationOneOp {
	constructor({ connect, disconnect } = {}) {
		this.relation = true
		if (connect) this.connect = new Pointer(connect)
		if (disconnect) this.disconnect = new Pointer(disconnect)
	}

	getLocalPointers(diff) {
		const pointers = new PulseSet()
		if (this.connect && !this.connect.exists && !(diff && diff.has(this.connect))) pointers.add(this.connect)
		if (this.disconnect && !this.disconnect.exists && !(diff && diff.has(this.disconnect))) pointers.add(this.disconnect)
		return pointers
	}

	splitLocal(op) {
		if (this.connect && this.connect.exists) return { fixed: this }
		if (this.connect && !this.connect.exists) return { local: this }
		if (this.disconnect && this.disconnect.exists) return { fixed: this }
		if (this.disconnect && !this.disconnect.exists) return { local: this }
		throw new Error('Unused Relation Op')
	}

	getLocal() {
		if (this.connect && this.connect.exists) return []
		if (this.connect && !this.connect.exists) return [this.connect]
		if (this.disconnect && this.disconnect.exists) return []
		if (this.disconnect && !this.disconnect.exists) return [this.disconnect]
	}

	split() {
		let local
		if (this.connect && !this.connect.exists) local = new this.constructor({ connect: this.connect })
		if (this.disconnect && !this.disconnect.exists) local = new this.constructor({ disconnect: this.disconnect })
		if (local) delete this.connect
		if (local) delete this.disconnect
		return local
	}
}

class RelationManyOp {
	constructor({ add, remove } = {}) {
		this.relation = true
		this.add = new PulseSet()
		this.remove = new PulseSet()
		if (add) add.forEach(item => this.add.add(new Pointer(item)))
		if (remove) remove.forEach(item => this.remove.add(new Pointer(item)))
	}

	getLocalPointers(diff) {
		const pointers = new PulseSet()
		if (this.add) for (const item of this.add) if (!item.exists && !(diff && diff.has(item))) pointers.add(item)
		if (this.remove) for (const item of this.remove) if (!item.exists && !(diff && diff.has(item))) pointers.add(item)
		return pointers
	}

	split() {
		const local = new RelationManyOp()
		for (const item of this.add) {
			if (!item.exists) {
				local.add.add(item)
				this.add.delete(item)
			}
		}
		for (const item of this.remove) {
			if (!item.exists) {
				local.remove.add(item)
				this.remove.delete(item)
			}
		}
		if (local.add.size || local.remove.size) return local
		return undefined
	}

	splitLocal() {
		let local = new RelationManyOp()
		let fixed = new RelationManyOp()
		for (const item of this.add) {
			if (item.exists) {
				fixed.add.add(item)
			} else {
				local.add.add(item)
			}
		}
		for (const item of this.remove) {
			if (item.exists) {
				fixed.remove.add(item)
			} else {
				local.remove.add(item)
			}
		}
		if (!local.add.size || !local.remove.size) local = undefined
		if (!fixed.add.size || !fixed.remove.size) fixed = undefined
		return { local, fixed }
	}
}

function jsonToOp(json) {
	if (!json || !json.op) return null
	if (json.op === 'set') return new SetOp(json.value)
	if (json.op === 'unset') return new UnsetOp()
	if (json.op === 'one') return new RelationOneOp(json)
	if (json.op === 'many') return new RelationManyOp(json)
}

class Action {
	constructor(action) {
		if (action && action.pointer) this.pointer = new Pointer(action.pointer)
		this.data = new PulseSet()
		this.relation = new PulseSet()
	}

	static fromJson(json) {
		const action = new Action(json)
		action.mutation = json.mutation
		action.parseData(json.data)
		return action
	}

	parseData(data) {
		for (const attribute in data) {
			const operation = jsonToOp(data[attribute])
			if (operation.relation) this.relation.add(operation)
			else this.data.add(operation)
		}
	}

	// parseDependencies() {
	// 	const deps = new PulseSet()
	// 	for (const operation of this.relation) {
	// 		if (operation.connect && !operation.connect.exists) deps.add(operation.connect)
	// 		if (operation.disconnect && !operation.disconnect.exists) deps.add(operation.disconnect)
	// 		if (operation.add) for (const item of operation.add) if (!item.exists) deps.add(item)
	// 		if (operation.remove) for (const item of operation.remove) if (!item.exists) deps.add(item)
	// 	}
	// 	this.dependencies = deps
	// }

	// dependsOnOther(actions) {
	// 	for (const action of actions) {
	// 		if (action === this) continue
	// 		if (this.dependencies.has(action.pointer)) return true
	// 	}
	// 	return false
	// }

	hasOtherDeps(diff) {
		return this.relation.some(op => op.getLocalPointers(diff).size)
	}
}

class PulseSet extends Set {
	map(f) {
		const r = new Set()
		for (const x of this) r.add(f(x))
		return r
	}

	exclude(b) {
		const r = new Set()
		for (const x in this) if (!b.has(x)) r.add(x)
		return r
	}

	hasExclusive(b) {
		for (const x of this) if (!b.has(x)) return true
		return false
	}

	some(f) {
		for (const x of this) if (f(x)) return true
	}

	log() {
		this.forEach(i => console.log(i))
	}
}

const stepper = parsePayload(payload)

function process(step) {
	const pointer = step.pointer//?
	const collection = 

}


process(stepper.steps[0])