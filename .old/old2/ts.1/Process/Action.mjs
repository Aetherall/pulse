export default class Action {
	constructor(core, action) {
		this.core = core
		if (action && action.pointer) this.pointer = new this.core.Pointer(action.pointer)
		this.data = new Map()
		this.relation = new Map()
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
			if (operation.relation) this.relation.set(attribute, operation)
			else this.data.set(attribute, operation)
		}
	}

	hasOtherDeps(diff) {
		for (const op of this.relation.values()) {
			if (op.getLocalPointers(diff).size) return true
		}
		return false
	}
}
