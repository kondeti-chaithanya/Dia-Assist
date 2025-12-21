# services/chat_history.py

chat_history = []


def save_message(role: str, message: str):
    chat_history.append({
        "role": role,
        "message": message
    })

# return last 20 messages
def get_history():
    return chat_history[-20:]  
