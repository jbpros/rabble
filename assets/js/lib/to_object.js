export default array =>
  array.reduce((objects, [k, v]) => Object.assign({}, objects, { [k]: v }), {})
