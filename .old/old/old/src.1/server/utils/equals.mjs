import Pulse from '../Pulse.mjs'

export default function equals(a, b) {
	if (a === b) return true
	if (a.constructor && b.constructor && a.constructor !== b.constructor) return false
	if (a instanceof Pulse.Pointer && b instanceof Pulse.Pointer) return Pulse.Pointer.equals(a, b)
	if (a instanceof Pulse.Object) return Pulse.Object.equals(a, b)
	return false
}
