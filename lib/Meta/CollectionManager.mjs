import { FieldOne, FieldMany, Field } from '.'
import { Collection } from '..'

function getAttributes(collection) {
	return Object.getOwnPropertyNames(collection).filter(name => !['prototype', 'name', 'length'].includes(name))
}

function createField(name, config) {
	const { relation, array, type } = getType(config.type)
	if (relation && array) return new FieldMany(name, { ...config, type })
	if (relation) return new FieldOne(name, { ...config, type })
	return new Field(name, { ...config, type })
}

export default class CollectionManager extends Map {
	constructor(core) {
		super()
		this.core = core
	}

	register(collection) {
		const keys = getAttributes(collection)
		for (const key of keys) {
			const field = createField(key, collection[key])
			if (field instanceof FieldOne || field instanceof FieldMany) this.core.static.RM.register(collection, field)
			collection[key] = field
		}
		super.set(collection.name, collection)
	}

	get(typename) {
		if (super.has(typename)) return super.get(typename)
		throw new Error(`[ Pulse - Collection Manager ] Collection ${typename} not found`)
	}
}

function resolveType(value) {
	if (value.prototype instanceof Collection) return { relation: true, type: value.name }
	return { type: value }
}

function getPrimitive(value) {
	switch (value) {
		case 'string':
		case 'String':
			return String
		case 'number':
		case 'Number':
			return Number
		case 'json':
		case 'Json':
		case 'JSON':
			return JSON
		default:
			return false
	}
}

function getType(value) {
	if (typeof value === 'string') return { relation: !getPrimitive(value), type: value }
	if (value instanceof Array) return { array: true, ...getType(value[0]) }
	if (typeof value === 'function') return resolveType(value)
	if (typeof value === 'object') {
		const { type, ...config } = value
		return { config, ...getType(type) }
	}
	throw new Error('Undefined type')
}
