import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('<Blog /> renders title and author by default,not url or likes', () => {
  const blog = {
    title: 'unit testing',
    author: 'ryme7',
    likes: 12,
    url: 'loc://teyw:200'
  }

  render(<Blog blog={blog} />)
  // screen.debug()

  const titleElement = screen.getByText(`${blog.title}`, { exact: false })
  const authorElement = screen.getByText(`${blog.author}`, { exact: false })

  expect(titleElement).toBeDefined()
  expect(authorElement).toBeDefined()

  //queryByText: prevents the test from crashing before reaching the expect statement.
  const urlElement = screen.queryByText(`${blog.url}`)
  const likesElement = screen.queryByText(`likes: ${blog.likes}`)
  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()
})

test('<Blog/> renders url and likes after clicking view button', async() => {
  const blog = {
    title: 'unit testing',
    author: 'Andrew',
    url: 'vitest/test',
    likes: 9
  }

  render(<Blog blog={blog} />)
  const url = screen.queryByText(`${blog.url}`)
  const likes = screen.queryByText(`${blog.likes}`)
  expect(url).toBeNull()
  expect(likes).toBeNull()

  const viewButton = screen.getByText('view')
  const user = userEvent.setup()
  await user.click(viewButton)
  // screen.debug()
  const urlAfter = screen.getByText(`${blog.url}`)
  const likesAfter = screen.getByText(`likes: ${blog.likes}`)
  expect(urlAfter).not.toBeNull()
  expect(likesAfter).not.toBeNull()
})

test('<Blog/> calls updateLikes twice if blog is liked twice', async() => {
  const blog = {
    title: 'update likes',
    author: 'kerling',
    url: 'fab/klo',
    likes: 1
  }
  const updateLikes = vi.fn()
  render(<Blog blog={blog} updateLikes={updateLikes} />)
  const viewButton = screen.getByText('view')

  const user = userEvent.setup()
  await user.click(viewButton)
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(updateLikes.mock.calls).toHaveLength(2)
})