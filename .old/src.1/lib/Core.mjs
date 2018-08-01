import Pointer from './Pointer'
import PointerCache from './PointerCache'

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
		this.Pointer = Pointer
		this.OneOp = OneOp
		this.ManyOp = ManyOp
		this.SetOp = SetOp
		this.UnsetOp = UnsetOp
		this.jsonToOp = jsonToOp
		this.Action = Action
		this.Stepper = Stepper
		this.CollectionManager = new Map()
	}

	cache(core) {
		core.cache = {
			pointer: new PointerCache(core.proxy)
		}
		core.O = new O(core.proxy)
	}
}
