import { NoOp, SetOp, UnsetOp, AddOp, RemoveOp, ArrayOp } from './Op'

export default class Field {
	constructor(config) {
		this.name = config.name
		this.type = config.type
		this.perm = config.perm
	}

	async can(action, ...args) {
		if (this.perm[action]) await this.perm[action](...args)
	}

	async canGet(user, object) {
		const value = object.getValueFromState(this.name)
		await this.can('get', user, value, object)
	}

	async canApplyOp(user, op, object) {
		const actualValue = object.get(this.name)
		const newValue = op.applyTo(actualValue)
		await this.can('set', user, newValue, object)
	}

	doApplyOp(op, object) {}
}
