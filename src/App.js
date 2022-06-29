import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState({})
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

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
      blogService.create(newBlog)
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
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      {!user ?
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
        :
        <div>
          <div>{user.name} is logged in <button onClick={handleLogout}>Logout</button></div>


          <h3>create new</h3>
          <div>
            <form onSubmit={handleAddBlog}>
              <div>
                title
                <input
                  type="text"
                  value={title}
                  name="title"
                  onChange={({ target }) => setTitle(target.value)}
                />
              </div>
              <div>
                author
                <input
                  type="text"
                  value={author}
                  name="author"
                  onChange={({ target }) => setAuthor(target.value)}
                />
              </div>
              <div>
                url
                <input
                  type="text"
                  value={url}
                  name="url"
                  onChange={({ target }) => setUrl(target.value)}
                />
              </div>
              <button type="submit">create</button>
            </form>
          </div>
        </div>
      }
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
