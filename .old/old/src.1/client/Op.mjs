import { equal } from 'assert';

class SetOp {
	constructor(value) {
		this._value = value
	}

	applyTo(value) {
		return this._value
	}

	mergeWith(previous) {
		return new SetOp(this._value)
	}
}

class UnsetOp {
	applyTo(value) {
		return undefined
	}

	mergeWith(previous) {
		return new UnsetOp()
	}
}

export class AddOp extends Op {
	constructor(value) {
		super()
		this._value = Array.isArray(value) ? value : [value]
	}

	applyTo(value) {
		if (value == null) {
			return this._value
		}
		if (Array.isArray(value)) {
			return value.concat(this._value)
		}
		throw new Error('Cannot add elements to a non-array value')
	}

	mergeWith(previous) {
		if (!previous) {
			return this
		}
		if (previous instanceof SetOp) {
			return new SetOp(this.applyTo(previous._value))
		}
		if (previous instanceof UnsetOp) {
			return new SetOp(this._value)
		}
		if (previous instanceof AddOp) {
			return new AddOp(this.applyTo(previous._value))
		}
		throw new Error('Cannot merge Add Op with the previous Op')
	}
}

class ConnectOp {
	constructor(value){
		return new RelationOp(value)
	}

}

class RelationManyOp {
	constructor(toAdd, toRemove) {
		this.toAdd = toAdd
		this.toDelete = toRemove
	}

	applyTo(value) {
		if (!this.value) return this._value
	}

	mergeWith(previous) {
		const toAdd = []
		const toRemove = []
		for(const previousToAdd of previous.toAdd){
			if(toAdd)
		}
		return new RelationOp(this._value)
	}
}

class Pointer {
	constructor(typename, id, localId){
		const p = Pulse.Cache.getPointer(typename, id, localId)
		if(p) return p
		this.typename = typename
		this.id = id
		this.localId = localId
	}


}

function uniqueArray(arr){
	const unique = []
	for(const item of arr){
		if(!unique.some(element => equals(element, item))) unique.push(item)
	}
}