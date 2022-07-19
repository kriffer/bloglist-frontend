import { useState } from 'react'


const Blog = ({ blog, updateBlog, deleteBlog, user }) => {

  const [likes, setLikes] = useState(blog.likes)
  const [showDetails, setShowDetails] = useState(false)
  const [label, setLabel] = useState('view')


  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const addLike = (e) => {
    e.preventDefault()

    const blogToUpdate = {
      'title': blog.title,
      'author': blog.author,
      'url': blog.url,
      'user': blog.user,
      'likes': likes + 1
    }
    updateBlog(blog.id, blogToUpdate)
    setLikes(likes + 1)
  }

  const handleClick = () => {
    setShowDetails(!showDetails)
    !showDetails ? setLabel('hide') : setLabel('view')
  }

  const removeBlog = (e) => {
    e.preventDefault()
    deleteBlog(blog)
  }

  function showRemoveButton() {
    if (user) {
      return blog.user.username === user.username ? <div><button onClick={removeBlog}>remove</button></div> : ''
    } else return ''
  }

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} {blog.author} <button onClick={handleClick}>{label}</button>
      {showDetails ? <div className="togglableContent">
        <div>{blog.url}</div>
        <div>{likes} <button onClick={addLike}>like</button></div>
        <div>{blog.author}</div>
        {showRemoveButton()}
      </div> : ''
      }
    </div>
  )
}

export default Blog