'use strict'

module.exports = function({ types }) {
  return {
    name: 'transform-remove-require',
    visitor: {
      CallExpression(path, state) {
        const blacklist = state.opts.blacklist || []

        const callee = path.get('callee')

        if (callee.node.name !== 'require') return
        if (path.node.arguments.length !== 1) return
        if (blacklist.indexOf(path.node.arguments[0].value) === -1) return

        if (path.parentPath.isExpressionStatement()) {
          path.remove()
        } else {
          path.replaceWith(createVoid0())
        }
      },
    },
  }

  function createVoid0() {
    return types.unaryExpression('void', types.numericLiteral(0))
  }
}
