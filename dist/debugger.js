"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDebugger = exports.noopReporter = void 0;
const os = require("node:os");
const types_1 = require("./types");
function noopReporter(err) {
    throw new Error(`${err.type}: Line: ${err.loc.start.line}: ${err.message}`);
}
exports.noopReporter = noopReporter;
function padLeft(num, str) {
    while (str.length < num) {
        str = " " + str;
    }
    return str;
}
function indicatorForLocation(loc) {
    const indicator = padLeft(loc.start.column, "^");
    return indicator;
}
function padStart(length, str) {
    let paddedStr = str;
    while (length--) {
        paddedStr = " " + paddedStr;
    }
    return paddedStr;
}
function errorType(type) {
    switch (type) {
        case types_1.ErrorType.ParseError:
            return "Parse Error:";
        case types_1.ErrorType.ScanError:
            return "Scan Error:";
    }
}
function createDebugger(source) {
    const sourceLines = source.split(os.EOL);
    const formattedErrors = [];
    const rawErrors = [];
    /** 获取原始代码的第 x 行代码 */
    function getSourceLine(lineNumber) {
        return sourceLines[lineNumber - 1];
    }
    function formatError(err) {
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
        hasError() {
            return formattedErrors.length > 0;
        },
        getErrors() {
            return rawErrors;
        },
        getFormattedErrors() {
            return formattedErrors;
        },
        report(err) {
            const formattedError = formatError(err);
            formattedErrors.push(formattedError);
            rawErrors.push(err);
        },
        print() {
            console.log(`Parse Failure: ${formattedErrors.length} errors found:`);
            console.log();
            formattedErrors.some((err) => {
                const prefix = `${err.line} |`;
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
exports.createDebugger = createDebugger;
//# sourceMappingURL=debugger.js.map