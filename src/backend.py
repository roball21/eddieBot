from flask import Flask, request, jsonify
import boto3
import json

app = Flask(__name__)

bedrock = boto3.client("bedrock-runtime", region_name="us-central-2")

@app.route("/ask", methods=["POST"])

def ask_model():
    data = request.json

    user_input = data.get("question", "")

    payload = {"inputText": user_input}

    payload_json = json.dumps(payload)

    response = bedrock.invoke_model(
        modelId = "",
        contentType = "application/json",
        body = payload_json
    )

    result = json.loads(response["body"].read())

    return jsonify({"response": result["outputText"]})

    if __name__ == "__main__":
        app.run(debug = True)