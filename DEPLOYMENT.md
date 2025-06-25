# Node.js SSH Service Layer – Deployment & Usage Guide

## Overview
This service exposes REST API endpoints to execute scripts on remote Linux machines via SSH and return their outputs. It is designed to be stateless, fast, and easily consumable by any frontend.

## Prerequisites
- Node.js 20 (or compatible) must be installed on the deployment server
- A `.env` file with SSH credentials (see below)
- Network access from the server to the target Linux hosts

## Quick Start
1. **Unzip the project folder**
2. **Add your `.env` file** (see `.env.example` for required variables)
3. **Install dependencies:**
   ```sh
   npm install
   ```
4. **Start the service:**
   ```sh
   node index.js
   ```
5. **Test the API:**
   - Use Postman or curl to POST to endpoints like `/getMartSummary`, `/getManagerSummary`, `/getWorkerSummary`, `/getServerSummary`

## Environment Variables (`.env`)
```
SSH_USERNAME=your_ssh_username
SSH_PASSWORD=your_ssh_password
PORT=3000
```

## Endpoints
- `POST /getMartSummary`
- `POST /getManagerSummary`
- `POST /getWorkerSummary`
- `POST /getServerSummary`

**Request Body Example:**
```json
{
  "host": "192.168.1.100",
  "port": 22,
  "args": ["arg1", "arg2"]
}
```

**Response Example:**
```json
{
  "stdout": "...",
  "stderr": "...",
  "code": 0,
  "signal": null
}
```

## Notes
- Do NOT commit your `.env` file or secrets to version control.
- All logs are written to `service.log` in the project directory.
- Scripts must exist on the remote host at the expected paths.

## Troubleshooting
- Check `service.log` for errors.
- Ensure SSH credentials and network access are correct.
- Make sure the remote scripts are executable.

## Customization
- To add new endpoints, edit `index.js` and map to the desired script.
- For advanced CORS or security, adjust middleware in `index.js`.

---
For questions, contact the project maintainer or check the code comments for further guidance.
