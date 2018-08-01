class Field {
	constructor(config) {
		this.name = config.name
		this.type = config.type
		this.perm = config.perm
	}

	canSet(user, value, doc) {
		console.log(user, value, doc)
	}

	canGet(user, value, doc) {
		console.log(user, value, doc)
	}
}
