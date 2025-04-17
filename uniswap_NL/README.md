# Uniswap Natural Language Interface

This project provides a server that processes natural language instructions and converts them into function calls suitable for interacting with a Uniswap-like interface. It uses OpenAI's GPT models for natural language understanding and function calling.

The project includes two server implementations:

1. **Node.js/Express Server:** For local development and testing.
2. **Python/FastAPI Server with Modal:** For scalable cloud deployment.

## Local Development (Node.js/Express)

This setup uses the Express server defined in `server.js`.

### Prerequisites

- Node.js and npm
- OpenAI API Key

### Setup

1. **Navigate to the `uniswap_NL` directory:**
   ```bash
   cd uniswap_NL
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Create a `.env` file** in the `uniswap_NL` directory and add your OpenAI API key:
   ```env
   # .env
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. **Run the server:**
   ```bash
   node server.js
   ```
   The server will start, typically on port 3001.

### Testing the Local Server

You can test the local server using the provided `test-nl.js` script via npm:

```bash
# Example: Swap 10 USDC for ETH
npm run test-nl "swap 10 USDC for ETH"

# Example: Add liquidity
npm run test-nl "add 5 ETH and 10000 USDC to liquidity"
```

This script sends a POST request to `http://localhost:3001/api/process-nl` with your natural language message.

## Deployment (Python/Modal)

This setup uses the Python FastAPI server defined in `uniswap_nl_server.py` and deploys it using [Modal](https://modal.com/).

### Prerequisites

- Python 3
- Modal Account and CLI installed ([`pip install modal-client`](https://modal.com/docs/cli/))
- OpenAI API Key configured as a Modal Secret named `openai-fy`. You can create secrets via the Modal dashboard or CLI:
  ```bash
  modal secret create openai-fy OPENAI_API_KEY=your_openai_api_key_here
  ```

### Deployment

1. **Navigate to the `uniswap_NL` directory:**
   ```bash
   cd uniswap_NL
   ```
2. **Deploy the application using the Modal CLI:**
   ```bash
   modal deploy uniswap_nl_server.py
   ```

Modal will build the container image, deploy the FastAPI application, and provide you with a public URL for your endpoint. The Python server uses the tool definitions from `tools.py`.