import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import NewBlogForm from './NewBlogForm'
import userEvent from '@testing-library/user-event'

test('<NewBlogForm /> calls event handler and pass right form details on submit', async () => {
  const createBlog = jest.fn()
  const handleTitleChange = jest.fn()
  const handleAuthorChange = jest.fn()
  const handleUrlChange = jest.fn()
  const user = userEvent.setup()

  render(<NewBlogForm handleSubmit={createBlog} handleTitleChange = {handleTitleChange}
    handleAuthorChange={handleAuthorChange} handleUrlChange={handleUrlChange}/>)

  const title = await screen.getByPlaceholderText('title')
  const author = await screen.getByPlaceholderText('author')
  const url = await screen.getByPlaceholderText('url')
  const createButton = await screen.getByText('create')

  await user.type(title, 'New Blog' )
  await user.type(author, 'Author' )
  await user.type(url, 'localhost' )


  await user.click(createButton)

  expect(title).toHaveValue('New Blog')
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(handleTitleChange.mock.calls[0][0].target.value).toBe('New Blog' )
  expect(handleAuthorChange.mock.calls[0][0].target.value).toBe('Author' )
  expect(handleUrlChange.mock.calls[0][0].target.value).toBe('localhost' )
})