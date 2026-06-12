import requests

OLLAMA_URL = "http://localhost:11434/api/generate"


def generate_response(prompt, model="qwen2.5:7b"):

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": model,
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )

        response.raise_for_status()
        data = response.json()

        return data.get("response", "").strip()

    except Exception as e:
        print("LLM Error:", e)
        return "I couldn't process that right now."