from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json

from langchain_community.document_loaders import JSONLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms import Ollama
from langchain.chains import RetrievalQA

app = Flask(__name__)
CORS(app)

# Load symbol data into vector store
loader = JSONLoader(
    file_path='public/symbol_data_50.json',
    jq_schema='.',
    text_content=False
)
docs = loader.load()

splitter = CharacterTextSplitter(chunk_size=300, chunk_overlap=0)
chunks = splitter.split_documents(docs)

embedding = OllamaEmbeddings(model="mistral")
vectorstore = FAISS.from_documents(chunks, embedding)

llm = Ollama(model="mistral")
qa = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever()
)

@app.route("/interpret", methods=["POST"])
def interpret():
    user_dream = request.json.get("dream", "")
    style = request.json.get("style", "general")

    prompt = f"""
You are a professional dream analyst. Analyze the dream below using the "{style}" interpretation style.

You have access to a dream symbol interpretation guide (provided above through retrieved context).  
You must use this guide to interpret each symbolic word in the dream.  
DO NOT invent meanings — only use the definitions found in the retrieved database.  
For each symbol, match its meaning according to the selected style ("jungian", "modern", or "general").

Divide the dream into exactly 3 scenes.  
⚠️ Each scene must be under a separate key like "Scene 1", "Scene 2", and "Scene 3" — NOT an array.

For each scene, include:
- Summary: A brief one-line description of what happens in this scene.
- Symbols: A list of individual symbolic nouns (e.g., "tree", "mirror", "fire")
- Emotions: A list of emotions experienced in the scene.
- Interpretation: A 1–2 sentence interpretation based on the selected style AND symbol definitions.

After the scenes, include:
- Final Interpretation: A comprehensive summary integrating all scenes into a cohesive understanding. It must reflect the **dream content and extracted symbols**, and use **neutral pronouns (they/them)**.

- Visual Prompt: {{ "Description": "..." }} ← Select **ONE vivid, cinematic moment** from the dream. The visual prompt must focus on **a single key moment** that captures the dream's essence, not a summary of the entire dream.  Also, focus on the **key symbolic elements** rather than excessive details. Avoid describing person and facial expressions.

Also, include the original dream input under the key:
"Raw Dream": "..." ← Copy the full dream text here.

⚠️ Format your entire response as **valid JSON**.
⚠️ Do not wrap the JSON with backticks or add any extra explanation outside the JSON.

Dream:
\"\"\"{user_dream}\"\"\"
"""

    response = qa.run(prompt)

    try:
        parsed = json.loads(response)
    except json.JSONDecodeError:
        return jsonify({ "response": response })

    parsed["Raw Dream"] = user_dream  # Double safe

    return jsonify({ "response": parsed })

# ✅ JSON 직접 서빙 라우트 추가
@app.route("/symbol_data_50.json")
def serve_symbol_data():
    return send_from_directory("public", "symbol_data_50.json")

if __name__ == "__main__":
    app.run(port=5000)

