"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.defaultOptions = void 0;
const debugger_1 = require("./debugger");
const organizer_1 = require("./organizer");
const parser_1 = require("./parser");
const scanner_1 = require("./scanner");
const types_1 = require("./types");
exports.defaultOptions = {
    fastFail: false,
    rootDir: ".",
    outDir: ".",
    files: [],
    organize: true,
};
function parse(source, options) {
    const mergedOptions = Object.assign(Object.assign({}, exports.defaultOptions), options);
    const debug = (0, debugger_1.createDebugger)(source);
    const scanner = (0, scanner_1.createScanner)(source, handleError);
    const tokens = scanner.scan();
    const parser = (0, parser_1.createParser)(tokens, handleError);
    const intermediate = parser.parse();
    const thrift = mergedOptions.organize
        ? (0, organizer_1.organize)(intermediate)
        : intermediate;
    function handleError(err) {
        debug.report(err);
        if (mergedOptions.fastFail) {
            debug.print();
            throw new Error(err.message);
        }
        else {
            switch (err.type) {
                case types_1.ErrorType.ParseError:
                    parser.synchronize();
                    break;
                case types_1.ErrorType.ScanError:
                    scanner.synchronize();
                    break;
            }
        }
    }
    if (debug.hasError()) {
        debug.print();
        return {
            type: types_1.SyntaxType.ThriftErrors,
            errors: debug.getErrors(),
        };
    }
    else {
        return thrift;
    }
}
exports.parse = parse;
__exportStar(require("./generater"), exports);
__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map