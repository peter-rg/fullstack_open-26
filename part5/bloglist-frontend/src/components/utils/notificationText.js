const showText = (text, success = true) => {
  setMessage({text, success})
  setTimeout(() => setMessage(null), 4000)
}