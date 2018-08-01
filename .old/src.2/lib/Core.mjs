import Pointer from './Pointer'
import PointerCache from './PointerCache'
import ObjectCache from './ObjectCache'
import Collection from './Collection'

import CollectionManager from './CollectionManager'

import Action from './Action'
import Stepper from './Stepper'

import jsonToOp from './Op/jsonToOp'
import OneOp from './Op/OneOp'
import ManyOp from './Op/ManyOp'
import SetOp from './Op/SetOp'
import UnsetOp from './Op/UnsetOp'

import O from './O'

export default class Core {
	constructor() {
		this.proxified = {
			Pointer,
			OneOp,
			ManyOp,
			SetOp,
			UnsetOp,
			jsonToOp,
			Action,
			Stepper,
			Collection
		}

		const cm = new CollectionManager()
		this.static = {
			CM: cm,
			CollectionManager: cm,
			Collection
		}
		// this.Pointer = Pointer
		// this.OneOp = OneOp
		// this.ManyOp = ManyOp
		// this.SetOp = SetOp
		// this.UnsetOp = UnsetOp
		// this.jsonToOp = jsonToOp
		// this.Action = Action
		// this.Stepper = Stepper
		// this.CollectionManager = new CollectionManager()
		// this.Collection = Collection
		// this.CM = this.CollectionManager
	}

	cache(core) {
		core.static.cache = {
			pointer: new PointerCache(core.proxy),
			object: new ObjectCache(core.proxy)
		}
		core.static.O = new O(core.proxy)
	}
}
