import re

def get_first_image_url(content: str) -> str | None:
    """
    Extract the first image URL from the content string.
    """
    # Split the content by spaces and look for URLs

    text = content
    pattern = r'!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)'

    match = re.search(pattern, text)
    if match:
        print(f"[INFO] Found image URL: {match.group(1)}")
        return match.group(1)
    else:
        return ""