const {test}= require('node:test')
const assert = require('node:assert')
const dummy = require('../utils/list_helper').dummy

test('dummy returns one', () => {
  // const blogs = ['baby']
  const result = dummy(['baby', 'james'])
  assert.strictEqual(result, 1)
})
