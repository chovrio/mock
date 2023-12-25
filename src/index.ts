import { Debugger, createDebugger } from "./debugger";
import { organize } from "./organizer";
import { Parser, createParser } from "./parser";
import { Scanner, createScanner } from "./scanner";
import {
  ErrorType,
  SyntaxType,
  ThriftDocument,
  ThriftError,
  Token,
} from "./types";

export interface ParseOptions {
  fastFail: boolean;
  rootDir: string;
  outDir: string;
  files: Array<string>;
  organize: boolean;
}

export const defaultOptions: ParseOptions = {
  fastFail: false,
  rootDir: ".",
  outDir: ".",
  files: [],
  organize: true,
};

const map = new Map<string, ThriftDocument>();
export function parse(source: string, options?: Partial<ParseOptions>) {
  if (map.has(source)) return map.get(source);

  const mergedOptions: ParseOptions = { ...defaultOptions, ...options };
  const debug: Debugger = createDebugger(source);
  const scanner: Scanner = createScanner(source, handleError);
  const tokens: Array<Token> = scanner.scan();

  const parser: Parser = createParser(tokens, handleError);

  const intermediate: ThriftDocument = parser.parse();
  const thrift: ThriftDocument = mergedOptions.organize
    ? organize(intermediate)
    : intermediate;

  function handleError(err: ThriftError): void {
    debug.report(err);
    if (mergedOptions.fastFail) {
      debug.print();
      throw new Error(err.message);
    } else {
      switch (err.type) {
        case ErrorType.ParseError:
          parser.synchronize();
          break;
        case ErrorType.ScanError:
          scanner.synchronize();
          break;
      }
    }
  }

  if (debug.hasError()) {
    debug.print();
    return {
      type: SyntaxType.ThriftErrors,
      errors: debug.getErrors(),
    };
  } else {
    map.set(source, thrift);
    return thrift;
  }
}

export * from "./generator";
export * from "./types";
