from app.services.sources import UNIVERSITY_SOURCES
from app.services.web_fetcher import fetch_page_text


def retrieve_context(category: str) -> str:
    """
    Fetches relevant university pages based on query category.
    """
    urls = UNIVERSITY_SOURCES.get(category, [])

    if not urls:
        return ""

    collected_text = []

    for url in urls:
        try:
            page_text = fetch_page_text(url)
            collected_text.append(page_text[:2000])  # cap per page
        except Exception:
            continue

    return "\n\n".join(collected_text)
