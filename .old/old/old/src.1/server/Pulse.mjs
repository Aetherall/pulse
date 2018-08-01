import * as CollectionManager from './CollectionManager'

import Object from './Object'

import equals from './utils/equals'

const Pulse = {
	CollectionManager,
	Object
}

global.Pulse = Pulse

console.log(Pulse)

export default Pulse
