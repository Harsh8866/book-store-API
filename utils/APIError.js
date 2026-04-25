class APIError extends Error {
    constructor(statusCode, message, errorCode, error) {
        super(message)
        this.statusCode = statusCode
        this.errorCode = errorCode
        this.error = error
    }
}

module.exports = APIError; 