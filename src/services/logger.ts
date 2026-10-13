import { Env } from '@/config/env';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  tag: string;
  message: string;
  data?: unknown;
}

type LogHandler = (entry: LogEntry) => void;

class LoggingService {
  private handlers: LogHandler[] = [];

  constructor() {
    // Default console handler
    this.registerHandler(this.consoleHandler);
  }

  public registerHandler(handler: LogHandler): () => void {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  private dispatch(level: LogLevel, tag: string, message: string, data?: unknown) {
    if (level === 'debug' && !Env.enableDebugLogging) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      tag,
      message,
      data,
    };

    for (const handler of this.handlers) {
      try {
        handler(entry);
      } catch (err) {
        console.error('Logger handler error:', err);
      }
    }
  }

  private consoleHandler(entry: LogEntry) {
    const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.tag}]:`;
    switch (entry.level) {
      case 'debug':
        console.debug(prefix, entry.message, entry.data ?? '');
        break;
      case 'info':
        console.info(prefix, entry.message, entry.data ?? '');
        break;
      case 'warn':
        console.warn(prefix, entry.message, entry.data ?? '');
        break;
      case 'error':
        console.error(prefix, entry.message, entry.data ?? '');
        break;
    }
  }

  public debug(tag: string, message: string, data?: unknown) {
    this.dispatch('debug', tag, message, data);
  }

  public info(tag: string, message: string, data?: unknown) {
    this.dispatch('info', tag, message, data);
  }

  public warn(tag: string, message: string, data?: unknown) {
    this.dispatch('warn', tag, message, data);
  }

  public error(tag: string, message: string, data?: unknown) {
    this.dispatch('error', tag, message, data);
  }
}

export const Logger = new LoggingService();
export default Logger;
