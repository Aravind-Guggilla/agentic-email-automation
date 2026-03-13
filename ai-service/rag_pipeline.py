import os

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

from langchain.chat_models import init_chat_model
from dotenv import load_dotenv


load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

# Load knowledge base
loader = TextLoader("data/outreach_context.txt")
docs = loader.load()

# Split text into chunks
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
)

splits = text_splitter.split_documents(docs)

# Embedding model
embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-mpnet-base-v2"
)

# Vector DB
vector_store = Chroma(
    collection_name="reachinbox_rag",
    embedding_function=embedding_model,
    persist_directory="./chroma_db"
)

# UPDATED: prevent duplicate embeddings when server restarts
if vector_store._collection.count() == 0:
    vector_store.add_documents(splits)


def retrieve_context(query):

    docs = vector_store.similarity_search(query, k=3)

    context = "\n".join([doc.page_content for doc in docs])

    return context


# LLM model
model = init_chat_model(
   "google_genai:gemini-2.5-flash",
   api_key=api_key,
)


# UPDATED: function now accepts email object instead of plain text
def generate_reply(email_data):

    # UPDATED: convert email object → formatted text
    email_text = f"""
    Email Category: {email_data.get("category")}
    Sender: {email_data.get("sender")}
    Subject: {email_data.get("subject")}

    Email Content:
    {email_data.get("body")}
    """

    # UPDATED: retrieval should use body for better semantic search
    context = retrieve_context(email_data.get("body"))

    system_prompt = f"""
    You are an AI assistant helping generate professional email replies.

    Strictly follow the rules:
    - Keep reply short and professional
    - Do not repeat the full email
    - Acknowledge the sender
    - Be concise and polite

    Example:

    Email Category: Meeting Booked
    Sender: Esther Shilpa (TCS)
    Subject: Important - CHRO Connect !!

    Email Content:
    Dear Candidates, Warm greetings from the TCS team...

    Suggested Reply:
    Dear Esther,
    Thank you for sharing the details of the CHRO Connect event.
    I appreciate the opportunity and look forward to attending the session.
    Best regards,

    Context:
    {context}

    Generate a short professional reply.
    """

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": email_text}
    ]

    response = model.invoke(messages)

    return response.content