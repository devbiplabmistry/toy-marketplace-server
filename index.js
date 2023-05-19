const express = require('express')
const app = express()
const  cors = require('cors')
require('dotenv').config()
const port = process.env.PORT ||5000



// middleware
app.use(cors())

app.get('/', (req, res) => {
  res.send('Edukit website is running now...')
})

app.listen(port, () => {
  console.log(`Edukit server is running on port ${port}`)
})