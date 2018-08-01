import { ObjectCache, PointerCache } from '../Cache'
import { Collection, Pointer } from '../Object'
import { CollectionManager, RelationManager } from '../Meta'
import { Action, Stepper } from '../Process'
import { jsonToOp, OneOp, ManyOp, SetOp, UnsetOp, Op } from '../Op'

import { PointerSet } from '../utils'
import { O } from '.'

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
			Collection,
			Op,
			PointerSet
		}

		const cm = new CollectionManager()
		const rm = new RelationManager()
		this.static = {
			CM: cm,
			RM: rm,
			CollectionManager: cm,
			RelationManager: rm,
			Collection
		}
	}

	cache(core) {
		core.static.cache = {
			pointer: new PointerCache(core.proxy),
			object: new ObjectCache(core.proxy)
		}
		core.static.O = new O(core.proxy)
	}
}
