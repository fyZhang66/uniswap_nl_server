// test-nl.js
// eg. npm run test-nl "swap 10 USDC for ETH"
// swap 10 USDC for ETH
// swap 5 ETH for DAI with 1% slippage
// add 5 ETH and 10000 USDC to liquidity
// add liquidity with 2 ETH and 4000 DAI
const { execSync } = require('child_process');

// Get the message from command line arguments
const args = process.argv.slice(2);
const message = args.join(' ');

if (!message) {
  console.error('Please provide a message. Example: npm run test-nl "swap 10 USDC for ETH"');
  process.exit(1);
}

// Escape double quotes for the shell
const escapedMessage = message.replace(/"/g, '\\"');

// Execute the curl command
try {
  const command = `curl -X POST http://localhost:3001/api/process-nl -H "Content-Type: application/json" -d '{"message":"${escapedMessage}"}'`;
  const result = execSync(command, { encoding: 'utf-8' });
  console.log(result);
} catch (error) {
  console.error('Error executing request:', error.message);
}