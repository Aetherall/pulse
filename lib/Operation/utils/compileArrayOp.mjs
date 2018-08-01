import { NoOp, RemoveOp, AddOp, ArrayOp } from '..'

export default function compileArrayOp(add, remove) {
	const common = add.common(remove)
	add.deleteAll(common)
	remove.deleteAll(common)
	if (!add.size && !remove.size) return new NoOp()
	if (!add.size && remove.size) return new RemoveOp(remove)
	if (add.size && !remove.size) return new AddOp(add)
	if (add.size && remove.size) return new ArrayOp(add, remove)
	throw new Error('[ CRITICAL ]')
}
