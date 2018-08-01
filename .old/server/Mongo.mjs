import mongo from 'mongodb'
import Session from './Session'

export default class Mongo {
	constructor({ url, db, rs = 'rs', name = 'default' }) {
		this.client = new mongo.MongoClient(url, { useNewUrlParser: true, replicaSet: rs })
		this.connection = this.connect()
		this.name = name
	}

	async connect() {
		try {
			await this.client.connect()
		} catch (e) {
			console.error('[ DB - Mongo ] Error connecting to server, retrying in 5s .......', e)
			setTimeout(this.connect.bind(this), 5000)
			return
		}
		this.connection = this.client.db(this.name)
		console.log('[ DB - Mongo ] Connected')
		return this.connection
	}

	get db() {
		return this.connection
	}

	async createSession(core) {
		await this.db
		const session = this.client.startSession()
		return new Session(core, this.db, session)
	}
}

// const db = new Mongo({
// 	url: 'mongodb://localhost:27017,localhost:27018,localhost:27019?replicaSet=rs'
// })
// ;(async () => {
// 	await db.connection
// 	const res = await db.connection.collection('Post').insert({ hello: 'world' })
// 	res //?
// 	const id = res.insertedIds[0]
// 	id //?
// 	const r = await db.findByPointer({ typename: 'Post', id: id })
// 	console.log(r)
// })()
