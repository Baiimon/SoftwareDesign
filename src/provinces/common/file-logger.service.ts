import { ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export class FileLogger extends ConsoleLogger {
  private readonly logDir = path.join(process.cwd(), 'logs');

  constructor() {
    super();
    try {
      if (!fs.existsSync(this.logDir))
        fs.mkdirSync(this.logDir, { recursive: true });
    } catch {
      // ignore directory creation error
    }
  }

  private get logFilePath(): string {
    const dateStamp = new Date().toISOString().slice(0, 10);
    return path.join(this.logDir, `app-${dateStamp}.log`);
  }

  private writeToFile(level: string, message: unknown, context?: string) {
    try {
      const text =
        typeof message === 'string' ? message : JSON.stringify(message);
      const line = `[${new Date().toISOString()}] [${level}]${context ? ` [${context}]` : ''} ${text}\n`;
      fs.appendFile(this.logFilePath, line, () => {
        // ignore file write callback
      });
    } catch {
      // ignore file write error
    }
  }

  log(message: unknown, context?: string) {
    super.log(message as any, context as any);
    this.writeToFile('LOG', message, context);
  }
  error(message: unknown, trace?: string, context?: string) {
    super.error(message as any, trace as any, context as any);
    this.writeToFile(
      'ERROR',
      trace ? `${message as string} - ${trace}` : message,
      context,
    );
  }
  warn(message: unknown, context?: string) {
    super.warn(message as any, context as any);
    this.writeToFile('WARN', message, context);
  }
  debug(message: unknown, context?: string) {
    super.debug?.(message as any, context as any);
    this.writeToFile('DEBUG', message, context);
  }
  verbose(message: unknown, context?: string) {
    super.verbose?.(message as any, context as any);
    this.writeToFile('VERBOSE', message, context);
  }
}
