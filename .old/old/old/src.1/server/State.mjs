class State {
	constructor() {
		this.pendingOps = new Map()
		this.localState = {}
		this.serverState = {}
	}

	addOp(attr, op) {
		if (this.pendingOps.has(attr)) this.pendingOps.set(attr, this.pendingOps.get(attr).merge(op))
		this.pendingOps.set(attr, op)
		this.updateAttibute(attr)
	}

	updateAttibute(attr) {
		const attributeOp = this.pendingOps.get(attr)
		const newValue = attributeOp.applyTo(this.serverState[attr])
		if (!Parse.equals(newValue, this.localState[attr])) this.localState[attr] = newValue
	}
}
