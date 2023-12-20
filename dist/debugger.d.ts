import { ErrorType, ThriftError } from "./types";
export type ErrorReporter = (err: ThriftError) => void;
export interface Debugger {
    report: ErrorReporter;
    hasError(): boolean;
    getErrors(): Array<ThriftError>;
    getFormattedErrors(): Array<FormattedError>;
    print(): void;
}
export interface FormattedError {
    sourceLine: string;
    locIndicator: string;
    line: number;
    column: number;
    message: string;
    type: ErrorType;
}
export declare function noopReporter(err: ThriftError): void;
export declare function createDebugger(source: string): Debugger;
