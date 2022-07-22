import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState({})
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [newBlog, setNewBlog] = useState({})

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [newBlog])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogsAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage({ text: 'Wrong username or password', type: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogsAppUser')
    blogService.setToken('')
    setUser(null)
  }

  const handleAddBlog = (event) => {
    event.preventDefault()
    const newBlog = {
      'title': title,
      'author': author,
      'url': url
    }
    try {
      const response = blogService.create(newBlog)
      setNewBlog(response)
      setBlogs(blogs.concat(newBlog))
      setMessage({ text: `A new blog ${newBlog.title} by ${newBlog.author} added`, type: 'success' })
      setTitle('')
      setAuthor('')
      setUrl('')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    } catch (exception) {
      setMessage({ text: 'Oops something went wrong', type: 'error' })
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  const addLikes = (id, blogToUpdate) => {
    try {
      blogService.update(id, blogToUpdate)

    } catch (exception) {
      setMessage({ text: 'Oops something went wrong', type: 'error' })
    }
  }

  const removeBlog = (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        blogService.deleteBlog(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      } catch (exception) {
        setMessage({ text: 'Oops something went wrong', type: 'error' })
      }
    }
  }


  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      {!user ?
        <Togglable buttonLabel="log in">

          <LoginForm username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>

        :
        <div>
          <div>{user.name} is logged in <button onClick={handleLogout}>Logout</button></div>
          <Togglable buttonLabel="new blog">
            <NewBlogForm
              handleSubmit={handleAddBlog}
              handleTitleChange={({ target }) => setTitle(target.value)}
              handleAuthorChange={({ target }) => setAuthor(target.value)}
              handleUrlChange={({ target }) => setUrl(target.value)}
            />
          </Togglable>
        </div>
      }
      <div id='blog-list'>
        {blogs.sort((a, b) => {
          return b.likes - a.likes
        }).map(blog => <div key={blog.id}>
          <Blog blog={blog} updateBlog={addLikes} deleteBlog={removeBlog} user={user} />
        </div>
        )}
      </div>
    </div>
  )
}

export default App
