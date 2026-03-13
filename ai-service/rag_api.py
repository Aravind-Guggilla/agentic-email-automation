from flask import Flask, request, jsonify
from rag_pipeline import generate_reply

app = Flask(__name__)


@app.route("/generate-reply", methods=["POST"])
def give_reply():

    data = request.get_json()

    # Extract only required fields
    required_data = {
        "sender": data.get("sender"),
        "subject": data.get("subject"),
        "body": data.get("body"),
        "category": data.get("category")
    }

    # Call RAG pipeline
    ai_response = generate_reply(required_data)

    # DEBUG: print input and output for verification
    # print("Received email:", required_data)
    # print("AI reply:", ai_response)

    return jsonify({
        "suggested_reply": ai_response
    }), 200


# Start Flask server
app.run(port=5001, debug=True)