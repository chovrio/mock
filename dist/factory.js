"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConstList = exports.createConstMap = exports.createKeywordFieldType = exports.createExponentialLiteral = exports.createFloatLiteral = exports.createHexLiteral = exports.createIntegerLiteral = exports.createBooleanLiteral = exports.createDoubleConstant = exports.createIntConstant = exports.createPropertyAssignment = exports.createMapFieldType = exports.createStringLiteral = exports.createTextLocation = exports.createIdentifier = exports.createToken = exports.createScanError = void 0;
const types_1 = require("./types");
const types_2 = require("./types");
/** 创建一个扫描错误的对象 */
function createScanError(message, loc) {
    return {
        type: types_2.ErrorType.ScanError,
        message,
        loc,
    };
}
exports.createScanError = createScanError;
/** 创建一个Token类型对象 */
function createToken(type, text, loc) {
    return { type, text, loc };
}
exports.createToken = createToken;
function createIdentifier(value, loc, annotations) {
    return { type: types_1.SyntaxType.Identifier, value, loc, annotations };
}
exports.createIdentifier = createIdentifier;
function createTextLocation(start, end) {
    return { start, end };
}
exports.createTextLocation = createTextLocation;
function createStringLiteral(value, loc) {
    return { type: types_1.SyntaxType.StringLiteral, value, loc };
}
exports.createStringLiteral = createStringLiteral;
function createMapFieldType(keyType, valueType, loc, annotations) {
    return {
        type: types_1.SyntaxType.MapType,
        keyType,
        valueType,
        loc,
        annotations,
    };
}
exports.createMapFieldType = createMapFieldType;
function createPropertyAssignment(name, initializer, loc) {
    return {
        type: types_1.SyntaxType.PropertyAssignment,
        name,
        initializer,
        loc,
    };
}
exports.createPropertyAssignment = createPropertyAssignment;
function createIntConstant(value, loc) {
    return { type: types_1.SyntaxType.IntConstant, value, loc };
}
exports.createIntConstant = createIntConstant;
function createDoubleConstant(value, loc) {
    return { type: types_1.SyntaxType.DoubleConstant, value, loc };
}
exports.createDoubleConstant = createDoubleConstant;
function createBooleanLiteral(value, loc) {
    return { type: types_1.SyntaxType.BooleanLiteral, value, loc };
}
exports.createBooleanLiteral = createBooleanLiteral;
function createIntegerLiteral(value, loc) {
    return { type: types_1.SyntaxType.IntegerLiteral, value, loc };
}
exports.createIntegerLiteral = createIntegerLiteral;
function createHexLiteral(value, loc) {
    return { type: types_1.SyntaxType.HexLiteral, value, loc };
}
exports.createHexLiteral = createHexLiteral;
function createFloatLiteral(value, loc) {
    return { type: types_1.SyntaxType.FloatLiteral, value, loc };
}
exports.createFloatLiteral = createFloatLiteral;
function createExponentialLiteral(value, loc) {
    return { type: types_1.SyntaxType.ExponentialLiteral, value, loc };
}
exports.createExponentialLiteral = createExponentialLiteral;
function createKeywordFieldType(type, loc, annotations) {
    return { type, loc, annotations };
}
exports.createKeywordFieldType = createKeywordFieldType;
function createConstMap(properties, loc) {
    return {
        type: types_1.SyntaxType.ConstMap,
        properties,
        loc,
    };
}
exports.createConstMap = createConstMap;
function createConstList(elements, loc) {
    return {
        type: types_1.SyntaxType.ConstList,
        elements,
        loc,
    };
}
exports.createConstList = createConstList;
//# sourceMappingURL=factory.js.map