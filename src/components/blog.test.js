import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog title and author', () => {
  const blog = {
    title: 'This is the test blog title',
    author: 'Author'
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('This is the test blog title Author')
  expect(element).toBeDefined()
})

test('should not render blog url and number of likes', () => {
  const blog = {
    title: 'This is the test blog title',
    author: 'Author',
    url:'http://localhost',
    likes:3
  }

  const { container } = render(<Blog blog={blog} />)

  const div = container.querySelector('.togglableContent')
  expect(div).toBeNull()

})

test('clicking the button shows toggled elements (url, likes)', async () => {
  const blog = {
    title: 'This is the test blog title',
    author: 'Author',
    url:'http://localhost',
    likes:3
  }

  const { container } = render(<Blog blog={blog} />)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const div = container.querySelector('.togglableContent')
  const url = screen.getByText('http://localhost')
  const likes = screen.getByText('3')
  expect(div).toBeVisible()
  expect(url).toBeDefined()
  expect(likes).toBeDefined()
})

test('should call event handler twice when clicking like button twice', async () => {
  const blog = {
    title: 'This is the test blog title',
    author: 'Author',
    url:'http://localhost',
    likes:3
  }

  const mockHandler = jest.fn()

  render(<Blog blog={blog} updateBlog={mockHandler} />)
  const user = userEvent.setup()
  const button1 = screen.getByText('view')
  await user.click(button1)
  const button2 = screen.getByText('like')
  await user.click(button2)
  await user.click(button2)

  expect(mockHandler.mock.calls).toHaveLength(2)
})