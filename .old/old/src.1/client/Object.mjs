function resolveType(value) {
	if (value.prototype instanceof PulseObject) return { relation: true, type: value.name }
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
	if (typeof value === 'string') return { relation: !!getPrimitive(value), type: value }
	if (typeof value === 'array') return { array: true, ...getType(value[0]) }
	if (typeof value === 'function') return resolveType(value)
	if (typeof value === 'object') {
		const { type, ...config } = value
		return { config, ...getType(type) }
	}
	throw new Error('Undefined type')
}

// class Relation {
// 	constructor() {}
// }

// class RelationCache {
// 	constructor() {
// 		this.cache = {}
// 		this.pending = {}
// 	}

// 	add(typename, fieldName, targetTypename) {
// 		const typesId = (typename + targetTypename).sort()
// 		const actualBond = this.cache[typesId]
// 		if (actualBond) {
// 		}
// 		const pendingBond = this.pending[typesId]
// 		if (pendingBond) {
// 			const { typename, fieldname, config } = pendingBond
// 		}
// 	}

// 	get(source, sourceField, target, targetField) {
// 		const sourceTypename = collection.name
// 		return this.cache[sourceTypename][sourceField]
// 	}
// }

class AttributeState {
	constructor(basevalue) {
		this.basevalue = basevalue
		this.op = new NoOp(basevalue)
	}

	get value() {
		return this.op.value
	}

	set(op) {
		const value = this.value
		const newOp = op.mergeWith(this.op)
		this.op = newOp
	}

	setBaseValue(basevalue) {
		this.basevalue = basevalue
		//this.op = new NoOp(basevalue)
	}
}

class State {
	constructor(collection, initialState) {
		this.attributes = new Map()
	}

	get(attr) {
		return this.attributes.get(attr).value
	}

	set(attr, op) {
		const attributeState = this.attributes.get(attr)
		if (!attributeState) return this.attributes.set(attr, new AttributeState(op))
		attributeState.set(op)
	}

	setBaseValue(attr, value) {
		const attributeState = this.attributes.get(attr)
		if (!attributeState) return this.attributes.set(attr, new AttributeState(value))
		attributeState.setBaseValue(value)
	}
}

const SM = new SchemaManager()

const BLACKLIST = ['name', 'prototype', 'length']

class PulseObject {
	constructor() {
		this.state = new State()
	}

	static fromJson(json, override) {
		const parsed = parse(json)
		const { id, typename, createdAt, updatedAt, ...state } = parse(json)
		const Collection = Pulse.SchemaManager.getCollection(typename)
		const object = Pulse.StateManager.getObject(parsed)
		object.id = id
		object.createdAt = createdAt
		object.updatedAt = updatedAt
		object.getLocalState()
		if (override) object.setState(state)
		return object
	}

	getLocalState() {
		const identifier = this.getStateIdentifier()
		const state = Pulse.StateManager.get(identifier)
		if (state) return this.setState(state)
		const newState = Pulse.StateManager.new(identifier)
		return this.setState(newState)
	}

	setState(state) {
		if (state instanceof State) return this._setState(state)
		else return state
	}

	get(attr) {
		return this.state.get(attr)
	}

	getField(attr) {
		const config = this.constructor[attr]
		if (!config) throw new Error(`The attribute ${attr} does not exist on type ${this.constructor.name}`)
		return config
	}

	set(attr, value) {
		const field = this.getField(attr)
		const op = field.set(user, value, this)
		if (!field.can('set', user, value, this)) throw new Error('User not allowed')
		this.state.set(attr, new SetOp(value))
		return this
	}

	connect(attr, object) {
		const field = this.getField(attr)
		const op = field.connect(object)
		this.state.set(attr, op)
		return this
	}

	unset(attr) {
		const field = this.getField(attr)
		if (!field.can('set', user, undefined, this)) throw new Error('User not allowed')
		this.state.set(attr, new UnsetOp())
		return this
	}

	add(attr, value) {
		const field = this.getField(attr)
		if (!field.can('set', user, value, this)) throw new Error('User not allowed')
		this.state.set(attr, new AddOp(value))
		return this
	}

	_getSaveJson() {
		return {
			id: this.state.getOperationId
		}
	}

	save() {
		const data = this._getSaveJson()
		const params = this._getSaveParams()
		Pulse.data.save(data, params)
	}
}

class Post extends PulseObject {}

Post.title = {
	type: String,
	perm: {
		set: () => true,
		get: () => true
	},
	component: 'input'
}

Post.posts = Post
Post.desc = String

Post.aposts = {
	type: [Post],
	perm: {
		connect: (user, source, target) => {},
		disconnect: (user, source, target) => {}
	}
}

new Post().set('title', 'bonjour')

SM.registerCollection('Post', Post)

// p.connect(
// 	'activeComments',
// 	comment
// )
// p.disconnect('activeComments', comment)

// p.get('activeComments')

// p.add('activeComments', comment)
// p.remove('activeComments', comment)
