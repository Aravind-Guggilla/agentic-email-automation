const { open } = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, '../../oneBoxEmails.db')

let db = null

const initializeDb = async () => {
    try{
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })

        const createEmailsTable = `
            CREATE TABLE IF NOT EXISTS emails (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uid INTEGER UNIQUE,
            account TEXT,
            sender TEXT,
            subject TEXT,
            body TEXT,
            folder TEXT,
            email_date TEXT,
            category TEXT
        )`

        await db.run(createEmailsTable)
        console.log("Database is initialized.")

    }catch(error){
        console.log(`DB error: ${error.message}`)
        process.exit(1)
    }

}

const getDB = () => db

module.exports = {initializeDb, getDB}