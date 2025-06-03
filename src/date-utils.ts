/**
 * Simple date utilities to replace date-fns functionality
 */

/**
 * Format a date as YYYYMMDD
 */
export function formatDate(date: Date, pattern: string): string {
    if (pattern === "yyyyMMdd" || pattern === "yyyMMdd") {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}${month}${day}`;
    }

    if (pattern === "HHMMss") {
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${hours}${minutes}${seconds}`;
    }

    throw new Error(`Unsupported date format pattern: ${pattern}`);
}

/**
 * Parse a date string in YYYYMMDD format
 */
export function parseDate(dateString: string, pattern: string, _referenceDate: Date): Date {
    if (pattern === "yyyyMMdd") {
        if (dateString.length !== 8) {
            throw new Error(`Invalid date string: ${dateString}`);
        }

        const year = parseInt(dateString.substring(0, 4), 10);
        const month = parseInt(dateString.substring(4, 6), 10) - 1; // JavaScript months are 0-based
        const day = parseInt(dateString.substring(6, 8), 10);

        return new Date(year, month, day);
    }

    throw new Error(`Unsupported date parse pattern: ${pattern}`);
}
