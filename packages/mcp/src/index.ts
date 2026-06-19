/**
 * Entry point for the Cobos UI MCP server. Speaks newline-delimited JSON-RPC
 * over stdio so it can be launched directly by an MCP client via `npx @cobos/mcp`.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools } from './tools.js';

async function main(): Promise<void> {
  const server = new McpServer({
    name: 'cobos-ui',
    version: '0.0.0',
  });

  registerTools(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Keep diagnostics on stderr so stdout stays a clean JSON-RPC stream.
  process.stderr.write('Cobos UI MCP server running on stdio\n');
}

main().catch((error) => {
  process.stderr.write(`Fatal error starting Cobos UI MCP server: ${String(error)}\n`);
  process.exit(1);
});
