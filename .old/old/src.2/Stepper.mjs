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
