export default class RelationManager extends Map {
	constructor() {
		super()
	}

	getUniqueName(source, target) {
		return (String(source) + String(target)).sort()
	}

	getBond(uniqueName) {
		return super.has(uniqueName) ? super.get(uniqueName) : super.set(uniqueName, new Map()), super.get(uniqueName)
	}

	get(source, target, name) {
		const uniqueName = this.getUniqueName(source, target)
		const bond = this.getBond(uniqueName)
		if (name) return bond.get(name)
		else return bond.get('default')
	}

	add(source, config) {
		const target = config.type
		const uniqueName = this.getUniqueName(source, target)
		const bond = this.getBond(uniqueName)
		if (bond.has(config.relation)) bond.get(config.relation).bind(source, config)
		else
			bond.set(
				config.relation,
				new Relation({
					typename: source,
					field: config.field,
					many: config.many,
					relation: config.relation,
					perm: config.perm
				})
			)
	}
}

/*

typename
fieldname
many
targetTypename
targetRelation
connect
disconnect

*/

class Relation {
	constructor({ typename, field, many, relation, perm }) {
		const Relation = many ? RelationMany : RelationOne
		if (perm && perm.connect) this.setPerm('connect', true, perm.connect)
		if (perm && perm.disconnect) this.setPerm('disconnect', true, perm.disconnect)
		this.source = new Relation(typename, field, this.getPerm('connect', true), this.getPerm('disconnect', true))
	}

	setPerm(action, isSource, func) {
		if (isSource) this.perm[action] = func
		else this.perm[action] = (user, source, target) => func(user, target, source)
	}

	getPerm(action, isSource) {
		if (isSource) return this.perm[action]
		else return (user, source, target) => this.perm[action](user, target, source)
	}

	bind({ typename, field, many, relation, perm }) {
		const Relation = many ? RelationMany : RelationOne
		if (perm && perm.connect) this.setPerm('connect', false, perm.connect)
		if (perm && perm.disconnect) this.setPerm('disconnect', false, perm.disconnect)
		this.target = new Relation(typename, field, this.getPerm('connect', false), this.getPerm('disconnect', false))
		this.source.setTarget(this.target)
		this.target.setTarget(this.source)
	}
}

class RelationMany {}

class RelationOne {
	constructor(typename, field, connect, disconnect) {
		this.connectCheck = connect
		this.disconnectCheck = disconnect
		this.on = typename
		this.name = field
	}

	setTarget(target) {
		this.target = target
	}

	canSet(user, value, doc) {
		console.log(user, value, doc)
	}

	canGet(user, value, doc) {
		console.log(user, value, doc)
	}

	connectAction(target, source) {
		return savedTarget => source.set(this.name, savedTarget)
	}

	disconnectAction(target, source) {
		return savedTarget => source.unset(this.name)
	}

	async canConnect(user, source, originalSource, target, todo) {
		const previousTarget = originalSource && originalSource.get(this.name)

		if (previousTarget) {
			if (previousTarget.equals(target)) return true

			if (!(await this.disconnectCheck(user, source, previousTarget))) return false

			todo.add(this.target.disconnectAction(source, previousTarget))
		}

		await target.fetch()

		if (!(await this.target.canDisconnectPrevious(user, target, todo))) return false

		if (!(await this.connectCheck(user, source, target))) return false

		todo.add(this.target.connectAction(source, target))

		return true
	}

	async canDisconnectPrevious(user, source, todo) {
		const previousTarget = source.get(this.name)

		if (previousTarget) {
			await previousTarget.fetch()
			if (!(await this.disconnectCheck(user, source, previousTarget))) return false
			todo.add(this.target.disconnectAction(source, previousTarget))
		}

		return true
	}

	async canDisconnect(user, source, target, todo) {
		if (!(await this.disconnectCheck(user, source, target))) return false
		todo.add(this.target.disconnectAction(source, target))
		return true
	}
}
