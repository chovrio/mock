import { ErrorReporter, noopReporter } from "./debugger";
import { createScanError, createToken } from "./factory";
import { KEYWORDS } from "./keywords";
import { SyntaxType, TextLocation, Token } from "./types";

/** 判断是否为数字 */
function isDigit(value: string): boolean {
  return value >= "0" && value <= "9";
}

/** 判断是否为字母 */
function isAlpha(value: string): boolean {
  return (value >= "a" && value <= "z") || (value >= "A" && value <= "Z");
}

/** 标识符的第一个字符可以是字母或下划线 */
function isAlphaOrUnderscore(value: string): boolean {
  return isAlpha(value) || value === "_";
}

/** 有效标识符 */
function isValidIdentifier(value: string): boolean {
  return (
    isAlphaOrUnderscore(value) ||
    isDigit(value) ||
    value === "." ||
    value === "-"
  );
}

/** 是十六进制数字 */
function isHexDigit(value: string) {
  return (
    (value >= "0" && value <= "9") ||
    (value >= "A" && value <= "F") ||
    (value >= "a" && value <= "f")
  );
}

/** 是空格 */
function isWhiteSpace(char: string): boolean {
  switch (char) {
    case " ":
    case "\r":
    case "\t":
    case "\n":
      return true;
    default:
      return false;
  }
}

class ScanError extends Error {
  public message: string;
  public loc: TextLocation;
  constructor(msg: string, loc: TextLocation) {
    super(msg);
    this.message = msg;
    this.loc = loc;
  }
}

export interface Scanner {
  scan(): Array<Token>;
  synchronize(): void;
}

export function createScanner(
  src: string,
  report: ErrorReporter = noopReporter
) {
  const source: string = src;
  const tokens: Array<Token> = [];
  // 行
  let line: number = 1;
  // 列
  let column: number = 1;
  // 开始行
  let startLine: number = 1;
  // 开始列
  let startColumn: number = 1;
  // 开始下标
  let startIndex: number = 1;
  // 当前下标
  let currentIndex: number = 0;

  function scan(): Array<Token> {
    while (!isAtEnd()) {
      try {
        startIndex = currentIndex;
        startLine = line;
        startColumn = column;
        scanToken();
      } catch (e: any) {
        report(createScanError(e.message, e.loc));
      }
    }
    startIndex = currentIndex;
    addToken(SyntaxType.EOF);
    return tokens;
  }
  function synchronize(): void {
    while (!isAtEnd() && isWhiteSpace(current())) {
      advance();
    }
  }
  function scanToken(): void {
    const next = advance();
    switch (next) {
      case " ":
      case "\r":
      case "\t":
        // 忽略空格
        break;
      case "\n":
        // 换行
        nextLine();
        break;
      case "&":
        // js中类c的指针 忽略
        break;
      case "=":
        addToken(SyntaxType.EqualToken);
        break;
      case "(":
        addToken(SyntaxType.LeftParenToken);
        break;
      case ")":
        addToken(SyntaxType.RightParenToken);
        break;
      case "{":
        addToken(SyntaxType.LeftBraceToken);
        break;
      case "}":
        addToken(SyntaxType.RightBraceToken);
        break;
      case "[":
        addToken(SyntaxType.LeftBracketToken);
        break;
      case "]":
        addToken(SyntaxType.RightBracketToken);
        break;
      case ";":
        addToken(SyntaxType.SemicolonToken);
        break;
      case ",":
        addToken(SyntaxType.CommaToken);
        break;
      // 字符串单引号双引号都可
      case '"':
      case "'":
        string(next);
        break;
      case ":":
        addToken(SyntaxType.ColonToken);
        break;
      case "#":
        singleLineComment();
        break;
      case "/":
        if (peek() === "/") {
          singleLineComment();
        } else if (peek() === "*") {
          multilineComment();
        } else {
          reportError(`Unexpected token: ${next}`);
        }
        break;
      case "<":
        addToken(SyntaxType.LessThanToken);
        break;
      case ">":
        addToken(SyntaxType.GreaterThanToken);
        break;
      case "-":
        if (isDigit(peek())) {
          number();
        } else {
          addToken(SyntaxType.MinusToken);
        }
        break;
      default:
        if (isDigit(next)) {
          number();
        } else if (isAlphaOrUnderscore(next)) {
          identifier();
        } else if (isValidIdentifier(next)) {
          reportError(
            `Invalid identifier '${next}': Identifiers must begin with a letter or underscore`
          );
        } else {
          reportError(`Unexpected token: ${next}`);
        }
    }
  }
  function identifier(): void {
    while (!isAtEnd() && peek() !== "\n" && isValidIdentifier(peek())) {
      advance();
    }
    const literal: string = source.substring(startIndex, currentIndex);

    const type: SyntaxType = KEYWORDS[literal];
    if (type === void 0) {
      addToken(SyntaxType.Identifier, literal);
    } else {
      addToken(type, literal);
    }
  }
  function number(): void {
    if (current() === "0" && (consume("x") || consume("X"))) {
      hexadecimal();
    } else {
      integer();
      if (peek() === "e" || peek() === "E") {
        e_notation();
      } else if (peek() === "." && isDigit(peekNext())) {
        float();
      } else {
        commitToken(SyntaxType.IntegerLiteral);
      }
    }
  }
  function hexadecimal(): void {
    while (!isAtEnd() && peek() !== "\n" && isHexDigit(peek())) {
      advance();
    }
    commitToken(SyntaxType.HexLiteral);
  }
  function e_notation(): void {
    consume("e") || consume("E");
    consume("-") || consume("+");
    if (isDigit(peek())) {
      integer();
      commitToken(SyntaxType.ExponentialLiteral);
    } else {
      reportError(`Invalid use of e-notation`);
    }
  }
  function float(): void {
    consume(".");
    integer();
    if (peek() === "e" || peek() === "E") {
      e_notation();
    } else {
      commitToken(SyntaxType.FloatLiteral);
    }
  }
  /** 数字 */
  function integer(): void {
    while (!isAtEnd() && peek() !== "\n" && isDigit(peek())) {
      advance();
    }
  }
  /** 单行注释 */
  function singleLineComment(): void {
    let comment: string = "";
    while (true) {
      if (
        current() === "\n" ||
        isAtEnd() ||
        (current() !== "/" && current() !== "#" && current() !== " ")
      ) {
        break;
      } else {
        advance();
      }
    }
    if (current() !== "\n") {
      while (peek() !== "\n" && !isAtEnd()) {
        comment += current();
        advance();
      }
      comment += current();
    }
    addToken(SyntaxType.CommentLine, comment.trim());
  }
  /** 多行注释 */
  function multilineComment(): void {
    let comment: string = "";
    let cursor: number = 0;
    while (true) {
      if (
        current() === "\n" ||
        isAtEnd() ||
        (current() !== "/" && current() !== "*" && current() !== " ")
      ) {
        break;
      } else {
        advance();
      }
    }
    while (true) {
      if (current() === "\n") {
        nextLine();
      }
      if (
        comment.charAt(cursor - 1) === "\n" &&
        (peek() === " " || peek() === "*")
      ) {
        /**
         * We ignore stars and spaces after a new line to normalize comment formatting.
         * We're only keeping the text of the comment without the extraneous formatting.
         */
      } else {
        comment += current();
        cursor += 1;
      }
      advance();
      if ((peek() === "*" && peekNext() === "/") || isAtEnd()) {
        advance();
        advance();
        break;
      }
    }
    addToken(SyntaxType.CommentBlock, comment.trim());
  }
  /** 找出一个字符? identify 之类 */
  function string(terminator: string): void {
    while (!isAtEnd() && peek() !== terminator) {
      if (peek() === "\n") {
        nextLine();
      }
      if (peek() === "\\") {
        advance();
      }
      advance();
    }
    if (isAtEnd() && previous() !== terminator) {
      reportError(`String must be terminated with ${terminator}`);
    } else {
      // advance past closing
      advance();
      //
      const literal: string = source
        .substring(startIndex + 1, currentIndex - 1)
        .replace(/\\(\"|\')/g, "$1");
      addToken(SyntaxType.StringLiteral, literal);
    }
  }
  /** 吃掉指定字符 */
  function consume(text: string): boolean {
    if (peek() === text) {
      advance();
      return true;
    }
    return false;
  }
  /** 前进一位 */
  function advance(): string {
    currentIndex++;
    column++;
    return source.charAt(currentIndex - 1);
  }
  /** 回顾上一行 */
  function previous(): string {
    return source.charAt(currentIndex - 2);
  }
  /** 判断当前行是否存在 */
  function current(): string {
    return source.charAt(currentIndex - 1);
  }
  /** 判断当下一行是否存在 */
  function peek(): string {
    return source.charAt(currentIndex);
  }
  /** 判断后一行是否存在 */
  function peekNext(): string {
    return source.charAt(currentIndex + 1);
  }
  /** 下一行 */
  function nextLine() {
    line++;
    column = 1;
  }
  /** 提交一个Token */
  function commitToken(type: SyntaxType): void {
    const literal: string = source.substring(startIndex, currentIndex);
    addToken(type, literal);
  }
  /** 返回解析到的位置 */
  function currentLocation(): TextLocation {
    return {
      start: {
        line: startLine,
        column: startColumn,
        index: startIndex,
      },
      end: {
        line,
        column,
        index: currentIndex,
      },
    };
  }
  /** 新增一个Token */
  function addToken(type: SyntaxType, value: string = ""): void {
    const loc: TextLocation = currentLocation();
    tokens.push(createToken(type, value, loc));
  }
  /** 判断是否后面没内容了 */
  function isAtEnd(): boolean {
    return currentIndex >= source.length;
  }
  /** 报错 */
  function reportError(msg: string): void {
    throw new ScanError(msg, currentLocation());
  }
  return {
    scan,
    synchronize,
  };
}
