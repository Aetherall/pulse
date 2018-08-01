import { NoOp, SetOp, UnsetOp, AddOp, RemoveOp, ArrayOp, UniqueSet } from '..'

export default class FieldMany {
	constructor(name, config) {
		this.name = name
		this.type = config.type
		this.perm = config.perm || {}
		this.default = new UniqueSet()
	}

	setRelation(relation, isSource) {
		this.relation = relation
		this.isSource = isSource
		this.perm.connect = relation.getPerm('connect', isSource)
		this.perm.disconnect = relation.getPerm('disconnect', isSource)
	}

	setTarget(target) {
		this.target = target
	}

	can(action, ...args) {
		return this.relation.executePerm(this.isSource, action, ...args)
	}

	// async can(action, ...args) {
	// 	if (this.perm[action]) await this.perm[action](...args)
	// }

	disconnectAction(target, source) {
		source.applyOpToState(this.name, new RemoveOp(target.toPointer()))
	}

	connectAction(target, source) {
		source.applyOpToState(this.name, new AddOp(target.toPointer()))
	}

	async canConnect(user, source, target) {
		if (source.get(this.name).has(target)) return true
		const fetchedTarget = await target.toObject()
		await this.target.canDisconnectPrevious(user, fetchedTarget)
		await this.can('connect', user, source, fetchedTarget)
	}

	async doConnect(source, target) {
		const objectTarget = await target.toObject()
		await this.target.doDisconnectPrevious(objectTarget)
		this.target.connectAction(source, objectTarget)
	}

	async canDisconnect(user, source, target) {
		const objectTarget = await target.toObject()
		return this.can('disconnect', user, source, objectTarget)
	}

	async doDisconnect(source, target) {
		const objectTarget = await target.toObject()
		this.target.disconnectAction(source, objectTarget)
	}

	async canDisconnectPrevious(user, source) {}

	async doDisconnectPrevious(source) {}

	async canApplyOp(user, op, object) {
		if (op instanceof SetOp) {
			const input = op.value
			const connectedTargets = object.get(this.name) || new UniqueSet()
			const toConnect = input.minus(connectedTargets)
			for (const target of toConnect) await this.canConnect(user, object, target)
			const toDisconnect = connectedTargets.minus(input)
			for (const target of toDisconnect) await this.canDisconnect(user, object, target)
		} else if (op instanceof UnsetOp) {
			const toDisconnect = object.get(this.name) || new UniqueSet()
			for (const target of toDisconnect) await this.canDisconnect(user, object, target)
		} else if (op instanceof AddOp) {
			const input = op.value
			for (const target of input) await this.canConnect(user, object, target)
		} else if (op instanceof RemoveOp) {
			const input = op.value
			for (const target of input) await this.canDisconnect(user, object, target)
		} else if (op instanceof ArrayOp) {
			for (const target of op.add) await this.canConnect(user, object, target)
			for (const target of op.remove) await this.canDisconnect(user, object, target)
		}
	}

	async doApplyOp(op, object) {
		if (op instanceof SetOp) {
			const input = op.value
			const connectedTargets = object.get(this.name) || new UniqueSet()
			const toConnect = input.minus(connectedTargets)
			for (const target of toConnect) await this.doConnect(object, target)
			const toDisconnect = connectedTargets.minus(input)
			for (const target of toDisconnect) await this.doDisconnect(object, target)
		} else if (op instanceof UnsetOp) {
			const toDisconnect = object.get(this.name) || new UniqueSet()
			for (const target of toDisconnect) await this.doDisconnect(object, target)
		} else if (op instanceof AddOp) {
			const input = op.value
			for (const target of input) await this.doConnect(object, target)
		} else if (op instanceof RemoveOp) {
			const input = op.value
			for (const target of input) await this.doDisconnect(object, target)
		} else if (op instanceof ArrayOp) {
			for (const target of op.add) await this.doConnect(object, target)
			for (const target of op.remove) await this.doDisconnect(object, target)
		}
	}
}
