from flask import Flask, request, jsonify
# from rag_pipeline import generate_reply

app = Flask(__name__)

@app.route("/generate-reply", methods=["POST"])
def give_reply():

    data = request.json 
    # const requiredData = {}

    # return ({
    #     "suggested_reply": data
    # })

    # print("Received data:", data) 

    reply = {
        "sender": data.get("sender"),
        "subject": data.get("subject"),
        "body": data.get("body"),
        "category": data.get("category")
    }

    return (reply), 200

app.run(port=5001, debug=True)