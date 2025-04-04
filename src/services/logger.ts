/**
 * Утилита для логирования сообщений с разными уровнями важности.
 */
export class Logger {
	/**
	 * Логирование сообщения об ошибке.
	 *
	 * @param message Сообщение об ошибке.
	 * @param error Дополнительные данные об ошибке (опционально).
	 */
	static error(message: string, error?: unknown) {
		console.error(`[ERROR] ${message}`, error);
	}

	/**
	 * Логирование информационного сообщения.
	 *
	 * @param message Информационное сообщение.
	 * @param data Дополнительные данные (опционально).
	 */
	static info(message: string, data?: unknown) {
		console.info(`[INFO] ${message}`, data);
	}

	/**
	 * Логирование предупреждающего сообщения.
	 *
	 * @param message Сообщение-предупреждение.
	 * @param data Дополнительные данные (опционально).
	 */
	static warn(message: string, data?: unknown) {
		console.warn(`[WARN] ${message}`, data);
	}
}
