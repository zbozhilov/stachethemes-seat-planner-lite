export const getHasValidPattern = (value: string) => {
    const validPatternRegex = /\[([a-zA-Z]|\d+)([\*~](\d+))?\]/g;
    return value.endsWith('!') && validPatternRegex.test(value);
}

/**
 * Increments the value of a string based on a pattern
 */
export const getIncrementValueByRegex = (value: string, objectIndex: number) => {
    const validPatternRegex = /\[([a-zA-Z]|\d+)([\*~](\d+))?\]/g;

    // Check if the value ends with "!" and contains valid patterns
    if (!value.endsWith('!') || !validPatternRegex.test(value)) {
        return value; // Return the original value if it doesn't meet the criteria
    }

    const stringWithoutExclamation = value.slice(0, -1); // Remove the "!" for processing

    const newValue = stringWithoutExclamation.replace(validPatternRegex, (match, charOrNumber, operatorAndCount, countStr) => {
        const count = countStr ? parseInt(countStr, 10) : 1;
        const isCyclic = operatorAndCount?.startsWith('~');

        let result;

        if (!isNaN(charOrNumber)) { // Handle numeric increment
            const number = parseInt(charOrNumber, 10);
            if (isCyclic) {
                // Cyclic increment for numbers
                result = number + (objectIndex % count);
            } else {
                // Linear increment for numbers
                result = number + Math.floor(objectIndex / count);
            }
        } else { // Handle character increment
            const charCode = charOrNumber.charCodeAt(0);
            if (isCyclic) {
                // Cyclic increment for characters
                if (charOrNumber >= 'a' && charOrNumber <= 'z') {
                    result = String.fromCharCode(((charCode - 97 + (objectIndex % count)) % 26) + 97);
                } else if (charOrNumber >= 'A' && charOrNumber <= 'Z') {
                    result = String.fromCharCode(((charCode - 65 + (objectIndex % count)) % 26) + 65);
                } else {
                    result = charOrNumber;
                }
            } else {
                // Linear increment for characters
                if (charOrNumber >= 'a' && charOrNumber <= 'z') {
                    result = String.fromCharCode(((charCode - 97 + Math.floor(objectIndex / count)) % 26) + 97);
                } else if (charOrNumber >= 'A' && charOrNumber <= 'Z') {
                    result = String.fromCharCode(((charCode - 65 + Math.floor(objectIndex / count)) % 26) + 65);
                } else {
                    result = charOrNumber;
                }
            }
        }

        return result;
    });

    return newValue;
};

// Examples of valid patterns:

// Linear Increment:

// [A*3]! → A, A, A, B, B, B, ...
// [1*3]! → 1, 1, 1, 2, 2, 2, ...

// Cyclic Increment:

// [A~3]! → A, B, C, A, B, C, ...
// [1~3]! → 1, 2, 3, 1, 2, 3, ...

// Combined Patterns:

// [A*3]-[1~3]! → A-1, A-2, A-3, B-1, B-2, B-3, ...

// the ! represents the end of the whole pattern