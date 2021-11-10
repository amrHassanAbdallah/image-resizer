export default class FileNotFoundErr extends Error {
    statusCode: number;

    constructor() {
        super("File not found");
        this.statusCode = 404
        Object.setPrototypeOf(this, FileNotFoundErr.prototype);
    }
}
