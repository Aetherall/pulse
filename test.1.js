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

function resolve(node, resolved) {
	console.log(node.name)
	for (const dep of node.deps) {
		resolve(dep, resolved)
	}
	resolved.push(node)
}

const resolved = []
resolve(a, resolved)

console.log(resolved)
