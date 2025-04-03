/**
 * Проверка email с помощью регулярного выражения.
 */
export function validateEmail(email: string): boolean {
	const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return pattern.test(email);
}

/**
 * Проверка телефона: от 10 до 15 цифр, можно с "+".
 */
export function validatePhone(phone: string): boolean {
	const pattern = /^\+?\d{10,15}$/;
	return pattern.test(phone);
}

/**
 * Проверка адреса доставки: минимум 5 символов, допустимые символы — буквы, цифры, пробелы, запятые, точки, дефисы.
 */
export function validateAddress(address: string): boolean {
	const pattern = /^[a-zA-Zа-яА-ЯёЁ0-9\s,.-]{5,}$/;
	return pattern.test(address);
}
