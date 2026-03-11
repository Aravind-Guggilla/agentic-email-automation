const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv');

dotenv.config();

// Import database initializer
const {initializeDb} = require('./config/database')

// Import IMAP service
// const startImapSync = require('./services/imapService')

const app = express()

// middlewares

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 3000

// Initialize everything
const initializeServer = async () => {
  try {
    // STEP 1: Start database
    await initializeDb()
    console.log('Database connected')

    // STEP 2: Start IMAP sync
    // startImapSync()
    // console.log('IMAP sync started')

    // STEP 3: Start express server
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`)
    }) 

  } catch (error) {
    console.log('Server initialization failed:', error.message)
  }
}

initializeServer()

// simple test route
app.get('/', (req, res) => {
  res.send('Email Onebox Backend Running')
})


module.exports = app