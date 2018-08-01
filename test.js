class Node {
	constructor(name) {
		this.name = name
		this.deps = new Set()
	}

	addEdge(node) {
		this.deps.add(node)
	}
}

const a = new Node('a')
const b = new Node('b')
const c = new Node('c')
const e = new Node('e')
const d = new Node('d')

a.addEdge(b)
a.addEdge(d)
b.addEdge(c)
b.addEdge(e)
c.addEdge(d)
c.addEdge(e)



class Stepper{

  constructor(nodes){
    this.nodes = nodes
    this.
  }

}