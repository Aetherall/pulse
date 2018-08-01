import Collection from './Collection.mjs'

export default class Pointer {
	constructor(core, config) {
		this.core = core
		this.typename = config.typename
		this.id = config.id
		this.localId = config.localId
	}

	static local(core, config) {
		return new Pointer(core, config)
	}

	static tryCache(core, config) {
		if (core.cache.pointer.has(config)) return core.cache.pointer.get(config)
		return new Pointer(core, config)
	}

	async toObject() {
		if (this.core.cache.object.has(this)) return this.core.cache.object.get(this)
		return new this.core.O[this.typename](this)
		if (this.id) return this.fetch()
		return new this.core.O[this.typename](this)
	}

	fetch() {
		return null
	}

	equals(item) {
		if (item instanceof Collection) return this === item.pointer
		if (item instanceof Pointer) return this === item
		return false
	}

	toJSON() {
		return {
			typename: this.typename,
			id: this.id,
			localId: this.localId
		}
	}
}
