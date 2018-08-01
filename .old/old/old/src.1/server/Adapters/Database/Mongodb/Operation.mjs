function OperationToMongo(op) {
	if (op instanceof Pulse.Operation.Set) return '$set'
	if (op instanceof Pulse.Operation.Unset) return '$unset'
	if (op instanceof Pulse.Operation.Increment) return '$inc'
	if (op instanceof Pulse.Operation.Decrement) return '$inc'
	if (op instanceof Pulse.Operation.AddUnique) return '$addToSet'
	if (op instanceof Pulse.Operation.Remove) return '$pull'
	if (op instanceof Pulse.Operation.RemoveUnique) return '$pullAll'
}
