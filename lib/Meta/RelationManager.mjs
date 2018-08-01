export default class RelationManager extends Map {
	constructor() {
		super()
	}

	getUniqueName(source, target) {
		return (String(source) + String(target))
			.split('')
			.sort()
			.join('')
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

	register(source, field) {
		const uniqueName = this.getUniqueName(source.name, field.type)
		const bond = this.getBond(uniqueName)
		if (bond.has(field.id)) return bond.get(field.id).bind(source, field)
		return bond.set(field.id, new Relation(source, field))
	}

	// add(source, config) {
	// 	const target = config.type
	// 	const uniqueName = this.getUniqueName(source, target)
	// 	const bond = this.getBond(uniqueName)
	// 	if (bond.has(config.relation)) bond.get(config.relation).bind(source, config)
	// 	else
	// 		bond.set(
	// 			config.relation,
	// 			new Relation({
	// 				typename: source,
	// 				field: config.field,
	// 				many: config.many,
	// 				relation: config.relation,
	// 				perm: config.perm
	// 			})
	// 		)
	// }
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

function reverse(f) {
	return (a, b, c, ...rest) => f(a, c, b, ...rest)
}

class Relation {
	constructor(source, field) {
		this.perm = {}
		this.source = source
		this.sourceField = field
		if (field.perm && field.perm.connect) this.setPerm('connect', field.perm.connect)
		if (field.perm && field.perm.disconnect) this.setPerm('disconnect', field.perm.disconnect)
		field.setRelation(this, true)
	}

	executePerm(isSource, action, ...args) {
		if (!this.perm[action]) return
		if (isSource) return this.perm[action](...args)
		return reverse(this.perm[action])(...args)
	}

	getPerm(action, isSource) {
		if (isSource) return this.perm[action]
		return reverse(this.perm[action])
	}

	setPerm(action, func) {
		if (!this.perm[action]) this.perm[action] = func
	}

	bind(target, field) {
		this.target = target
		this.targetField = field
		if (field.perm && field.perm.connect) this.setPerm('connect', field.perm.connect)
		if (field.perm && field.perm.disconnect) this.setPerm('disconnect', field.perm.disconnect)
		field.setRelation(this, false)
		this.targetField.setTarget(this.sourceField)
		this.sourceField.setTarget(this.targetField)
	}
}
