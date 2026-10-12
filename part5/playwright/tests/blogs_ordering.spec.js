const {describe, test, beforeEach, expect} = require('@playwright/test')
const {createUser} = require('./helper')
beforeEach(async({request, page}) => {
  await request.post('/api/testing/reset') //clear database
  await createUser(request, 'qwert', 'Hellas') //create new user

  //create multiple blogs
  await request.post('/api/testing/seed', {
    data: {
      username: 'qwert',
      blogs: [
        { title: "Blog with low likes", author: "Author A", url: "http://a.com", likes: 2 },
        { title: "Blog with highest likes", author: "Author B", url: "http://b.com", likes: 15 },
        { title: "Blog with medium likes", author: "Author C", url: "http://c.com", likes: 7 }
      ]
    }
  })

  await page.goto('/')
})

test('blogs are arranged in descending order of likes', async({page}) => {
  const blogElements = page.locator('.blog')
  await expect(blogElements.nth(0)).toContainText('Blog with highest likes')
  await expect(blogElements.nth(1)).toContainText('Blog with medium likes')
  await expect(blogElements.nth(2)).toContainText('Blog with low likes')
})