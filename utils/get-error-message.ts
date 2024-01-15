export function getErrorMessage(error: unknown, CustomErrorTypes?: (new (...args: any[]) => Error)[]): string {
    if (CustomErrorTypes) {
        for (const CustomErrorType of CustomErrorTypes) {
            if (error instanceof CustomErrorType) {
                // It's an instance of one of the custom error types, we can access error.message safely
                return error.message;
            }
        }
    }
    else if (error instanceof Error) {
        // It's an Error object, we can access error.message safely
        return error.message;
    } else if (typeof error === 'string') {
        // It's a string, we can return it directly
        return error;
    } else if (error instanceof Object) {
        // It's an object, we can stringify it
        return JSON.stringify(error);
    }
    // It's a primitive (number, boolean, null, undefined), we can convert it to a string
    return String(error);

}
