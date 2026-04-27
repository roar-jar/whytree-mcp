import { startServer } from './server.js';

export async function main() {
  await startServer();
}

main().catch((error) => {
  console.error('Fatal error in prompt-structurer-mcp:', error);
  process.exit(1);
});
