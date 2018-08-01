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

	hasOtherDeps(diff) {
		return this.relation.some(op => op.getLocalPointers(diff).size)
	}
}
