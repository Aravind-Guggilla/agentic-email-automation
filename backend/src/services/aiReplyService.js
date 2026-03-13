const axios = require('axios')
const {getDB} = require("../config/database")

const generateReply = async (emailId) => {
    const db = getDB()

    const dbQuery = `
        SELECT 
          *
        FROM
            emails
        WHERE
            id = ${emailId};
    `
    const email = await db.get(dbQuery)

    try { // Send data to Flask API
        const aiReply = await axios.post(
            "http://127.0.0.1:5001/generate-reply",
            email
        )
        // Receive response from backend python Flask API
        const suggestedReply = aiReply.data

        return suggestedReply

    }catch(error){
        console.error("AI reply failed:", error)
        return { error: "AI reply failed" }
    }

}  

module.exports = generateReply