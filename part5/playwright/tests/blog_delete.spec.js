const {beforeEach, describe, test, expect} = require ('@playwright/test')
const {login, createBlog, createUser} = require('./helper')

beforeEach(async({request, page}) => {
  await request.post('/api/testing/reset')
  createUser(request)
  createUser(request, 'asdf', 'Arto')
  await page.goto('/')
})

describe('Blog app', ()=>{
  describe('delete button', ()=>{
    test('is shown if logged user is the creator', async({page}) => {
      await login(page)
      await createBlog(page, 'delete button is shown')
      const blogElement = page.getByText('delete button is shown').locator('..')
      await blogElement.getByRole('button', {name: 'view'}).click()
      await expect(blogElement.getByRole('button', {name: 'Delete'})).toBeVisible()
    })
    test('is not shown if logged user is not the creator', async({page}) => {
      await login(page)
      await createBlog(page, 'delete button is hidden')
      await page.getByRole('button', {name: 'Logout'}).click()
      await login(page, 'asdf')
      const blogElement = page.getByText('delete button is hidden').locator('..')
      await blogElement.getByRole('button', {name: 'view'}).click()
      await expect(blogElement.getByRole('button', {name: 'Delete'})).not.toBeVisible()
    })
  })

  describe('deleting a blog', () => {
    test('is possible only by creator', async({page})=>{
      await login(page)
      await createBlog(page, 'this blog can be deleted by creator')
      await expect(page.getByText('this blog can be deleted by creator')).toBeVisible()

      const blogElement = page.getByText('this blog can be deleted by creator').locator('..')
      await blogElement.getByRole('button', {name: 'view'}).click()
      
      page.once('dialog', async(dialog) => {
        await dialog.accept()
      })
      await blogElement.getByRole('button', {name:'Delete'}).click()

      await expect(page.getByText('this blog can be deleted by creator')).not.toBeVisible() 
    })
  })
})