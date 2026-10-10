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

const createUser = async(request, username='qwert', name='Paul', password='1234') => {
  await request.post('/api/users', {
    data: {
      username,
      name,
      password,
    }
  })
}
export {login, createBlog, createUser}