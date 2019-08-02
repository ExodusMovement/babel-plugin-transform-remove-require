const fs = require('fs-extra')
const path = require('path')
const babel = require('@babel/core')

const fixturesPath = path.join(__dirname, 'fixtures')
const pluginPath = './lib/index.js'

describe('babel-plugin-transform-remove-require', () => {
  const fixtures = fs
    .readdirSync(fixturesPath)
    .filter((dir) => fs.lstatSync(path.join(fixturesPath, dir)).isDirectory())

  for (let fixture of fixtures) {
    const fixturePath = path.join(fixturesPath, fixture)
    const actualPath = path.join(fixturePath, 'actual.js')
    const expectedPath = path.join(fixturePath, 'expected.js')
    const optionsPath = path.join(fixturePath, 'options.json')

    test(fixture, async () => {
      const actual = await fs.readFile(actualPath, 'utf-8')
      const expected = await fs.readFile(expectedPath, 'utf-8')

      let pluginOptions = {}

      if (fs.existsSync(optionsPath)) {
        const options = await fs.readFile(optionsPath, 'utf-8')
        pluginOptions = JSON.parse(options)
      }

      const babelOpts = {
        plugins: [[pluginPath, pluginOptions]],
      }

      const actualTransformed = await babel.transformAsync(actual, babelOpts)
      const actualCode = actualTransformed.code

      expect(actualCode).toBe(expected)
    })
  }
})
