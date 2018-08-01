import PulseSet from './PulseSet'

export default class Action {
	constructor(core, action) {
		this.core = core
		if (action && action.pointer) this.pointer = new this.core.Pointer(action.pointer)
		this.data = new PulseSet()
		this.relation = new PulseSet()
	}

	static fromJson(core, json) {
		const action = new core.Action(json)
		action.mutation = json.mutation
		action.parseData(json.data)
		return action
	}

	parseData(data) {
		for (const attribute in data) {
			const operation = this.core.jsonToOp(data[attribute])
			if (operation.relation) this.relation.add(operation)
			else this.data.add(operation)
		}
	}

	hasOtherDeps(diff) {
		return this.relation.some(op => op.getLocalPointers(diff).size)
	}
}
