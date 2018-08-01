export default function stringToPrimitive(value) {
	switch (value) {
		case 'string':
		case 'String':
			return String
		case 'number':
		case 'Number':
			return Number
		case 'json':
		case 'Json':
		case 'JSON':
			return JSON
		default:
			return false
	}
}
