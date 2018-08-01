function jsonToOp(json) {
	if (!json || !json.op) return null
	if (json.op === 'set') return new SetOp(json.value)
	if (json.op === 'unset') return new UnsetOp()
	if (json.op === 'one') return new RelationOneOp(json)
	if (json.op === 'many') return new RelationManyOp(json)
}
