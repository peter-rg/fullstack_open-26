const {test, describe}= require('node:test')
const assert = require('node:assert')
const favouriteBlog = require('../utils/list_helper').favouriteBlog

describe('the favourite blog of', () => {
  test('an empty list is zero', () => {
    assert.strictEqual(favouriteBlog([]), 0)
  })

  test('a list with one blog is that blog', () => {
    const blog = [
      {
        _id: '6a7b6c932bfe173e6426d6c1',
        author: 'by',
        title: 'feedingg',
        url: 'haha',
        likes: 15,
        __v: 0
      }
    ]
    assert.strictEqual(favouriteBlog(blog), blog[0])
  })

  test('a bigger list is calculated', () => {
    const blogs = [
        {
          _id: '6a7b6ebe6b569df1e2995cca',
          author: 'Krugger mac',
          title: 'anetworking',
          url: '/wikipedia',
          likes: 22,
          __v: ('0')
        },
        {
          _id: '6a7b71025df7da8fc9cffd31',
          author: 'paul smith',
          title: 'can\'t belief',
          url: '/myths',
          likes: 12,
          __v: ('0')
        },
        {
          _id: '6a7b512f54b0fd7b3b8f1e63',
          url: 'james/farms',
          likes: 54,
          __v: ('0')
        }
    ]
    const favourite = favouriteBlog(blogs)
    assert.deepStrictEqual(favourite, blogs[2])
    console.log('favourite blog', favourite)
  })
})