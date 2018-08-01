import { SetOp, UnsetOp, UniqueSet } from '..'

export default class FieldOne {
	constructor(name, config) {
		this.name = name
		this.type = config.type
		this.perm = config.perm || {}
		this.default = undefined
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

	disconnectAction(target, source) {
		source.applyOpToState(this.name, new UnsetOp())
	}

	connectAction(target, source) {
		source.applyOpToState(this.name, new SetOp(target.toPointer()))
	}

	async canConnect(user, source, target) {
		const previousTarget = source.get(this.name)
		if (previousTarget) {
			if (previousTarget.equals(target)) return true
			const objectPreviousTarget = await previousTarget.toObject()
			await this.can('disconnect', user, source, objectPreviousTarget)
		}
		const objectTarget = await target.toObject()
		await this.target.canDisconnectPrevious(user, objectTarget)
		await this.can('connect', user, source, objectTarget)
	}

	async doConnect(source, target) {
		const previousTarget = source.get(this.name)
		if (previousTarget) {
			if (previousTarget.equals(target)) return true
			const objectPreviousTarget = await previousTarget.toObject()
			this.target.disconnectAction(source, objectPreviousTarget)
		}
		const objectTarget = await target.toObject()
		await this.target.doDisconnectPrevious(objectTarget)
		this.target.connectAction(source, objectTarget)
	}

	async canDisconnectPrevious(user, source) {
		const previousTarget = source.get(this.name)
		if (!previousTarget) return true
		const objectPreviousTarget = await previousTarget.toObject()
		await this.can('disconnect', user, source, objectPreviousTarget)
	}

	async doDisconnectPrevious(source) {
		const previousTarget = source.get(this.name)
		if (!previousTarget) return true
		const objectPreviousTarget = await previousTarget.toObject()
		this.target.disconnectAction(source, objectPreviousTarget)
	}

	async canDisconnect(user, source, target) {
		const objectTarget = await target.toObject()

		return this.can('disconnect', user, source, target)
	}

	async doDisconnect(source, target) {
		const objectTarget = await target.toObject()

		this.target.disconnectAction(source, target)
	}

	canApplyOp(user, op, object) {
		if (op instanceof SetOp) return this.canConnect(user, object, op.value)
		if (op instanceof UnsetOp) return this.doDisconnectPrevious(user, object)
		throw new Error(`[ OneField ] invalid operation`)
	}

	doApplyOp(op, object) {
		if (op instanceof SetOp) return this.doConnect(object, op.value)
		if (op instanceof UnsetOp) return this.doDisconnectPrevious(object)
		throw new Error(`[ OneField ] invalid operation`)
	}
}
