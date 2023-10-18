import jwt from 'jsonwebtoken'

const handler = async (event) => {
  const { req, res } = event

  const whiteList = ['open_tms_auth*']
  for (const whiteListPath of whiteList) {
    const isInclude = whiteListPath.includes('*') && req.path.includes(whiteListPath.replace('*', ''))
    if (isInclude || whiteListPath === req.path) return true
  }

  // validate user authentication
  try {
    const secretKey = process.env.BB_OPEN_TMS_SECRET_KEY.toString()
    const token = req.headers.authorization

    if (!token) throw new Error('No token found')

    const tokenParts = token.split(' ')
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      throw new Error('Invalid token format')
    }

    const tokenValue = tokenParts[1]

    const decodedToken = jwt.verify(tokenValue, secretKey)
    console.log({ decodedToken })

    req.user = {
      id: decodedToken.id,
      first_name: decodedToken.first_name,
      email: decodedToken.email,
      is_email_verified: decodedToken.is_email_verified,
    }
  } catch (error) {
    console.log({ error })

    res.writeHead(401, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
      'Content-Type': 'application/json',
    })
    res.write(JSON.stringify({ message: 'unauthorized user' }))
    res.end()

    return false
  }

  return true
}

export default handler
