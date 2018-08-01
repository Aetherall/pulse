class Modifier {
	constructor() {
		this.$set = {}
		this.$inc = {}
		this.$unset = {}
		this.$addToSet = {}
		this.$push = {}
		this.$pullAll = {}
		this.$pull = {}
	}

	applyOp(attr, op) {
		if (op instanceof AddOp) {
			this.$push[attr] = op.value
		}
	}
}

class Data {
	opToModifier(ops) {
		const modifier = {}
		for (const [attr, op] of ops.entries()) {
		}
	}

	update(item) {
		const data = item.getData()
		this.db.collection(item.typename).updateOne({ _id: item.id }, item.state.get())
	}
}
