import { ErrorReporter } from "./debugger";
import { ErrorType, FieldId, TextLocation, ThriftDocument, Token } from "./types";
export interface Parser {
    parse(): ThriftDocument;
    synchronize(): void;
}
export declare function createParseError(message: string, loc: TextLocation): {
    type: ErrorType;
    message: string;
    loc: TextLocation;
};
export declare function createFieldId(value: number, loc: TextLocation): FieldId;
export declare function createParser(tokens: Array<Token>, report?: ErrorReporter): {
    parse: () => ThriftDocument;
    synchronize: () => void;
};
