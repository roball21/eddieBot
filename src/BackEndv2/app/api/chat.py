from fastapi import APIRouter
from pydantic import BaseModel

from app.services.query_classifier import classify_query
from app.services.retrieval import retrieve_context
from app.services.bedrock_llm import generate_answer


router = APIRouter()


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str
    category: str


@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    category = classify_query(request.message)
    context = retrieve_context(category)

    if not context:
        reply = (
            "I couldn't find specific university information for that question yet. "
            "Try asking about events, clubs, or advising."
        )
    else:
        try:
            reply = (
                generate_answer(question=request.message, context=context, category=category)
                # f"Based on current SIUE information related to {category}:\n\n"
                # f"{context[:1500]}"
            )
        except Exception as e:
            print("[BEDROCK ERROR]", e)
            reply = "AI is temporarily unavailable while the model configuration is being finalized. Please try again shortly."

    return ChatResponse(
        reply=reply,
        category=category
    )
