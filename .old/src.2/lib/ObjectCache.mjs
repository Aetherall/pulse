export default class ObjectCache extends Map {
	constructor(core) {
		super()
		this.core = core
		this.counter = 0
	}

	create(object) {
		const localId = this.counter++
		const pointer = this.core.cache.pointer.get({ typename: object.typename, localId })
		super.set(pointer, object)
		return pointer
	}
}
