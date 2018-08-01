import stringToPrimitive from './utils/stringToPrimitive'

class SchemaManager {
	constructor() {
		this.collections = new Map()
		this.relations = new Map()
	}

	registerRelation(typename, field, fieldConfig) {
		const targetTypename = fieldConfig.type
	}

	registerCollection(name, collection) {
		const fields = Object.getOwnPropertyNames(collection).filter(f => !BLACKLIST.includes(f))
		for (const fieldname of fields) collection[fieldname] = getField(collection, fieldname)
	}
}

function getField(collection, fieldname) {
	const fieldConfig = getType(collection[fieldname])
	if (fieldConfig.relation) return new RelationField(collection, fieldname, fieldConfig)
	return new Field(collection, fieldname, fieldConfig)
}

function getType(value) {
	if (typeof value === 'string') return { relation: !!stringToPrimitive(value), type: value }
	if (typeof value === 'array') return { array: true, ...getType(value[0]) }
	if (typeof value === 'function') return resolveType(value)
	if (typeof value === 'object') {
		const { type, ...config } = value
		return { config, ...getType(type) }
	}
	throw new Error('Undefined type')
}

class Field {
	constructor(collection, name, config) {
		this.collection = collection
		this.name = name
		this.config = config
	}

	set(user, value, object) {
		if (!this.can('set', user, value, object)) throw new Error(`[ FIELD ] User cannot set ${this.name}`)
		return new SetOp(value)
	}

	unset(user, object) {
		if (!this.can('set', user, undefined, object)) throw new Error(`[ FIELD ] User cannot unset ${this.name}`)
		return new UnsetOp(value)
	}

	add(user, value, object) {
		if (!this.can('set', user, value, object)) throw new Error(`[ FIELD ] User cannot set ${this.name}`)
		return new AddOp(value)
	}

	connect() {
		throw new Error(`[ FIELD ] Field ${this.name} is not a relation field`)
	}

	disconnect() {
		throw new Error(`[ FIELD ] Field ${this.name} is not a relation field`)
	}
}

class RelationField {
	constructor(collection, name, config) {
		this.collection = collection
		this.name = name
		this.config = config

		this._target = config.type
		this.many = config.array
		this.connect = config.perm.connect
		this.disconnect = config.perm.disconnect
	}

	connect(user, value, object) {
		if (Array.isArray(object) && !this.many) throw new Error('Cannot connect many object to a One Relation Field')
		if (Array.isArray(object) && object.map(o => this.can('connect', user, value, o)).some(can => !can)) throw new Error(`[ RELATION FIELD ] User cannot connect ${this.name}`)
		if (!Array.isArray(object) && !this.can('connect', user, value, object)) throw new Error(`[ RELATION FIELD ] User cannot connect ${this.name}`)
		if (this.many) return new AddUniqueOp(object)
		if (!this.many) return new SetOp(object)
	}

	beforeConnect(source, target) {
		if (!this.many) source.disconnect()
		if (!target.many) target.disconnect()
	}
}
