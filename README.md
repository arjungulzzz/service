# Node.js Remote Script Execution Service

This service exposes REST API endpoints to execute scripts on remote Linux machines via SSH and return their outputs. Built with Express and ssh2 for fast, asynchronous operations.

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the server:
   ```sh
   node index.js
   ```

## Features
- Fast REST API using Express
- Secure SSH execution using ssh2
- Easily extendable for new endpoints/scripts

## Usage
Configure your remote hosts and scripts in the service code. Use the API endpoints to trigger script execution and receive output.

---
