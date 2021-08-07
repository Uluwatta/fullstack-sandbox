const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())

const PORT = 3001

app.use(express.json()) // for parsing application/json
app.use('/api/todolists', require('./api/todolists'));

app.listen(PORT, () => console.log(`Things to do app listening on port ${PORT}!`))
