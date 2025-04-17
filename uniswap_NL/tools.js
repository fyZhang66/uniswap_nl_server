const tools = [
    {
      type: "function",
      function: {
        name: "swap_tokens",
        description: "Swap one token for another token",
        parameters: {
          type: "object",
          properties: {
            tokenIn: {
              type: "string",
              description: "The token to swap from (e.g., 'ETH', 'USDC', 'DAI', 'WBTC', 'UNI', etc.)",
            },
            tokenOut: {
              type: "string",
              description: "The token to swap to (e.g., 'ETH', 'USDC', 'DAI', 'WBTC', 'UNI', etc.)",
            },
            amountIn: {
              type: "number",
              description: "The amount of input token to swap",
            },
            slippageTolerance: {
              type: "number",
              description: "Slippage tolerance in percentage (default: 0.5)",
            }
          },
          required: ["tokenIn", "tokenOut", "amountIn"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "add_liquidity",
        description: "Add liquidity to a token pair",
        parameters: {
          type: "object",
          properties: {
            tokenA: {
              type: "string",
              description: "First token (e.g., 'ETH', 'USDC', 'DAI', 'WBTC', 'UNI', etc.)",
            },
            tokenB: {
              type: "string",
              description: "Second token (e.g., 'ETH', 'USDC', 'DAI', 'WBTC', 'UNI', etc.)",
            },
            amountA: {
              type: "number",
              description: "Amount of first token to add",
            },
            amountB: {
              type: "number",
              description: "Amount of second token to add",
            },
            slippageTolerance: {
              type: "number",
              description: "Slippage tolerance in percentage (default: 0.5)",
            }
          },
          required: ["tokenA", "tokenB", "amountA", "amountB"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "remove_liquidity",
        description: "Remove liquidity from a token pair",
        parameters: {
          type: "object",
          properties: {
            tokenA: {
              type: "string",
              description: "First token (e.g., 'ETH', 'USDC', 'DAI', 'WBTC', 'UNI', etc.)",
            },
            tokenB: {
              type: "string",
              description: "Second token (e.g., 'ETH', 'USDC', 'DAI', 'WBTC', 'UNI', etc.)",
            },
            lpAmount: {
              type: "number",
              description: "Amount of LP tokens to remove",
            },
            slippageTolerance: {
              type: "number",
              description: "Slippage tolerance in percentage (default: 0.5)",
            }
          },
          required: ["tokenA", "tokenB", "lpAmount"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "get_pool_reserves",
        description: "Get the reserves of a token pair pool",
        parameters: {
          type: "object",
          properties: {
            tokenA: {
              type: "string",
              description: "First token (e.g., 'ETH', 'USDC', 'DAI', 'WBTC', 'UNI', etc.)",
            },
            tokenB: {
              type: "string",
              description: "Second token (e.g., 'ETH', 'USDC', 'DAI', 'WBTC', 'UNI', etc.)",
            }
          },
          required: ["tokenA", "tokenB"],
        },
      },
    },
    {
      type: "function",
      function: {
        name: "get_swap_count",
        description: "Get the count of swaps in a specific time period",
        parameters: {
          type: "object",
          properties: {
            tokenA: {
              type: "string",
              description: "First token (e.g., 'ETH', 'USDC', 'DAI', 'WBTC', 'UNI', etc.)",
            },
            tokenB: {
              type: "string", 
              description: "Second token (e.g., 'ETH', 'USDC', 'DAI', 'WBTC', 'UNI', etc.)",
            },
            period: {
              type: "string",
              enum: ["today", "yesterday", "week", "month", "all"],
              description: "Time period for the swap count",
            }
          },
          required: ["tokenA", "tokenB", "period"],
        },
      },
    }
  ];
module.exports = tools;