const {getDB} = require("../config/database")

// get all emails for a specific account

const getEmails = async (pageLimit, emailsLimit) => {
    const db = getDB()
    const offset = (pageLimit - 1) * emailsLimit
    const dbQuery = `
        SELECT 
          *
        FROM
            emails
        ORDER BY
            email_date DESC
        LIMIT 
            ${emailsLimit} 
        OFFSET 
            ${offset};
    `

    const emails = await db.all(dbQuery)
    return emails
}

//Search emails by sender, subject, or body content

const searchEmails = async (searchText) => {
    const db = getDB()

    const dbQuery = `
        SELECT 
          *
        FROM
            emails
        WHERE
            subject LIKE '%${searchText}%'
        OR 
            body LIKE '%${searchText}%'
        ORDER BY
            email_date DESC;
    `

    const emails = await db.all(dbQuery)
    return emails
}

// filter by account

const getEmailsByAccount = async (account) => {
    const db = getDB()

    const dbQuery = `
        SELECT 
          *
        FROM
            emails
        WHERE
            account = '${account}'
        ORDER BY
            email_date DESC;
    `
    const emails = await db.all(dbQuery)
    return emails
}   

module.exports = {
    getEmails,
    searchEmails,
    getEmailsByAccount
}