const {test, describe} = require('node:test')
const assert = require('node:assert')
const totalLikes = require('../utils/list_helper').totalLikes

describe('total likes of', () => {
  test('empty list is zero', () => {
    assert.strictEqual(totalLikes([]), 0)
  })

  test('a list with one blog equals to likes of that blog', () => {
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
    const likes = blog[0].likes
    assert.strictEqual(totalLikes(blog), likes)

  })

  test('a big list is calculated right', () => {
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

    const result = blogs.reduce((acc, cur)=> acc+cur.likes, 0)
    console.log('result', result)
    assert.strictEqual(totalLikes(blogs), result)
  })
})