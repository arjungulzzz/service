const express = require('express');
const { Client } = require('ssh2');
const { logEvent } = require('./logger');
const path = require('path');

const app = express();
app.use(express.json());

// Helper to execute a script via SSH
function executeRemoteScript({ host, port = 22, username, password, script }, res) {
  if (!host || !username || !password || !script) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const conn = new Client();
  conn.on('ready', () => {
    conn.exec(script, (err, stream) => {
      if (err) {
        conn.end();
        return res.status(500).json({ error: err.message });
      }
      let stdout = '';
      let stderr = '';
      stream.on('close', (code, signal) => {
        conn.end();
        res.json({ stdout, stderr, code, signal });
      }).on('data', (data) => {
        stdout += data;
      }).stderr.on('data', (data) => {
        stderr += data;
      });
    });
  }).on('error', (err) => {
    res.status(500).json({ error: err.message });
  }).connect({ host, port, username, password });
}

// Helper to execute a fixed script via SSH with arguments
function executeFixedScript({ host, port = 22, username, password, scriptPath, args = [] }, res, endpoint) {
  if (!host || !username || !password || !scriptPath) {
    logEvent('error', { endpoint, host, username, error: 'Missing required fields' });
    return res.status(400).json({ error: 'Missing required fields' });
  }
  // Sanitize args to prevent command injection (basic)
  const safeArgs = Array.isArray(args) ? args.map(a => `'${String(a).replace(/'/g, "'\''")}'`).join(' ') : '';
  const command = `${scriptPath} ${safeArgs}`;
  const conn = new Client();
  const audit = { endpoint, host, username, script: scriptPath, args, time: new Date().toISOString() };
  logEvent('audit', { ...audit, action: 'START' });
  conn.on('ready', () => {
    conn.exec(command, (err, stream) => {
      if (err) {
        conn.end();
        logEvent('error', { ...audit, error: err.message });
        return res.status(500).json({ error: err.message });
      }
      let stdout = '';
      let stderr = '';
      stream.on('close', (code, signal) => {
        conn.end();
        logEvent('audit', { ...audit, action: 'END', code, signal, stdout, stderr });
        res.json({ stdout, stderr, code, signal });
      }).on('data', (data) => {
        stdout += data;
      }).stderr.on('data', (data) => {
        stderr += data;
      });
    });
  }).on('error', (err) => {
    logEvent('error', { ...audit, error: err.message });
    res.status(500).json({ error: err.message });
  }).connect({ host, port, username, password });
}

// Example endpoint: POST /run-script
// Body: { host, port, username, password, script }
app.post('/run-script', (req, res) => {
  const { host, port = 22, username, password, script } = req.body;
  if (!host || !username || !password || !script) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const conn = new Client();
  conn.on('ready', () => {
    conn.exec(script, (err, stream) => {
      if (err) {
        conn.end();
        return res.status(500).json({ error: err.message });
      }
      let stdout = '';
      let stderr = '';
      stream.on('close', (code, signal) => {
        conn.end();
        res.json({ stdout, stderr, code, signal });
      }).on('data', (data) => {
        stdout += data;
      }).stderr.on('data', (data) => {
        stderr += data;
      });
    });
  }).on('error', (err) => {
    res.status(500).json({ error: err.message });
  }).connect({ host, port, username, password });
});

app.post('/getMartSummary', (req, res) => {
  // Fixed script path for mart summary
  const scriptPath = '/path/to/mart_summary.sh'; // Change to your actual script path
  executeFixedScript({ ...req.body, scriptPath }, res, 'getMartSummary');
});

app.post('/getManagerSummary', (req, res) => {
  // Fixed script path for manager summary
  const scriptPath = '/path/to/manager_summary.sh'; // Change to your actual script path
  executeFixedScript({ ...req.body, scriptPath }, res, 'getManagerSummary');
});

app.post('/getWorkerSummary', (req, res) => {
  // Fixed script path for worker summary
  const scriptPath = '/path/to/worker_summary.sh'; // Change to your actual script path
  executeFixedScript({ ...req.body, scriptPath }, res, 'getWorkerSummary');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Service listening on port ${PORT}`);
});
