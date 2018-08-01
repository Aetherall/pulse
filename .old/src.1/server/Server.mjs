export default class Server {
	constructor(db) {
		this.db = db
	}

	handle(req, res) {
		const user = req.user
		const payload = req.body
	}
}
