# uniswap_nl_server.py
import modal
import os
import json
import requests
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

# Define request models
class ProcessNLRequest(BaseModel):
    message: str

class ProcessOpenSourceRequest(BaseModel):
    message: str
    modelUrl: str

# Create a Modal image with required dependencies
image = (
    modal.Image.debian_slim()
    .pip_install([
        "openai>=1.0.0",  # Use a more flexible version requirement
        "fastapi", 
        "uvicorn",
        "pydantic",
        "requests"
    ])
    .add_local_file("tools.py", remote_path="/root/tools.py")
)

# Create a Modal app
app = modal.App("uniswap-nl-interface")

# FastAPI app for handling requests
web_app = FastAPI()

# Configure CORS for cross-origin requests
web_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@web_app.get("/")
async def root():
    return {"message": "Uniswap NL Interface is running"}

@web_app.post("/api/process-nl")
async def process_nl(request: ProcessNLRequest):
    try:
        # Import tools directly without sys.path modification
        from uniswap_NL.tools import tools
        
        if not request.message:
            raise HTTPException(status_code=400, detail="Message is required")
        
        # Initialize OpenAI client with explicit kwargs
        from openai import OpenAI
        
        # Only use the api_key parameter
        client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        # Make the request to OpenAI with function calling
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that processes natural language instructions for a Uniswap interface. Your task is to convert user requests into function calls that the interface can execute. Be precise with token names and amounts."
                },
                {"role": "user", "content": request.message}
            ],
            tools=tools
        )
        
        # Extract the response message
        response_message = response.choices[0].message
        
        # Check if there are tool calls in the response
        if response_message.tool_calls and len(response_message.tool_calls) > 0:
            function_calls = []
            for tool_call in response_message.tool_calls:
                function_name = tool_call.function.name
                function_args = json.loads(tool_call.function.arguments)
                
                function_calls.append({
                    "name": function_name,
                    "arguments": function_args
                })
            
            return {
                "type": "function_call",
                "functions": function_calls,
                "message": response_message.content or "I've processed your request into action(s)"
            }
        else:
            # Standard text response
            return {
                "type": "text",
                "message": response_message.content
            }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Failed to process request: {str(e)}")

@web_app.post("/api/process-nl-open-source")
async def process_nl_open_source(request: ProcessOpenSourceRequest):
    try:
        # Import tools directly
        from uniswap_NL.tools import tools
        
        if not request.message or not request.modelUrl:
            raise HTTPException(status_code=400, detail="Message and modelUrl are required")
        
        # Make a request to the open source LLM endpoint
        response = requests.post(
            request.modelUrl,
            headers={"Content-Type": "application/json"},
            json={
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a helpful assistant that processes natural language instructions for a Uniswap interface. Your task is to convert user requests into function calls that the interface can execute. Be precise with token names and amounts."
                    },
                    {"role": "user", "content": request.message}
                ],
                "tools": tools
            },
            timeout=30
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, 
                detail=f"Error from open source LLM API: {response.text}"
            )
        
        return response.json()
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to process open source LLM request: {str(e)}"
        )

@web_app.get("/debug")
async def debug():
    try:
        import openai
        return {
            "openai_version": openai.__version__,
            "environment": {k: v for k, v in os.environ.items() if "key" not in k.lower()}
        }
    except Exception as e:
        return {"error": str(e)}

# Main Modal endpoint with FastAPI
@app.function(
    image=image,
    secrets=[modal.Secret.from_name("openai-fy")]
)
@modal.asgi_app()
def fastapi_app():
    return web_app

# For local testing and deployment
if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        if len(sys.argv) > 2:
            from modal import Function
            message = " ".join(sys.argv[2:])
            print(f"Testing with message: {message}")
            
            # Test manually without using the test_nl_processing function
            import requests
            response = requests.post(
                "http://localhost:8000/api/process-nl",
                json={"message": message}
            )
            print(json.dumps(response.json(), indent=2))
        else:
            print("Please provide a test message")
    else:
        print("Starting Modal app...")
        modal.run()