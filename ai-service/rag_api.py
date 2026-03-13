from flask import Flask, request, jsonify
# from rag_pipeline import generate_reply

app = Flask(__name__)

@app.route("/generate-reply", methods=["POST"])
def give_reply():

    data = request.json 
    """ email_text = data["email"]

    reply = generate_reply(email_text)
    reply = generate_reply(data)
     reply = generate_reply(data.get("email"))
    """

    # return ({
    #     "suggested_reply": data
    # })

    print("Received data:", data)

    return data


app.run(port=5001, debug=True)