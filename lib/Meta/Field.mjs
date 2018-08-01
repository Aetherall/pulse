export default class Field {
	constructor(name, config) {
		this.name = name
		this.type = config.type
		this.perm = config.perm || {}
	}

	async can(action, ...args) {
		if (this.perm[action]) await this.perm[action](...args)
	}

	async canApplyOp(user, op, object) {
		const previousValue = object.get(this.name)
		const newValue = op.applyTo(previousValue)
		await this.can('set', user, newValue, object)
	}

	doApplyOp(op, object) {}
}
