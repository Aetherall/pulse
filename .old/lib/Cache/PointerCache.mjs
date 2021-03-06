export default class PointerCache extends Map {
	constructor(core) {
		super()
		this.core = core
		this.counter = 0
	}

	newLocalId() {
		return this.counter++
	}

	create() {}

	get(config) {
		const { typename, id, localId } = config
		if (!typename || (!id && typeof localId === 'undefined')) throw new Error('A pointer should have a typename and an id or  localId')
		if (id && super.has(typename + id)) return super.get(typename + id)
		if (localId && super.has(typename + localId)) return super.get(typename + localId)
		const pointer = new this.core.Pointer(config, true)
		if (id) {
			super.set(typename + id, pointer)
			return pointer
		}
		if (localId) {
			super.set(typename + localId, pointer)
			return pointer
		}
	}

	set(typename, id, localId, pointer) {
		if (id) return super.set(typename + id, pointer)
		if (localId) return super.set(typename + localId, pointer)
		throw new Error('A pointer should have an id or a localId')
	}
}
