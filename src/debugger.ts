import * as os from "node:os";
import { ErrorType, TextLocation, ThriftError } from "./types";

export type ErrorReporter = (err: ThriftError) => void;

export interface Debugger {
  report: ErrorReporter;
  hasError(): boolean;
  getErrors(): Array<ThriftError>;
  getFormattedErrors(): Array<FormattedError>;
  print(): void;
}

// 格式化错误?
export interface FormattedError {
  sourceLine: string; // 源行
  locIndicator: string; // 错误的定义
  line: number; // 行
  column: number; // 列
  message: string; // 错误信息
  type: ErrorType; // 错误类型
}

export function noopReporter(err: ThriftError): void {
  throw new Error(`${err.type}: Line: ${err.loc.start.line}: ${err.message}`);
}

function padLeft(num: number, str: string): string {
  while (str.length < num) {
    str = " " + str;
  }
  return str;
}

function indicatorForLocation(loc: TextLocation): string {
  const indicator = padLeft(loc.start.column, "^");
  return indicator;
}

function padStart(length: number, str: string): string {
  let paddedStr: string = str;
  while (length--) {
    paddedStr = " " + paddedStr;
  }
  return paddedStr;
}

function errorType(type: ErrorType): string {
  switch (type) {
    case ErrorType.ParseError:
      return "Parse Error:";
    case ErrorType.ScanError:
      return "Scan Error:";
  }
}

export function createDebugger(source: string): Debugger {
  const sourceLines: Array<string> = source.split(os.EOL);
  const formattedErrors: Array<FormattedError> = [];
  const rawErrors: Array<ThriftError> = [];

  /** 获取原始代码的第 x 行代码 */
  function getSourceLine(lineNumber: number): string {
    return sourceLines[lineNumber - 1];
  }

  function formatError(err: ThriftError): FormattedError {
    return {
      sourceLine: getSourceLine(err.loc.start.line),
      locIndicator: indicatorForLocation(err.loc),
      line: err.loc.start.line,
      column: err.loc.start.column,
      message: err.message,
      type: err.type,
    };
  }

  return {
    hasError(): boolean {
      return formattedErrors.length > 0;
    },
    getErrors(): Array<ThriftError> {
      return rawErrors;
    },
    getFormattedErrors(): Array<FormattedError> {
      return formattedErrors;
    },
    report(err: ThriftError): void {
      const formattedError: FormattedError = formatError(err);
      formattedErrors.push(formattedError);
      rawErrors.push(err);
    },
    print(): void {
      console.log(`Parse Failure: ${formattedErrors.length} errors found:`);
      console.log();
      formattedErrors.some((err: FormattedError): void => {
        const prefix: string = `${err.line} |`;
        console.log();
        console.log(`${errorType(err.type)}`);
        console.log(`Message: ${err.message}`);
        console.log();
        console.log(`${prefix}${err.sourceLine}`);
        console.log(padStart(prefix.length, err.locIndicator));
        console.log();
      });
    },
  };
}
