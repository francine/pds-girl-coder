type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
}

class Logger {
  private formatLog(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(data && { data }),
    };
  }

  private output(logEntry: LogEntry): void {
    const { level, ...rest } = logEntry;
    const logString = JSON.stringify(rest);

    switch (level) {
      case 'error':
        console.error(logString);
        break;
      case 'warn':
        console.warn(logString);
        break;
      case 'info':
        console.info(logString);
        break;
      case 'debug':
        if (process.env.NODE_ENV !== 'production') {
          console.debug(logString);
        }
        break;
    }
  }

  debug(message: string, data?: any): void {
    this.output(this.formatLog('debug', message, data));
  }

  info(message: string, data?: any): void {
    this.output(this.formatLog('info', message, data));
  }

  warn(message: string, data?: any): void {
    this.output(this.formatLog('warn', message, data));
  }

  error(message: string, data?: any): void {
    this.output(this.formatLog('error', message, data));
  }
}

export const logger = new Logger();
