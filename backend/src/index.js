const cors = require('cors')
const express = require('express')

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`)
})