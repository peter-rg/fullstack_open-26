import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './blogForm'

test('<BlogForm /> calls createBlog with corrrect details', async() => {
  const blog = {
    title: 'BlogForm testing',
    author: 'Arto',
    url: 'Test/frontend'
  }
  const createBlog = vi.fn()
  render(<BlogForm createBlog={createBlog} />)
  // screen.debug()
  const titleElement = screen.getByLabelText('Title')
  const authorElement = screen.getByLabelText('Author')
  const urlElement = screen.getByLabelText('Url')

  const user = userEvent.setup()
  await user.type(titleElement, `${blog.title}`)
  await user.type(authorElement, `${blog.author}`)
  await user.type(urlElement, `${blog.url}`)

  const saveButton = screen.getByText('Save')
  await user.click(saveButton)
  expect(createBlog.mock.calls[0][0]).toStrictEqual(blog)
})