const { test, expect, describe, beforeEach } = require("@playwright/test");
const {login, createBlog, createUser} = require('./helper')


beforeEach(async ({ request, page }) => {
  const response = await request.post("/api/testing/reset");
  await createUser(request)
  await page.goto("/");
});
describe("Blog app", () => {
  test("Login form is shown", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  describe("Login", () => {
    test("passes with correct credentials", async ({ page }) => {
      await login(page);
      await expect(page.getByRole('button', {name: 'Logout'})).toBeVisible()
      await expect(page.getByText("Paul")).toBeVisible();
    });
    test('fails with wrong credentilas', async({page}) => {
      await login(page, undefined, '8292')
      await expect(page.getByText('Invalid username or password')).toBeVisible()
    })
  });
  describe('when logged in creating blog', ()=>{
    test('succeeds with with correct parameters', async({page})=>{
      await login(page)
      await createBlog(page)
      await expect(page.getByText('end to end testing')).toBeVisible()
    })
    test('fails if all fields are not provided', async({page}) => {
      await login(page)
      await createBlog(page, '')//empty 
      await expect(page.getByText('Blog validation failed')).toBeVisible()
    })
  })
   describe('operations on blog', () => {
    beforeEach(async({page}) => {
      await login(page)
      await createBlog(page, 'initial blog', 'keling', 'http://logdh')
      await page.getByRole('button', {name: 'Logout'}).click()
    })
    test('a blog can be liked', async({page}) => {
      const blogElement = await page.getByText('initial blog').locator('..')
      await blogElement.getByRole('button', {name: 'view'}).click()

      await expect (blogElement.getByText('likes: 0')).toBeVisible()
      await blogElement.getByRole('button', {name: 'like'}).click()
      await expect(blogElement.getByText('likes: 1')).toBeVisible()
    })
  })
});
