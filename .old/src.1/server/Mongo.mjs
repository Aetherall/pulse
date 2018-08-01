import mongo from 'mongodb'

export default class Mongo {
	constructor({ url, db, rs = 'rs' }) {
		this.client = new mongo.MongoClient(url, { useNewUrlParser: true, replicaSet: rs })
		this.connection = this.connect()
	}

	async connect() {
		try {
			await this.client.connect()
		} catch (e) {
			console.error('[ DB - Mongo ] Error connecting to server, retrying in 5s .......', e)
			setTimeout(this.connect, 5000)
		}
		this.connection = this.client
		return this.client
	}

	get db() {
		return this.connection
	}
}
