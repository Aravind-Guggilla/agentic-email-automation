const emailService = require('../services/emailService')

const getEmails = async (request, response) => {
    try{
        const emails = await emailService.getAllEmails()
        response.status(200)
        response.send(emails)
    }catch(error){
        response.status(500)
        response.send({error: 'Failed to retrieve emails'})
    }
}

const searchEmails = async (request, response) =>{
    try{
        const {q} = request.query
        const emails = await emailService.searchEmails(q)
        response.status(200)
        response.send(emails)
    }catch(error){
        response.status(500)
        response.send({error: 'Failed to search emails'})
    }
}

const getEmailsByAccount = async (request, response) => {
    try{
        const {account} = request.params
        const emails = await emailService.getEmailsByAccount(account)
        response.status(200)
        response.send(emails)
    }catch(error){
        response.status(500)
        response.send({error: 'Failed to retrieve emails for account'})
    }
}

module.exports = {
    getEmails,
    searchEmails,
    getEmailsByAccount
}