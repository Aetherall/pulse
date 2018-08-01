import PulseSet from './PulseSet'

export default class Stepper {
	constructor(core, actions) {
		this.core = core
		this.actions = new PulseSet(actions.map(action => this.core.Action.fromJson(action)))
		this.steps = []
		this.savedPointers = new PulseSet()
		this.clean()
		this.split()
		this.clean()
		if (this.actions.size > 0) throw new Error('[ Pulse - Stepper ] The actions could not be saved, some cyclic dependencies could not be resolved')
	}

	execute() {}

	executeStep(action) {
		if (action.mutation === 'create') {
		}
		if (action.mutation === 'update') {
		}
		if (action.mutation === 'delete') {
		}
	}

	update(action) {
		const pointer = action.pointer
		const data = action.data
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
			const actionRelation = [...action.relation]
			for (const op of actionRelation) {
				const local = op.split()
				if (local) localAction.relation.add(local)
			}
			if (localAction.relation.size) this.actions.add(localAction)
		}
	}
}
