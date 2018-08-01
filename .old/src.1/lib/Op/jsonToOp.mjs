export default function jsonToOp(core, json) {
	if (!json || !json.op) return null
	if (json.op === 'set') return new core.SetOp(json.value)
	if (json.op === 'unset') return new core.UnsetOp()
	if (json.op === 'one') return new core.OneOp(json)
	if (json.op === 'many') return new core.ManyOp(json)
}
