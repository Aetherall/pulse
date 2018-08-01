import { SetOp, UnsetOp, AddOp, RemoveOp, ArrayOp, NoOp } from '..'
import Pointer from './Pointer.mjs'

function toPointer(object) {
	if (object instanceof Collection) return object.pointer
	if (object instanceof Array) object.map(toPointer)
	return object
}

class State {
	constructor(collection) {
		this.collection = collection
		this.safe = new Map()
		this.operations = new Map()
	}

	get(attr) {
		const baseValue = this.safe.get(attr) || this.collection.getField(attr).default
		const mutator = this.operations.get(attr) || new NoOp()
		return mutator.applyTo(baseValue)
	}

	applyOp(attr, op) {
		const prev = this.operations.get(attr) || new NoOp()
		const next = prev.mergeWith(op)
		this.operations.set(attr, next)
	}
}

export default class Collection {
	constructor(core, pointer) {
		if (pointer && core.cache.object.has(pointer)) return core.cache.object.get(pointer)
		this.core = core
		this.pointer = core.cache.pointer.create(this)
		this.state = new State(this)
		this.core.cache.object.register(this)
	}

	get typename() {
		return this.constructor.name
	}

	getField(attr) {
		if (!this.constructor[attr]) throw new Error('Undefined field')
		return this.constructor[attr]
	}

	applyOpToState(attr, op) {
		this.state.applyOp(attr, op)
	}

	get(attr) {
		return this.state.get(attr) || this.getField(attr).default
	}

	async applyOp(attr, op) {
		const user = {}
		const field = this.getField(attr)
		await field.canApplyOp(user, op, this)
		this.applyOpToState(attr, op)
		await field.doApplyOp(op, this)
		return this
	}

	async applyOps(ops) {
		for (const key of ops.keys()) {
			await this.applyOp(key, ops.get(key))
		}
		return this
	}

	set(attr, value) {
		const pointerized = toPointer(value)
		return this.applyOp(attr, new SetOp(pointerized))
	}

	unset(attr) {
		return this.applyOp(attr, new UnsetOp())
	}

	add(attr, value) {
		const pointerized = toPointer(value)
		return this.applyOp(attr, new AddOp(pointerized))
	}

	remove(attr, value) {
		const pointerized = toPointer(value)
		return this.applyOp(attr, new RemoveOp(pointerized))
	}

	equals(item) {
		if (item instanceof Pointer) return this.pointer === item
		if (item instanceof Collection) return this === item
		return false
	}

	toPointer() {
		return this.pointer
	}
}
