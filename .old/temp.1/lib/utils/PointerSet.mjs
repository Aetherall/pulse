export default class PointerSet extends Set {
	constructor(core) {
		super()
		this.core = core
	}

	addAll(arr) {
		for (const item of arr) item instanceof this.core.Pointer ? this.add(item) : this.add(new this.core.Pointer(item))
		return this
	}

	log() {
		this.forEach(i => console.log(i))
	}
}
