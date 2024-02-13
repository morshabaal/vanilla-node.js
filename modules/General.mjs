/**
 * Prints a given message to the console with date and timestamp included.
 * @param {string} message - The message to be printed.
 * @returns {string} The date and timestamp formatted message.
 */
export function LogMessage(message) {
    const timestamp = new Date().toLocaleString("sv-SE");
    return console.log(`[${timestamp}]: ${message}`);
}

/**
 * Validates a given email address using regular expression (RegEx).
 * @param {string} email - Email address to be validated.
 * @returns {boolean} Confirmation for if the email address validation passed.
 */
export function ValidateEmailAddress(email) {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(email) && email.length >= 6 && email.length < 255;
}

/**
 * Validates a given password using regular expression (RegEx).
 * @param {string} password - Password to be validated.
 * @returns {boolean} Confirmation for if the password validation passed.
 */
export function ValidatePassword(password) {
    /**
     * Password requirements:
     * Lowercase letters: [a-z]
     * Uppercase letters: [A-Z]
     * Digits: [0-9]
     * Special characters: [! @ # $ % & ? ^ * . : , ; _ -]
     * Length: 8-30 characters
     */
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&?^*.:,;_\-])[a-zA-Z\d!@#$%&?^*.:,;_\-]{8,30}$/;
    return pattern.test(password);
}
