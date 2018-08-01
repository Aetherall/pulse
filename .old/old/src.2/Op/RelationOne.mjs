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

	split() {
		let local
		if (this.connect && !this.connect.exists) local = new this.constructor({ connect: this.connect })
		if (this.disconnect && !this.disconnect.exists) local = new this.constructor({ disconnect: this.disconnect })
		if (local) delete this.connect
		if (local) delete this.disconnect
		return local
	}
}
