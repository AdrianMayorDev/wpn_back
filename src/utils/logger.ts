import util from 'util';
import fs from 'fs';
import path from 'path';

const colors = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

const LOG_DIR = path.resolve(__dirname, '../../logs');
const MAX_LOG_FILES = 5;
const LOG_LEVEL = process.env.LOG_LEVEL ?? 'info';

class Logger {
  private static instance: Logger;

  constructor() {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR);
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: string, message: string | object, additionalData?: any): string {
    const timestamp = new Date().toISOString().replace('T', ' ').replace('Z', '');
    const formattedMessage =
      typeof message === 'object' ? util.inspect(message, { depth: null, colors: true }) : message;
    const formattedAdditionalData = additionalData
      ? `\n${util.inspect(additionalData, { depth: null, colors: true })}`
      : '';
    return `${timestamp} ${level} ${formattedMessage}${formattedAdditionalData}${colors.reset}`;
  }

  private writeLogToFile(message: string) {
    const logFileName = path.join(LOG_DIR, `log_${new Date().toISOString().replace(/[:.]/g, '-')}.log`);
    fs.appendFileSync(logFileName, message + '\n');
    this.rotateLogs();
  }

  private rotateLogs() {
    const logFiles = fs
      .readdirSync(LOG_DIR)
      .filter((file) => file.startsWith('log_'))
      .sort();
    if (logFiles.length > MAX_LOG_FILES) {
      const filesToDelete = logFiles.slice(0, logFiles.length - MAX_LOG_FILES);
      for (const file of filesToDelete) {
        fs.unlinkSync(path.join(LOG_DIR, file));
      }
    }
  }

  log(level: string, message: string | object, additionalData?: any) {
    const color = this.getColor(level);
    const formattedMessage = this.formatMessage(level, message, additionalData);
    console.log(`${color}${formattedMessage}\n${colors.reset}`);
    this.writeLogToFile(formattedMessage);
  }

  private getColor(level: string): string {
    switch (level.toUpperCase()) {
      case '[INFO]':
        return colors.yellow;
      case '[ERROR]':
        return colors.red;
      case '[WARN]':
        return colors.magenta;
      case '[DEBUG]':
        return colors.blue;
      default:
        return colors.reset;
    }
  }

  info(message: string, additionalData?: any) {
    if (['info', 'debug'].includes(LOG_LEVEL)) {
      this.log('[INFO]', message, additionalData);
    }
  }

  error(message: string, additionalData?: any) {
    if (['info', 'debug', 'error'].includes(LOG_LEVEL)) {
      this.log('[ERROR]', message, additionalData);
    }
  }

  warn(message: string, additionalData?: any) {
    if (['info', 'debug', 'warn'].includes(LOG_LEVEL)) {
      this.log('[WARN]', message, additionalData);
    }
  }

  debug(message: string, additionalData?: any) {
    if (LOG_LEVEL === 'debug') {
      const stack = new Error().stack;
      const callerFile = stack ? stack.split('\n')[2].trim().split(' ')[1] : 'unknown file';
      const enhancedMessage = `${callerFile}: ${message}`;
      this.log('[DEBUG]', enhancedMessage, additionalData);
    }
  }
}

export const logger = Logger.getInstance();
