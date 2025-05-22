# 최신 LangChain 구조에 맞춘 import
from langchain_community.document_loaders import JSONLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.llms import Ollama
from langchain.chains import RetrievalQA

# 1. symbol_data_50.json 로딩
loader = JSONLoader(
    file_path='public/symbol_data_50.json',  # Dreamix 프로젝트 기준 경로
    jq_schema='.',                           # JSON 전체 구조 로드
    text_content=False
)

docs = loader.load()
print(f"✅ Loaded {len(docs)} documents.")

# 2. 문서 분할 (chunking)
splitter = CharacterTextSplitter(chunk_size=300, chunk_overlap=0)
chunks = splitter.split_documents(docs)
print(f"✅ Split into {len(chunks)} chunks.")

# 3. Ollama 임베딩 (로컬 모델 이름은 'mistral')
embedding = OllamaEmbeddings(model="mistral")

# 4. 벡터 저장소 생성
vectorstore = FAISS.from_documents(chunks, embedding)
print("✅ Vectorstore created successfully.")

# 5. Retrieval QA 체인 구성
llm = Ollama(model="mistral")  # Ollama에서 실행 중인 LLM 이름
qa = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever()
)

# 6. 테스트 질의 실행
query = "What does the symbol 'mirror' mean in Jungian interpretation?"
response = qa.run(query)

print("\n🧠 GPT Response:\n", response)
