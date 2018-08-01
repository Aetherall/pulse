import { NoOp, SetOp, UnsetOp, AddOp, RemoveOp, ArrayOp } from './Op'

class OperationSet extends Set {
	// Operation manager
	// LocalId for each operation
	// All Operation on an attribute are stored To an OperationSet
	// On compute (for eval or send to srv) all operations are merged and the Ops local Ids are registered on the fresh op
	// On the server the operation is executed and the ids are bond to the response
	// on the client reception, the ids are analysed and the corresponding ops are removed from the operationSet
	// this allows to make edits on the client while the request is pending
	// ! NOTE The client should not make another save if the previous one is not completed yet
}

class State {
	constructor() {
		this.safe = new Map()
		this.operations = new Map()
	}

	get(attr) {
		const baseValue = this.safe.get(attr)
		const mutator = this.operations.get(attr) || new NoOp()
		return mutator.applyTo(baseValue)
	}

	applyOp(attr, op) {
		const prev = this.operations.get(attr) || new NoOp()
		const next = prev.mergeWith(op)
		this.operations.set(attr, next)
	}
}

let c = 0

export default class Collection {
	constructor() {
		this.state = new State()
		this.id = c++
	}

	getField(attr) {
		if (!this.constructor[attr]) throw new Error('Undefined field')
		return this.constructor[attr]
	}

	applyOpToState(attr, op) {
		this.state.applyOp(attr, op)
	}

	get(attr) {
		return this.state.get(attr)
	}

	async applyOp(attr, op) {
		const user = {}
		const field = this.getField(attr)
		await field.canApplyOp(user, op, this)
		this.applyOpToState(attr, op)
		field.doApplyOp(op, this)
		return this
	}

	set(attr, value) {
		return this.applyOp(attr, new SetOp(value))
	}

	unset(attr) {
		return this.applyOp(attr, new UnsetOp())
	}

	add(attr, value) {
		return this.applyOp(attr, new AddOp(value))
	}

	remove(attr, value) {
		return this.applyOp(attr, new RemoveOp(value))
	}

	equals(object) {
		return this === object
	}
}
