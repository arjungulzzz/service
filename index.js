const express = require('express');
const { Client } = require('ssh2');

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
  // Replace 'echo Mart Summary' with your actual script/command
  executeRemoteScript({ ...req.body, script: req.body.script || 'echo Mart Summary' }, res);
});

app.post('/getManagerSummary', (req, res) => {
  // Replace 'echo Manager Summary' with your actual script/command
  executeRemoteScript({ ...req.body, script: req.body.script || 'echo Manager Summary' }, res);
});

app.post('/getWorkerSummary', (req, res) => {
  // Replace 'echo Worker Summary' with your actual script/command
  executeRemoteScript({ ...req.body, script: req.body.script || 'echo Worker Summary' }, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Service listening on port ${PORT}`);
});
