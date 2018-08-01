import { NoOp, SetOp, UnsetOp, AddOp, RemoveOp, ArrayOp } from './Op'
import PointerSet from './PointerSet'

export default class FieldMany {
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
		source.applyOpToState(this.name, new RemoveOp(target))
	}

	connectAction(target, source) {
		source.applyOpToState(this.name, new AddOp(target))
	}

	async canConnect(user, source, target) {
		await this.target.canDisconnectPrevious(user, target)
		await this.can('connect', user, source, target)
	}

	doConnect(source, target) {
		this.target.doDisconnectPrevious(target)
		this.target.connectAction(source, target)
	}

	canDisconnect(user, source, target) {
		return this.can('disconnect', user, source, target)
	}

	async doDisconnect(source, target) {
		this.target.disconnectAction(source, target)
	}

	async canDisconnectPrevious(user, source) {}

	async doDisconnectPrevious(source) {}

	async canApplyOp(user, op, object) {
		if (op instanceof SetOp) {
			const input = op._value
			const connectedTargets = object.get(this.name) || new PointerSet()
			const toConnect = input.minus(connectedTargets)
			for (const target of toConnect) await this.canConnect(user, object, target)
			const toDisconnect = connectedTargets.minus(input)
			for (const target of toDisconnect) await this.canDisconnect(user, object, target)
		} else if (op instanceof UnsetOp) {
			const toDisconnect = object.get(this.name) || new PointerSet()
			for (const target of toDisconnect) await this.canDisconnect(user, object, target)
		} else if (op instanceof AddOp) {
			const input = op._value
			for (const target of input) await this.canConnect(user, object, target)
		} else if (op instanceof RemoveOp) {
			const input = op._value
			for (const target of input) await this.canDisconnect(user, object, target)
		} else if (op instanceof ArrayOp) {
			for (const target of op.add) await this.canConnect(user, object, target)
			for (const target of op.remove) await this.canDisconnect(user, object, target)
		}
	}

	doApplyOp(op, object) {
		if (op instanceof SetOp) {
			const input = op._value
			const connectedTargets = object.get(this.name) || new PointerSet()
			const toConnect = input.minus(connectedTargets)
			for (const target of toConnect) this.doConnect(object, target)
			const toDisconnect = connectedTargets.minus(input)
			for (const target of toDisconnect) this.doDisconnect(object, target)
		} else if (op instanceof UnsetOp) {
			const toDisconnect = object.get(this.name) || new PointerSet()
			for (const target of toDisconnect) this.doDisconnect(object, target)
		} else if (op instanceof AddOp) {
			const input = op._value
			for (const target of input) this.doConnect(object, target)
		} else if (op instanceof RemoveOp) {
			const input = op._value
			for (const target of input) this.doDisconnect(object, target)
		} else if (op instanceof ArrayOp) {
			for (const target of op.add) this.doConnect(object, target)
			for (const target of op.remove) this.doDisconnect(object, target)
		}
	}
}
