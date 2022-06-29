import './notification.css'

const Notification = (props) => {
  if (props.message === null) {
    return null
  }

  return (
    <div className={props.message.type}>
      {props.message.text}
    </div>
  )
}

export default Notification