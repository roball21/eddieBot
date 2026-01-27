from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get configuration from environment variables with defaults
AWS_REGION = os.getenv("AWS_REGION", "us-central-2")
MODEL_ID = os.getenv("MODEL_ID", "openai.gpt-oss-120b-1:0")
PORT = int(os.getenv("PORT", "8000"))

# Initialize Bedrock client
bedrock = boto3.client("bedrock-runtime", region_name=AWS_REGION)

@app.route("/api/chat", methods=["POST"])
def ask_model():
    try:
        data = request.json
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        user_input = data.get("message", "")
        
        if not user_input.strip():
            return jsonify({"error": "Message cannot be empty"}), 400
        
        payload = {"inputText": user_input}
        payload_json = json.dumps(payload)
        
        response = bedrock.invoke_model(
            modelId=MODEL_ID,
            contentType="application/json",
            body=payload_json
        )
        
        result = json.loads(response["body"].read())
        
        return jsonify({"reply": result["outputText"]})
    
    except KeyError as e:
        return jsonify({"error": f"Missing key in response: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=PORT, host="0.0.0.0")
