import mongo from 'mongodb'

export default class Session {
	constructor(core, db, session) {
		this.core = core
		this.db = db
		this.session = session
	}

	async findByPointer(pointer) {
		const typename = pointer.typename
		const id = pointer.id
		if (!id) throw new Error(`[ Pulse - DB ] Cannot find unsaved objects`)
		const res = await this.db.collection(typename).findOne({ _id: new mongo.ObjectId(id) }, { session: this.session })
		if (!res) throw new Error(`[ Pulse - DB ] could not find ${typename} of id ${id}`)
		const item = new this.core.O[typename](pointer)
		item.applySafe(res)
		return item
	}

	async update(pointer, data) {
		const typename = pointer.typename
		const id = pointer.id
		if (!id) throw new Error(`[ Pulse - DB ] Cannot update unsaved objects`)
		const res = await this.db.collection(typename).updateOne({ _id: new mongo.ObjectId(id) }, data, { session: this.session })
		return res
	}

	async insert(pointer, data) {
		const typename = pointer.typename
		const localId = pointer.localId
		if (!localId) throw new Error(`[ Pulse - DB ] Critical ! object does not have localId`)
		if (id) throw new Error(`[ Pulse - DB ] Cannot insert saved objects`)
		const res = await this.db.collection(typename).insertOne(data, { session: this.session })
		const id = res.insertedIds[0]
		pointer.id = id
		return pointer
	}

	async destroy(pointer) {
		const typename = pointer.typename
		const id = pointer.id
		if (!id) throw new Error(`[ Pulse - DB ] Cannot destroy unsaved objects`)
		const res = await this.db.collection(typename).deleteOne({ _id: new mongo.ObjectId(id) }, { session: this.session })
		return res
	}
}
