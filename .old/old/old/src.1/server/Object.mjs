class Object {
	constructor(typename) {
		Pulse.CollectionManager.set(typename, this.constructor)
  }
  
  set(attr, value){
    const op = new SetOp(value)
    this.state.addOp(attr, op)
  }


	setState(state) {
		this.state.setLocal(state)
	}

	static fromJson(json) {
		const parsed = JSON.parse(json)
		const typename = parsed.typename
		const id = parsed.id
		const Collection = Pulse.CollectionManager.get(typename)
		const item = new Collection(id)
		item.state.setCurrent(parsed.state)
		return item
  }
  
  static can(action, user, item){

  }

	save(user) {
    if(this.exists){
      Pulse.Data.update(this)
    }else{
      await this.constructor.can('create', user, this)
      const restrictedData = await this.validate(user)
    }

  }

  destroy(user){
    if(this.exists){
      await this.constructor.can('destroy', user, this)
      Pulse.Database.
    }
  }

	create() {
		Pulse.create('Post', this.state.dirty)
	}
}

class State {
	constructor() {
		this.dbState = {}
		this.localState = {}
  }
  
  addOp(attr, op){
    if(this)
  }

	setDb(state) {
		this.dbState = state
	}

	setLocal(state) {
		this.localState = state
	}

	get dirty() {
		const dirtyState = {}
		for (const localKey in this.localState) {
			if (!Pulse.equal(this.localState[localKey] !== this.dbState[localKey])) dirtyState[localKey] = this.localState[localKey]
		}
		return dirtyState
	}
}


class Post extends Pulse.Object{

  static title = String

  @p.get.or('author')
  static list = [String]

  @relation.many('Post_comments-Comment_post')
  static comments = ["Comment"]

  @p.connect()
  static images = ["Image"]

}

class Comment extends Pulse.Object{
  
  static message = String

  static post = 'Post'

}

class Image extends Pulse.Object {

  static url = String

  static height = Number

  static width = Number

}


const Post = {
  configuration: {
    global: {
      permissions:{
        create: (meta, user, document) => {
          meta.error('Not allowed')
        },
        update: (meta, user, document) => {

        },
        destroy: (meta, user, document) => {

        }

      }
    },
    fields:{
      title: {
        permissions: {
          set:(meta, user, value, item) => {
            if(user.isAdmin) return 'by Admin'
            meta.warn('This is not recommended')
            return value
          }
        }
      }
    }
  }
}