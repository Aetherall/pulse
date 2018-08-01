export default class PulseSet extends Set {
	map(f) {
		const r = new Set()
		for (const x of this) r.add(f(x))
		return r
	}

	exclude(b) {
		const r = new Set()
		for (const x in this) if (!b.has(x)) r.add(x)
		return r
	}

	hasExclusive(b) {
		for (const x of this) if (!b.has(x)) return true
		return false
	}

	some(f) {
		for (const x of this) if (f(x)) return true
	}

	addAll(arr) {
		for (const item of arr) this.add(item)
		return this
	}

	log() {
		this.forEach(i => console.log(i))
	}
}

export class PointerSet extends Set {
	constructor(core) {
		this.core = core
		super()
	}

	addAll(arr) {
		for (const item of arr) item instanceof this.core.Pointer ? this.add(item) : this.add(new this.core.Pointer(item))
		return this
	}

	log() {
		this.forEach(i => console.log(i))
	}
}
