#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for AI English Tutor Application
Tests all backend endpoints with realistic data scenarios
"""

import requests
import json
import time
import uuid
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:3000/api"
HEADERS = {"Content-Type": "application/json"}

class BackendTester:
    def __init__(self):
        self.test_results = []
        self.test_user_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
        self.test_user_id = None
        self.test_session_id = None
        
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status}: {test_name} - {message}")
        if details:
            print(f"   Details: {details}")
    
    def test_ai_tutor_endpoint(self):
        """Test AI Tutor endpoint with mock mode"""
        print("\n=== Testing AI Tutor Endpoint ===")
        
        # Test basic conversation
        test_cases = [
            {
                "name": "Basic Grammar Correction",
                "payload": {
                    "userText": "I go to school yesterday",
                    "userLevel": "A2"
                }
            },
            {
                "name": "B1 Level Conversation", 
                "payload": {
                    "userText": "I am learning English because I want to travel",
                    "userLevel": "B1"
                }
            },
            {
                "name": "C1 Advanced Level",
                "payload": {
                    "userText": "The economic implications of globalization are quite complex",
                    "userLevel": "C1"
                }
            }
        ]
        
        for test_case in test_cases:
            try:
                response = requests.post(
                    f"{BASE_URL}/tutor",
                    headers=HEADERS,
                    json=test_case["payload"],
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Validate response structure
                    required_fields = ["reply", "corrections", "miniExercise"]
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if not missing_fields:
                        # Validate corrections structure
                        if isinstance(data["corrections"], list):
                            corrections_valid = True
                            for correction in data["corrections"]:
                                if not all(key in correction for key in ["original", "corrected", "explanation", "rule"]):
                                    corrections_valid = False
                                    break
                            
                            # Validate miniExercise structure
                            exercise_valid = True
                            if data["miniExercise"]:
                                exercise = data["miniExercise"]
                                required_exercise_fields = ["type", "question", "options", "correct", "explanation"]
                                if not all(key in exercise for key in required_exercise_fields):
                                    exercise_valid = False
                            
                            if corrections_valid and exercise_valid:
                                self.log_result(
                                    f"AI Tutor - {test_case['name']}", 
                                    True, 
                                    f"Response received with proper structure for level {test_case['payload']['userLevel']}",
                                    f"Reply: {data['reply'][:50]}..."
                                )
                            else:
                                self.log_result(
                                    f"AI Tutor - {test_case['name']}", 
                                    False, 
                                    "Invalid corrections or exercise structure",
                                    str(data)
                                )
                        else:
                            self.log_result(
                                f"AI Tutor - {test_case['name']}", 
                                False, 
                                "Corrections field is not a list",
                                str(data)
                            )
                    else:
                        self.log_result(
                            f"AI Tutor - {test_case['name']}", 
                            False, 
                            f"Missing required fields: {missing_fields}",
                            str(data)
                        )
                else:
                    self.log_result(
                        f"AI Tutor - {test_case['name']}", 
                        False, 
                        f"HTTP {response.status_code}: {response.text}"
                    )
                    
            except Exception as e:
                self.log_result(
                    f"AI Tutor - {test_case['name']}", 
                    False, 
                    f"Request failed: {str(e)}"
                )
    
    def test_authentication_system(self):
        """Test user registration and login"""
        print("\n=== Testing Authentication System ===")
        
        # Test user registration
        register_payload = {
            "email": self.test_user_email,
            "name": "Maria Silva",
            "password": "securepass123",
            "cefrLevel": "B1"
        }
        
        try:
            response = requests.post(
                f"{BASE_URL}/auth/register",
                headers=HEADERS,
                json=register_payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "user" in data and "token" in data:
                    self.test_user_id = data["user"]["_id"]
                    user = data["user"]
                    
                    # Validate user data structure
                    required_fields = ["_id", "email", "name", "cefrLevel", "dailyGoalMinutes", "createdAt"]
                    missing_fields = [field for field in required_fields if field not in user]
                    
                    if not missing_fields and "password" not in user:
                        self.log_result(
                            "Authentication - Register", 
                            True, 
                            f"User registered successfully with ID: {self.test_user_id}",
                            f"User: {user['name']} ({user['email']}) - Level: {user['cefrLevel']}"
                        )
                    else:
                        self.log_result(
                            "Authentication - Register", 
                            False, 
                            f"Invalid user data structure. Missing: {missing_fields}",
                            str(user)
                        )
                else:
                    self.log_result(
                        "Authentication - Register", 
                        False, 
                        "Missing user or token in response",
                        str(data)
                    )
            else:
                self.log_result(
                    "Authentication - Register", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except Exception as e:
            self.log_result(
                "Authentication - Register", 
                False, 
                f"Registration request failed: {str(e)}"
            )
        
        # Test user login
        login_payload = {
            "email": self.test_user_email,
            "password": "securepass123"
        }
        
        try:
            response = requests.post(
                f"{BASE_URL}/auth/login",
                headers=HEADERS,
                json=login_payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "user" in data and "token" in data:
                    user = data["user"]
                    if user["email"] == self.test_user_email and "password" not in user:
                        self.log_result(
                            "Authentication - Login", 
                            True, 
                            "User login successful",
                            f"Logged in as: {user['name']} ({user['email']})"
                        )
                    else:
                        self.log_result(
                            "Authentication - Login", 
                            False, 
                            "Invalid login response data",
                            str(user)
                        )
                else:
                    self.log_result(
                        "Authentication - Login", 
                        False, 
                        "Missing user or token in login response",
                        str(data)
                    )
            else:
                self.log_result(
                    "Authentication - Login", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except Exception as e:
            self.log_result(
                "Authentication - Login", 
                False, 
                f"Login request failed: {str(e)}"
            )
        
        # Test invalid login
        invalid_login_payload = {
            "email": self.test_user_email,
            "password": "wrongpassword"
        }
        
        try:
            response = requests.post(
                f"{BASE_URL}/auth/login",
                headers=HEADERS,
                json=invalid_login_payload,
                timeout=10
            )
            
            if response.status_code == 401:
                self.log_result(
                    "Authentication - Invalid Login", 
                    True, 
                    "Invalid login correctly rejected with 401",
                    response.text
                )
            else:
                self.log_result(
                    "Authentication - Invalid Login", 
                    False, 
                    f"Expected 401, got {response.status_code}: {response.text}"
                )
                
        except Exception as e:
            self.log_result(
                "Authentication - Invalid Login", 
                False, 
                f"Invalid login test failed: {str(e)}"
            )
    
    def test_mongodb_connection(self):
        """Test MongoDB operations through user profile endpoint"""
        print("\n=== Testing MongoDB Connection ===")
        
        if not self.test_user_id:
            self.log_result(
                "MongoDB - Connection Test", 
                False, 
                "Cannot test MongoDB - no test user ID available"
            )
            return
        
        try:
            response = requests.get(
                f"{BASE_URL}/user/profile?userId={self.test_user_id}",
                headers=HEADERS,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if "_id" in data and data["_id"] == self.test_user_id:
                    self.log_result(
                        "MongoDB - Connection Test", 
                        True, 
                        "Database connection working - user profile retrieved",
                        f"Retrieved user: {data.get('name', 'Unknown')} ({data.get('email', 'Unknown')})"
                    )
                else:
                    self.log_result(
                        "MongoDB - Connection Test", 
                        False, 
                        "Invalid user profile data",
                        str(data)
                    )
            else:
                self.log_result(
                    "MongoDB - Connection Test", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except Exception as e:
            self.log_result(
                "MongoDB - Connection Test", 
                False, 
                f"Database connection test failed: {str(e)}"
            )
    
    def test_chat_session_management(self):
        """Test chat session creation and management"""
        print("\n=== Testing Chat Session Management ===")
        
        if not self.test_user_id:
            self.log_result(
                "Chat Sessions - Create Session", 
                False, 
                "Cannot test chat sessions - no test user ID available"
            )
            return
        
        # Test session creation
        session_payload = {
            "userId": self.test_user_id,
            "level": "B1",
            "topic": "daily_conversation"
        }
        
        try:
            response = requests.post(
                f"{BASE_URL}/chat/sessions",
                headers=HEADERS,
                json=session_payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["_id", "userId", "level", "topic", "createdAt"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    self.test_session_id = data["_id"]
                    self.log_result(
                        "Chat Sessions - Create Session", 
                        True, 
                        f"Chat session created successfully with ID: {self.test_session_id}",
                        f"Level: {data['level']}, Topic: {data['topic']}"
                    )
                else:
                    self.log_result(
                        "Chat Sessions - Create Session", 
                        False, 
                        f"Invalid session data structure. Missing: {missing_fields}",
                        str(data)
                    )
            else:
                self.log_result(
                    "Chat Sessions - Create Session", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except Exception as e:
            self.log_result(
                "Chat Sessions - Create Session", 
                False, 
                f"Session creation failed: {str(e)}"
            )
        
        # Test chat history retrieval
        if self.test_session_id:
            try:
                response = requests.get(
                    f"{BASE_URL}/chat/history?sessionId={self.test_session_id}&limit=10",
                    headers=HEADERS,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if isinstance(data, list):
                        self.log_result(
                            "Chat Sessions - Get History", 
                            True, 
                            f"Chat history retrieved successfully ({len(data)} turns)",
                            f"Session ID: {self.test_session_id}"
                        )
                    else:
                        self.log_result(
                            "Chat Sessions - Get History", 
                            False, 
                            "Chat history response is not a list",
                            str(data)
                        )
                else:
                    self.log_result(
                        "Chat Sessions - Get History", 
                        False, 
                        f"HTTP {response.status_code}: {response.text}"
                    )
                    
            except Exception as e:
                self.log_result(
                    "Chat Sessions - Get History", 
                    False, 
                    f"Chat history retrieval failed: {str(e)}"
                )
    
    def test_vocabulary_srs_system(self):
        """Test vocabulary SRS (Spaced Repetition System)"""
        print("\n=== Testing Vocabulary SRS System ===")
        
        if not self.test_user_id:
            self.log_result(
                "Vocabulary SRS - Get Due Cards", 
                False, 
                "Cannot test vocabulary - no test user ID available"
            )
            return
        
        # Test getting due vocabulary cards
        try:
            response = requests.get(
                f"{BASE_URL}/vocabulary/due?userId={self.test_user_id}&limit=5",
                headers=HEADERS,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result(
                        "Vocabulary SRS - Get Due Cards", 
                        True, 
                        f"Retrieved {len(data)} vocabulary cards",
                        f"Sample cards: {[card.get('term', 'Unknown') for card in data[:3]]}"
                    )
                    
                    # Test vocabulary review if we have cards
                    if data:
                        card = data[0]
                        review_payload = {
                            "userId": self.test_user_id,
                            "cardId": card["_id"],
                            "result": "good"
                        }
                        
                        try:
                            review_response = requests.post(
                                f"{BASE_URL}/vocabulary/review",
                                headers=HEADERS,
                                json=review_payload,
                                timeout=10
                            )
                            
                            if review_response.status_code == 200:
                                review_data = review_response.json()
                                if "success" in review_data and review_data["success"]:
                                    self.log_result(
                                        "Vocabulary SRS - Review Card", 
                                        True, 
                                        f"Card review successful for '{card['term']}'",
                                        f"Next due: {review_data.get('nextDue', 'Unknown')}"
                                    )
                                else:
                                    self.log_result(
                                        "Vocabulary SRS - Review Card", 
                                        False, 
                                        "Review response missing success field",
                                        str(review_data)
                                    )
                            else:
                                self.log_result(
                                    "Vocabulary SRS - Review Card", 
                                    False, 
                                    f"HTTP {review_response.status_code}: {review_response.text}"
                                )
                                
                        except Exception as e:
                            self.log_result(
                                "Vocabulary SRS - Review Card", 
                                False, 
                                f"Card review failed: {str(e)}"
                            )
                else:
                    self.log_result(
                        "Vocabulary SRS - Get Due Cards", 
                        False, 
                        "Due cards response is not a list",
                        str(data)
                    )
            else:
                self.log_result(
                    "Vocabulary SRS - Get Due Cards", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except Exception as e:
            self.log_result(
                "Vocabulary SRS - Get Due Cards", 
                False, 
                f"Due cards request failed: {str(e)}"
            )
    
    def test_additional_endpoints(self):
        """Test additional endpoints like lessons and pronunciation"""
        print("\n=== Testing Additional Endpoints ===")
        
        # Test lessons endpoint
        try:
            response = requests.get(
                f"{BASE_URL}/lessons?level=B1",
                headers=HEADERS,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result(
                        "Additional - Get Lessons", 
                        True, 
                        f"Retrieved {len(data)} lessons for B1 level",
                        f"Sample lessons: {[lesson.get('title', 'Unknown') for lesson in data[:2]]}"
                    )
                else:
                    self.log_result(
                        "Additional - Get Lessons", 
                        False, 
                        "Lessons response is not a list",
                        str(data)
                    )
            else:
                self.log_result(
                    "Additional - Get Lessons", 
                    False, 
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except Exception as e:
            self.log_result(
                "Additional - Get Lessons", 
                False, 
                f"Lessons request failed: {str(e)}"
            )
        
        # Test pronunciation analysis
        if self.test_user_id:
            pronunciation_payload = {
                "userId": self.test_user_id,
                "phrase": "Hello, how are you today?",
                "audioBase64": "mock_audio_data"
            }
            
            try:
                response = requests.post(
                    f"{BASE_URL}/pronunciation/analyze",
                    headers=HEADERS,
                    json=pronunciation_payload,
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    required_fields = ["_id", "userId", "phrase", "transcript", "score", "tips"]
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if not missing_fields:
                        self.log_result(
                            "Additional - Pronunciation Analysis", 
                            True, 
                            f"Pronunciation analysis completed with score: {data['score']}",
                            f"Phrase: '{data['phrase']}', Tips: {len(data['tips'])} provided"
                        )
                    else:
                        self.log_result(
                            "Additional - Pronunciation Analysis", 
                            False, 
                            f"Invalid pronunciation data structure. Missing: {missing_fields}",
                            str(data)
                        )
                else:
                    self.log_result(
                        "Additional - Pronunciation Analysis", 
                        False, 
                        f"HTTP {response.status_code}: {response.text}"
                    )
                    
            except Exception as e:
                self.log_result(
                    "Additional - Pronunciation Analysis", 
                    False, 
                    f"Pronunciation analysis failed: {str(e)}"
                )
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Comprehensive Backend API Testing")
        print(f"📍 Base URL: {BASE_URL}")
        print(f"👤 Test User Email: {self.test_user_email}")
        print("=" * 60)
        
        # Run tests in order
        self.test_ai_tutor_endpoint()
        self.test_authentication_system()
        self.test_mongodb_connection()
        self.test_chat_session_management()
        self.test_vocabulary_srs_system()
        self.test_additional_endpoints()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  ❌ {result['test']}: {result['message']}")
        
        print("\n🎯 CRITICAL ISSUES:")
        critical_failures = []
        for result in self.test_results:
            if not result["success"] and any(keyword in result["test"].lower() 
                                           for keyword in ["ai tutor", "authentication", "mongodb"]):
                critical_failures.append(result)
        
        if critical_failures:
            for failure in critical_failures:
                print(f"  🚨 {failure['test']}: {failure['message']}")
        else:
            print("  ✅ No critical failures detected")
        
        return {
            "total": total_tests,
            "passed": passed_tests,
            "failed": failed_tests,
            "success_rate": (passed_tests/total_tests)*100,
            "critical_failures": len(critical_failures),
            "results": self.test_results
        }

if __name__ == "__main__":
    tester = BackendTester()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    exit(0 if results["critical_failures"] == 0 else 1)