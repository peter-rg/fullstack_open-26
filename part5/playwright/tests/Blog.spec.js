const { test, expect, describe, beforeEach } = require("@playwright/test");

const login = async (page, username = "qwert", password = "1234") => {
  await page.getByRole('button', {name: 'Login'}).click()
  await page.getByLabel("Username:").fill(username);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
};
const createBlog = async(page, title = 'end to end testing', author = 'peterym', url='https://lohd' ) => {
  await page.getByRole('button', {name: 'create new blog'}).click()
  await page.getByLabel('Title').fill(title)
  await page.getByLabel('Author').fill(author)
  await page.getByLabel('Url').fill(url)
  await page.getByRole('button', {name: 'Save'}).click()
}

beforeEach(async ({ request, page }) => {
  const response = await request.post("/api/testing/reset");
  await request.post("/api/users", {
    data: {
      name: "rymee",
      username: "qwert",
      password: "1234",
    },
  });
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
      await expect(page.getByText("rymee")).toBeVisible();
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
    test('fails if all field are not provided', async({page}) => {
      await login(page)
      await createBlog(page, '')//empty 
      await expect(page.getByText('Blog validation failed')).toBeVisible()
    })
  })
});
