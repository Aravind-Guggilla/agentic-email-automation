import os

from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

from langchain.chat_models import init_chat_model
from dotenv import load_dotenv


load_dotenv()

loader = TextLoader("data/outreach_context.txt")
docs = loader.load()

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=100
)

splits = text_splitter.split_documents(docs)

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-mpnet-base-v2"
)

vector_store = Chroma(
    collection_name="reachinbox_rag",
    embedding_function=embedding_model,
    persist_directory="./chroma_db"
)

vector_store.add_documents(splits)

def retrieve_context(query):

    docs = vector_store.similarity_search(query, k=3)

    context = "\n".join([doc.page_content for doc in docs])

    return context


model = init_chat_model(
   "google_genai:gemini-2.5-flash",
   api_key=os.getenv("GEMINI_API_KEY"),
)

def generate_reply(email_text):

    context = retrieve_context(email_text)

    system_prompt = f"""
    You are an AI assistant helping generate professional email replies.

    strictly follow the rules and format of the suggested reply in short , 
    don't deviate from context and ensure the reply is concise and to the point.

    example data: 
    Email Category: Meeting Booked
    Sender: Esther Shilpa (TCS)
    Subject: Important - CHRO Connect !!

    Email Content:
    Dear Candidates, Warm greetings from the TCS team...
    
    suggested_reply_in_short:
    Dear Esther, Thank you for reaching out and sharing the details of the CHRO Connect event. 
    I appreciate the opportunity to connect with industry leaders and learn from their insights. 
    I look forward to attending the event and engaging in meaningful discussions. Best regards, 
    [Your Name]

    Context:
    {context}

    Write a short professional reply to the email.
    """

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": email_text}
    ]

    response = model.invoke(messages)

    return response.content