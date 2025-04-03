/**
 * Устанавливает/очищает кастомное сообщение об ошибке и показывает тултип браузера.
 */
export function updateValidationUI(
	input: HTMLInputElement,
	isValid: boolean,
	message: string
): void {
	if (isValid) {
		input.setCustomValidity('');
	} else {
		input.setCustomValidity(message);
		input.reportValidity();
	}
}
