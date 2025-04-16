import process from 'process';
import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  try {
    fs.mkdirSync(logsDir, { recursive: true });
  } catch (err) {
    console.error('Error creating logs directory:', err);
  }
}

// Function to write log to file
const writeToLogFile = (message, type = 'INFO') => {
  if (!process.env.CHATBOT_DEBUG) return;
  
  try {
    const now = new Date();
    const timestamp = now.toISOString();
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const logFile = path.join(logsDir, `chatbot-${dateStr}.log`);
    
    const logEntry = `[${timestamp}] [${type}] ${message}\n`;
    fs.appendFileSync(logFile, logEntry);
  } catch (err) {
    console.error('Error writing to log file:', err);
  }
};

/**
 * Enhanced logger utility with different log levels
 * Supports structured logging with context objects
 */
const logger = {
  info: (message, context = {}) => {
    console.log(`INFO [${new Date().toISOString()}]: ${message}`);
    if (Object.keys(context).length > 0) {
      console.log(JSON.stringify(context, null, 2));
    }
  },
  
  warn: (message, context = {}) => {
    console.warn(`WARNING [${new Date().toISOString()}]: ${message}`);
    if (Object.keys(context).length > 0) {
      console.warn(JSON.stringify(context, null, 2));
    }
  },
  
  error: (message, context = {}) => {
    console.error(`ERROR [${new Date().toISOString()}]: ${message}`);
    if (context.error) {
      console.error(context.error);
    }
    if (Object.keys(context).length > 0) {
      console.error(JSON.stringify(context, null, 2));
    }
  },
  
  debug: (message, context = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`DEBUG [${new Date().toISOString()}]: ${message}`);
      if (Object.keys(context).length > 0) {
        console.log(JSON.stringify(context, null, 2));
      }
    }
  },
  
  /**
   * Specialized logging for chatbot/AI functionality
   * Always logs in development or if CHATBOT_DEBUG is explicitly enabled
   */
  chatbot: (message, context = {}) => {
    // Always log in development or if CHATBOT_DEBUG is explicitly enabled
    if (process.env.NODE_ENV !== 'production' || process.env.CHATBOT_DEBUG === 'true') {
      const chatPrefix = '\x1b[36m[CHATBOT]\x1b[0m'; // Cyan color for chatbot logs
      console.log(`${chatPrefix} ${message}`);
      
      // Write to log file
      writeToLogFile(message, 'CHATBOT');
      
      if (Object.keys(context).length > 0) {
        console.log(JSON.stringify(context, null, 2));
        // Write context to log file as well
        writeToLogFile(JSON.stringify(context, null, 2), 'CONTEXT');
      }
    }
  }
};

export { logger }; 