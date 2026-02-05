def classify_query(message: str) -> str:
    m = message.lower()

    # Engineering news
    if any(k in m for k in ["engineering news", "soe news", "engineering update", "engineering dean's list", "wall of fame", "news"]):
        return "engineering_news"

    # Advising
    if any(k in m for k in ["advising", "advisor", "academic advising", "starfish", "schedule an appointment", "meet with my advisor"]):
        return "advising"

    # Clubs
    if any(k in m for k in ["club", "organization", "join", "get involved", "student org", "participate", "involved"]):
        return "clubs"

    return "general"

