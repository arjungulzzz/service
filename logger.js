const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, 'service.log');

function logEvent(type, details) {
  const entry = `[${new Date().toISOString()}] [${type}] ${JSON.stringify(details)}\n`;
  fs.appendFile(LOG_FILE, entry, err => {
    if (err) console.error('Failed to write log:', err);
  });
}

module.exports = { logEvent };
