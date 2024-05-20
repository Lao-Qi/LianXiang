export function convertBytesToMBGB(bytes: number, decimalPlaces = 2): string {
	if (bytes < 1024) {
		return `${bytes} B`;
	}

	if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(decimalPlaces)} KB`;
	}

	if (bytes < 1024 * 1024 * 1024) {
		return `${(bytes / (1024 * 1024)).toFixed(decimalPlaces)} MB`;
	}

	return `${(bytes / (1024 * 1024 * 1024)).toFixed(decimalPlaces)} GB`;
}  