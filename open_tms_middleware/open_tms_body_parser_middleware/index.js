const handler = async (event) => {
  const { req } = event

  // get body from req chunk
  const bodyBuffer = []
  for await (const chunk of req) {
    bodyBuffer.push(chunk)
  }
  const data = Buffer.concat(bodyBuffer).toString()
  req.body = JSON.parse(data || '{}')

  return true
}

export default handler
