// server.js
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const tools = require("./tools");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Put your API key in a .env file
});

// Define your port
const PORT = process.env.PORT || 3001;

// Process natural language input with OpenAI
app.post("/api/process-nl", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Make the request to OpenAI with function calling
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Use appropriate model
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that processes natural language instructions for a Uniswap interface. Your task is to convert user requests into function calls that the interface can execute. Be precise with token names and amounts.",
        },
        { role: "user", content: message },
      ],
      tools: tools,
    });

    // Extract the response content
    const responseMessage = response.choices[0].message;

    // Check if there are tool calls in the response
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      const functionCalls = responseMessage.tool_calls.map((toolCall) => {
        const functionName = toolCall.function.name;
        const functionArgs = JSON.parse(toolCall.function.arguments);

        return {
          name: functionName,
          arguments: functionArgs,
        };
      });

      return res.json({
        type: "function_call",
        functions: functionCalls,
        message:
          responseMessage.content ||
          "I've processed your request into action(s)",
      });
    } else {
      // Standard text response
      return res.json({
        type: "text",
        message: responseMessage.content,
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res
      .status(500)
      .json({ error: "Failed to process request", details: error.message });
  }
});

// Endpoint for open source LLM
app.post("/api/process-nl-open-source", async (req, res) => {
  try {
    const { message, modelUrl } = req.body;

    if (!message || !modelUrl) {
      return res
        .status(400)
        .json({ error: "Message and modelUrl are required" });
    }

    // Make a request to the open source LLM endpoint
    const response = await fetch(modelUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that processes natural language instructions for a Uniswap interface. Your task is to convert user requests into function calls that the interface can execute. Be precise with token names and amounts.",
          },
          { role: "user", content: message },
        ],
        tools: tools,
      }),
    });

    const data = await response.json();

    // Process the response based on the open source LLM API
    // This will need to be adapted based on the specific API response format
    return res.json(data);
  } catch (error) {
    console.error("Error processing open source LLM request:", error);
    res
      .status(500)
      .json({
        error: "Failed to process open source LLM request",
        details: error.message,
      });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
