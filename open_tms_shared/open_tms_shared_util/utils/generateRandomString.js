const generateRandomString = (length = 6) => {
  // const length = 6;
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

  let result = ''
  const charactersLength = characters.length

  while (result.length < length) {
    const randomIndex = Math.floor(Math.random() * charactersLength)
    result += characters.charAt(randomIndex)
  }

  return result
}

export default generateRandomString
