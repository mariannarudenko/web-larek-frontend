export class Logger {
  static error(message: string, error?: unknown) {
    console.error(`[ERROR] ${message}`, error);
  }

  static info(message: string, data?: unknown) {
    console.info(`[INFO] ${message}`, data);
  }

  static warn(message: string, data?: unknown) {
    console.warn(`[WARN] ${message}`, data);
  }
}