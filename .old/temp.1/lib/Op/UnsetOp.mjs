import Op from './Op'

export default class UnsetOp extends Op {
	mergeWith() {
		return new UnsetOp()
	}

	applyTo() {
		return undefined
	}
}
