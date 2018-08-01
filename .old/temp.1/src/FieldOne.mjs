import { NoOp, SetOp, UnsetOp, AddOp, RemoveOp, ArrayOp } from './Op'

export default class FieldOne {
	constructor(config) {
		this.name = config.name
		this.type = config.type
		this.perm = config.perm
	}

	setTarget(target) {
		this.target = target
	}

	async can(action, ...args) {
		if (this.perm[action]) await this.perm[action](...args)
	}

	disconnectAction(target, source) {
		source.applyOpToState(this.name, new UnsetOp())
	}

	connectAction(target, source) {
		source.applyOpToState(this.name, new SetOp(target))
	}

	async canConnect(user, source, target) {
		const previousTarget = source.get(this.name)
		if (previousTarget) {
			if (previousTarget.equals(target)) return true
			await this.can('disconnect', user, source, previousTarget)
		}
		await this.target.canDisconnectPrevious(user, target)
		await this.can('connect', user, source, target)
	}

	doConnect(source, target) {
		const previousTarget = source.get(this.name)
		if (previousTarget) {
			if (previousTarget.equals(target)) return true
			this.target.disconnectAction(source, previousTarget)
		}
		this.target.doDisconnectPrevious(target)
		this.target.connectAction(source, target)
	}

	async canDisconnectPrevious(user, source) {
		const previousTarget = source.get(this.name)
		if (!previousTarget) return true
		await this.can('disconnect', user, source, previousTarget)
	}

	doDisconnectPrevious(source) {
		const previousTarget = source.get(this.name)
		if (!previousTarget) return true
		this.target.disconnectAction(source, previousTarget)
	}

	canDisconnect(user, source, target) {
		return this.can('disconnect', user, source, target)
	}

	doDisconnect(source, target) {
		this.target.disconnectAction(source, target)
	}

	canApplyOp(user, op, object) {
		if (op instanceof SetOp) return this.canConnect(user, object, op._value)
		if (op instanceof UnsetOp) return this.doDisconnectPrevious(user, object)
		throw new Error(`[ OneField ] invalid operation`)
	}

	doApplyOp(op, object) {
		if (op instanceof SetOp) return this.doConnect(object, op._value)
		if (op instanceof UnsetOp) return this.doDisconnectPrevious(object)
		throw new Error(`[ OneField ] invalid operation`)
	}
}
