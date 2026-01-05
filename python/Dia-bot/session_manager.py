from typing import Dict, Optional
from datetime import datetime, timedelta
import json
import os

# Get the directory where this file is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
SESSIONS_FILE = os.path.join(SCRIPT_DIR, "sessions_storage.json")

class TokenSessionManager:
    """Manages user sessions with persistent JSON storage"""
    
    def __init__(self):
        self.user_sessions: Dict[str, dict] = {}  # user_id -> session data
        self.session_timeout = timedelta(hours=24)
        self.sessions_file = SESSIONS_FILE
        print(f" Sessions file path: {self.sessions_file}")
        self._load_sessions()  # Load from file on startup
    
    def get_or_create_session(self, user_id: str) -> dict:
        """Get existing session or create new one for user"""
        if user_id not in self.user_sessions:
            self.user_sessions[user_id] = {
                "user_id": user_id,
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
                "ml_result": None,
                "chat_history": []
            }
            print(f" New session created for user: {user_id}")
        else:
            print(f" Existing session found for user: {user_id}")
        
        return self.user_sessions[user_id]
    
    def store_ml_result(self, user_id: str, ml_result: dict):
        """Store ML prediction result for user"""
        session = self.get_or_create_session(user_id)
        session["ml_result"] = ml_result
        session["updated_at"] = datetime.now()
        print(f" ML result stored for user: {user_id}")
        print(f"   Result: {ml_result.get('message', 'Unknown')}")
        self._save_sessions()  # Persist to file
    
    def get_ml_result(self, user_id: str) -> Optional[dict]:
        """Get ML result for user"""
        if user_id in self.user_sessions:
            ml_result = self.user_sessions[user_id].get("ml_result")
            if ml_result:
                print(f" Retrieved ML result for user: {user_id}")
            else:
                print(f" No ML result found for user: {user_id}")
            return ml_result
        
        print(f" User {user_id} has no session")
        return None
    
    def add_chat_message(self, user_id: str, user_msg: str, bot_msg: str):
        """Add chat message to user's history"""
        session = self.get_or_create_session(user_id)
        session["chat_history"].append({
            "user": user_msg,
            "bot": bot_msg,
            "timestamp": datetime.now().isoformat()
        })
        session["updated_at"] = datetime.now()
        
        # Keep only last 20 messages to prevent memory bloat
        if len(session["chat_history"]) > 20:
            session["chat_history"] = session["chat_history"][-20:]
        
        print(f" Chat message added for user: {user_id}")
        self._save_sessions()  # Persist to file
    
    def get_chat_history(self, user_id: str) -> list:
        """Get chat history for user"""
        if user_id in self.user_sessions:
            history = self.user_sessions[user_id].get("chat_history", [])
            print(f" Retrieved {len(history)} messages for user: {user_id}")
            return history

        print(f" User {user_id} has no chat history")
        return []
    
    def clear_chat_history(self, user_id: str):
        """Clear chat history for user"""
        if user_id in self.user_sessions:
            self.user_sessions[user_id]["chat_history"] = []
            print(f" Chat history cleared for user: {user_id}")
    
    def user_exists(self, user_id: str) -> bool:
        """Check if user has a session"""
        return user_id in self.user_sessions
    
    def get_user_info(self, user_id: str) -> Optional[dict]:
        """Get session metadata for user"""
        if user_id in self.user_sessions:
            session = self.user_sessions[user_id]
            return {
                "user_id": user_id,
                "created_at": session["created_at"].isoformat(),
                "updated_at": session["updated_at"].isoformat(),
                "has_ml_result": session["ml_result"] is not None,
                "message_count": len(session["chat_history"]),
                "assessment_status": session["ml_result"].get("message") if session["ml_result"] else "Not completed"
            }
        return None
    
    def cleanup_old_sessions(self):
        """Remove expired sessions"""
        now = datetime.now()
        expired = [
            user_id for user_id, data in self.user_sessions.items()
            if now - data["updated_at"] > self.session_timeout
        ]
        
        for user_id in expired:
            del self.user_sessions[user_id]
            print(f" Chat history cleared for user: {user_id}")
        
        if expired:
            print(f" Cleaned up {len(expired)} expired sessions")
    
    def get_all_active_users(self) -> list:
        """Get all active users (for admin/debugging)"""
        return [
            {
                "user_id": user_id,
                "created_at": data["created_at"].isoformat(),
                "has_assessment": data["ml_result"] is not None,
                "message_count": len(data["chat_history"])
            }
            for user_id, data in self.user_sessions.items()
        ]

    def _save_sessions(self):
        """Save all sessions to JSON file"""
        try:
            # Convert datetime objects to ISO format strings for JSON serialization
            serializable_sessions = {}
            for user_id, session in self.user_sessions.items():
                serializable_sessions[user_id] = {
                    "user_id": session["user_id"],
                    "created_at": session["created_at"].isoformat(),
                    "updated_at": session["updated_at"].isoformat(),
                    "ml_result": session["ml_result"],
                    "chat_history": session["chat_history"]
                }
            
            with open(self.sessions_file, 'w') as f:
                json.dump(serializable_sessions, f, indent=2)
            print(f" Sessions persisted to {self.sessions_file}")
        except Exception as e:
            print(f" Error saving sessions: {e}")

    def _load_sessions(self):
        """Load sessions from JSON file"""
        if not os.path.exists(self.sessions_file):
            print(f" No session file found at {self.sessions_file}. Starting fresh.")
            return
        
        try:
            with open(self.sessions_file, 'r') as f:
                serialized_sessions = json.load(f)
            
            # Convert ISO format strings back to datetime objects
            for user_id, session in serialized_sessions.items():
                self.user_sessions[user_id] = {
                    "user_id": session["user_id"],
                    "created_at": datetime.fromisoformat(session["created_at"]),
                    "updated_at": datetime.fromisoformat(session["updated_at"]),
                    "ml_result": session["ml_result"],
                    "chat_history": session["chat_history"]
                }
            
            print(f" Loaded {len(self.user_sessions)} sessions from {self.sessions_file}")
        except Exception as e:
            print(f" Error loading sessions: {e}. Starting fresh.")
            self.user_sessions = {}
# Global session manager instance
session_manager = TokenSessionManager()