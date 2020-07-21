export class CustomError extends Error {
    constructor(message, status = 0) {
        super(message);
        this.name = 'CustomError';
        this.status = status;
    }
}