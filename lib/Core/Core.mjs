import { ObjectCache, PointerCache } from '../Cache'
import { Collection, Pointer } from '../Object'
import { CollectionManager, RelationManager } from '../Meta'
import { Action, Stepper } from '../Process'

import { O } from '.'

export default class Core {
	constructor() {
		this.proxified = {
			Pointer,
			Action,
			Stepper,
			Collection
		}

		const cm = new CollectionManager(this)
		const rm = new RelationManager(this)
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
