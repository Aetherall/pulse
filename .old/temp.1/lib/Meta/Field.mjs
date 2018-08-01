class Field {
	constructor(config) {
		this.name = config.name
		this.type = config.type
		this.perm = config.perm
	}

	applyOp(op, obj) {
		const value = obj.get(this.name)
		this.canSet()
	}

	canSet(user, value, doc) {
		console.log(user, value, doc)
	}

	canGet(user, value, doc) {
		console.log(user, value, doc)
	}
}
