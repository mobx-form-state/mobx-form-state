export class Logger {
  static LoggerName = 'mobx-form-state';

  info = (message: string): void => {
    console.info(this.wrap(message));
  };

  log = (message: string): void => {
    console.log(this.wrap(message));
  };

  warn = (message: string): void => {
    console.warn(this.wrap(message));
  };

  error = (message: string): void => {
    console.error(this.wrap(message));
  };

  wrap = (message: string): string => `[${Logger.LoggerName}] - ${message}`;
}

export const logger = new Logger();
