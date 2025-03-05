const colors = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

class Logger {
  info(message: string) {
    console.log(`${colors.yellow}[INFO] ${message}${colors.reset}`);
  }

  error(message: string) {
    console.log(`${colors.red}[ERROR] ${message}${colors.reset}`);
  }
}

export const logger = new Logger();
