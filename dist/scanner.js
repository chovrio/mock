"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScanner = void 0;
const debugger_1 = require("./debugger");
const factory_1 = require("./factory");
const keywords_1 = require("./keywords");
const types_1 = require("./types");
/** 判断是否为数字 */
function isDigit(value) {
    return value >= "0" && value <= "9";
}
/** 判断是否为字母 */
function isAlpha(value) {
    return (value >= "a" && value <= "z") || (value >= "A" && value <= "Z");
}
/** 标识符的第一个字符可以是字母或下划线 */
function isAlphaOrUnderscore(value) {
    return isAlpha(value) || value === "_";
}
/** 有效标识符 */
function isValidIdentifier(value) {
    return (isAlphaOrUnderscore(value) ||
        isDigit(value) ||
        value === "." ||
        value === "-");
}
/** 是十六进制数字 */
function isHexDigit(value) {
    return ((value >= "0" && value <= "9") ||
        (value >= "A" && value <= "F") ||
        (value >= "a" && value <= "f"));
}
/** 是空格 */
function isWhiteSpace(char) {
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
    constructor(msg, loc) {
        super(msg);
        this.message = msg;
        this.loc = loc;
    }
}
function createScanner(src, report = debugger_1.noopReporter) {
    const source = src;
    const tokens = [];
    let line = 1;
    let column = 1;
    let startLine = 1;
    let startColumn = 1;
    let startIndex = 1;
    let currentIndex = 0;
    function scan() {
        while (!isAtEnd()) {
            try {
                startIndex = currentIndex;
                startLine = line;
                startColumn = column;
                scanToken();
            }
            catch (e) {
                report((0, factory_1.createScanError)(e.message, e.loc));
            }
        }
        startIndex = currentIndex;
        addToken(types_1.SyntaxType.EOF);
        return tokens;
    }
    function synchronize() {
        while (!isAtEnd() && isWhiteSpace(current())) {
            advance();
        }
    }
    function scanToken() {
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
                addToken(types_1.SyntaxType.EqualToken);
                break;
            case "(":
                addToken(types_1.SyntaxType.LeftParenToken);
                break;
            case ")":
                addToken(types_1.SyntaxType.RightParenToken);
                break;
            case "{":
                addToken(types_1.SyntaxType.LeftBraceToken);
                break;
            case "}":
                addToken(types_1.SyntaxType.RightBraceToken);
                break;
            case "[":
                addToken(types_1.SyntaxType.LeftBracketToken);
                break;
            case "]":
                addToken(types_1.SyntaxType.RightBracketToken);
                break;
            case ";":
                addToken(types_1.SyntaxType.SemicolonToken);
                break;
            case ",":
                addToken(types_1.SyntaxType.CommaToken);
                break;
            // 字符串单引号双引号都可
            case '"':
            case "'":
                string(next);
                break;
            case ":":
                addToken(types_1.SyntaxType.ColonToken);
                break;
            case "#":
                singleLineComment();
                break;
            case "/":
                if (peek() === "/") {
                    singleLineComment();
                }
                else if (peek() === "*") {
                    multilineComment();
                }
                else {
                    reportError(`Unexpected token: ${next}`);
                }
                break;
            case "<":
                addToken(types_1.SyntaxType.LessThanToken);
                break;
            case ">":
                addToken(types_1.SyntaxType.GreaterThanToken);
                break;
            case "-":
                if (isDigit(peek())) {
                    number();
                }
                else {
                    addToken(types_1.SyntaxType.MinusToken);
                }
                break;
            default:
                if (isDigit(next)) {
                    number();
                }
                else if (isAlphaOrUnderscore(next)) {
                    identifier();
                }
                else if (isValidIdentifier(next)) {
                    reportError(`Invalid identifier '${next}': Identifiers must begin with a letter or underscore`);
                }
                else {
                    reportError(`Unexpected token: ${next}`);
                }
        }
    }
    function identifier() {
        while (!isAtEnd() && peek() !== "\n" && isValidIdentifier(peek())) {
            advance();
        }
        const literal = source.substring(startIndex, currentIndex);
        const type = keywords_1.KEYWORDS[literal];
        if (type === void 0) {
            addToken(types_1.SyntaxType.Identifier, literal);
        }
        else {
            addToken(type, literal);
        }
    }
    function number() {
        if (current() === "0" && (consume("x") || consume("X"))) {
            hexadecimal();
        }
        else {
            integer();
            if (peek() === "e" || peek() === "E") {
                enotation();
            }
            else if (peek() === "." && isDigit(peekNext())) {
                float();
            }
            else {
                commitToken(types_1.SyntaxType.IntegerLiteral);
            }
        }
    }
    function hexadecimal() {
        while (!isAtEnd() && peek() !== "\n" && isHexDigit(peek())) {
            advance();
        }
        commitToken(types_1.SyntaxType.HexLiteral);
    }
    function enotation() {
        consume("e") || consume("E");
        consume("-") || consume("+");
        if (isDigit(peek())) {
            integer();
            commitToken(types_1.SyntaxType.ExponentialLiteral);
        }
        else {
            reportError(`Invalid use of e-notation`);
        }
    }
    function float() {
        consume(".");
        integer();
        if (peek() === "e" || peek() === "E") {
            enotation();
        }
        else {
            commitToken(types_1.SyntaxType.FloatLiteral);
        }
    }
    /** 数字 */
    function integer() {
        while (!isAtEnd() && peek() !== "\n" && isDigit(peek())) {
            advance();
        }
    }
    /** 单行注释 */
    function singleLineComment() {
        let comment = "";
        while (true) {
            if (current() === "\n" ||
                isAtEnd() ||
                (current() !== "/" && current() !== "#" && current() !== " ")) {
                break;
            }
            else {
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
        addToken(types_1.SyntaxType.CommentLine, comment.trim());
    }
    /** 多行注释 */
    function multilineComment() {
        let comment = "";
        let cursor = 0;
        while (true) {
            if (current() === "\n" ||
                isAtEnd() ||
                (current() !== "/" && current() !== "*" && current() !== " ")) {
                break;
            }
            else {
                advance();
            }
        }
        while (true) {
            if (current() === "\n") {
                nextLine();
            }
            if (comment.charAt(cursor - 1) === "\n" &&
                (peek() === " " || peek() === "*")) {
                /**
                 * We ignore stars and spaces after a new line to normalize comment formatting.
                 * We're only keeping the text of the comment without the extranious formatting.
                 */
            }
            else {
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
        addToken(types_1.SyntaxType.CommentBlock, comment.trim());
    }
    /** 找出一个字符? identify 之类 */
    function string(terminator) {
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
        }
        else {
            // advance past closing
            advance();
            //
            const literal = source
                .substring(startIndex + 1, currentIndex - 1)
                .replace(/\\(\"|\')/g, "$1");
            addToken(types_1.SyntaxType.StringLiteral, literal);
        }
    }
    /** 吃掉指定字符 */
    function consume(text) {
        if (peek() === text) {
            advance();
            return true;
        }
        return false;
    }
    /** 进行 */
    function advance() {
        currentIndex++;
        column++;
        return source.charAt(currentIndex - 1);
    }
    /** 回顾上一行 */
    function previous() {
        return source.charAt(currentIndex - 2);
    }
    /** 判断当前行是否存在 */
    function current() {
        return source.charAt(currentIndex - 1);
    }
    /** 判断当下一行是否存在 */
    function peek() {
        return source.charAt(currentIndex);
    }
    /** 判断后一行是否存在 */
    function peekNext() {
        return source.charAt(currentIndex + 1);
    }
    /** 下一行 */
    function nextLine() {
        line++;
        column = 1;
    }
    /** 提交一个Token */
    function commitToken(type) {
        const literal = source.substring(startIndex, currentIndex);
        addToken(type, literal);
    }
    /** 返回解析到的位置 */
    function currentLocation() {
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
    function addToken(type, value = "") {
        const loc = currentLocation();
        tokens.push((0, factory_1.createToken)(type, value, loc));
    }
    function isAtEnd() {
        return currentIndex >= source.length;
    }
    /** 报错 */
    function reportError(msg) {
        throw new ScanError(msg, currentLocation());
    }
    return {
        scan,
        synchronize,
    };
}
exports.createScanner = createScanner;
//# sourceMappingURL=scanner.js.map