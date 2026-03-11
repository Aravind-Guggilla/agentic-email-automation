const emailService = require('../services/emailService')

const getEmails = async (request, response) => {
    try{
        const {page, limit} = request.query
        const pageLimit = parseInt(page) || 1
        const emailsLimit = parseInt(limit) || 20

        const emails = await emailService.getEmails(pageLimit, emailsLimit)
        response.status(200)
        response.send({ pageLimit, emailsLimit, emails })
              
    }catch(error){
        response.error(error)                           
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