import { SyntaxType, ThriftDocument, ThriftError } from "./types";
export interface ParseOptions {
    fastFail: boolean;
    rootDir: string;
    outDir: string;
    files: Array<string>;
    organize: boolean;
}
export declare const defaultOptions: ParseOptions;
export declare function parse(source: string, options?: Partial<ParseOptions>): ThriftDocument | {
    type: SyntaxType;
    errors: ThriftError[];
};
export * from "./generater";
export * from "./types";
