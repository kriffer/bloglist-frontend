
const NewBlogForm = ({ handleSubmit, handleTitleChange, title, handleAuthorChange, author, handleUrlChange, url }) => {
  return (
    <div>
      <h3>create new</h3>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            title
            <input
              type="text"
              value={title}
              name="title"
              onChange={handleTitleChange}
              placeholder='title'
            />
          </div>
          <div>
            author
            <input
              type="text"
              value={author}
              name="author"
              onChange={handleAuthorChange}
              placeholder='author'
            />
          </div>
          <div>
            url
            <input
              type="text"
              value={url}
              name="url"
              onChange={handleUrlChange}
              placeholder='url'
            />
          </div>
          <button type="submit">create</button>
        </form>
      </div>
    </div>
  )
}

export default NewBlogForm