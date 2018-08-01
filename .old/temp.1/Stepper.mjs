class Stepper {
	constructor(core, actions) {
		this.core = core
	}

	execute() {
		for (const action of actions) action.execute()
	}
}

class Action {
	execute() {}
}

class CreateAction {
	execute() {
		const item = new this.core.O[this.pointer.className](this.pointer)

		item.save()
	}
}
