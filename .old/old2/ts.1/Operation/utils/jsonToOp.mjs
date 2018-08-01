import { SetOp, UnsetOp, AddOp, RemoveOp, ArrayOp } from '..'

export default function jsonToOp(core, json) {
	if (json.op === 'set') return SetOp.fromJSON(core, json)
	if (json.op === 'unset') return new UnsetOp()
	if (json.op === 'add') return AddOp.fromJSON(core, json)
	if (json.op === 'remove') return RemoveOp.fromJSON(core, json)
	if (json.op === 'array') return ArrayOp.fromJSON(core, json)
}
