"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyntaxType = exports.ErrorType = void 0;
var ErrorType;
(function (ErrorType) {
    ErrorType["ParseError"] = "ParseError";
    ErrorType["ScanError"] = "ScanError";
})(ErrorType || (exports.ErrorType = ErrorType = {}));
/** 语法类型 */
var SyntaxType;
(function (SyntaxType) {
    SyntaxType["ThriftDocument"] = "ThriftDocument";
    SyntaxType["ThriftErrors"] = "ThriftErrors";
    SyntaxType["Identifier"] = "Identifier";
    SyntaxType["FieldId"] = "FieldId";
    /** Statements 声明(块) */
    SyntaxType["NamespaceDefinition"] = "NamespaceDefinition";
    SyntaxType["IncludeDefinition"] = "IncludeDefinition";
    SyntaxType["CppIncludeDefinition"] = "CppIncludeDefinition";
    SyntaxType["ConstDefinition"] = "ConstDefinition";
    SyntaxType["StructDefinition"] = "StructDefinition";
    SyntaxType["EnumDefinition"] = "EnumDefinition";
    SyntaxType["ServiceDefinition"] = "ServiceDefinition";
    SyntaxType["ExceptionDefinition"] = "ExceptionDefinition";
    SyntaxType["TypedefDefinition"] = "TypedefDefinition";
    SyntaxType["UnionDefinition"] = "UnionDefinition";
    /** Fields 声明(字段) */
    SyntaxType["FieldDefinition"] = "FieldDefinition";
    SyntaxType["FunctionDefinition"] = "FunctionDefinition";
    SyntaxType["ParametersDefinition"] = "ParametersDefinition";
    SyntaxType["ThrowsDefinition"] = "ThrowsDefinition";
    /** Type Annotations 类型注释 */
    SyntaxType["FieldType"] = "FieldType";
    SyntaxType["BaseType"] = "BaseType";
    SyntaxType["SetType"] = "SetType";
    SyntaxType["MapType"] = "MapType";
    SyntaxType["ListType"] = "ListType";
    /** Values 定义的值的类型 */
    SyntaxType["ConstValue"] = "ConstValue";
    SyntaxType["IntConstant"] = "IntConstant";
    SyntaxType["DoubleConstant"] = "DoubleConstant";
    SyntaxType["ConstList"] = "ConstList";
    SyntaxType["ConstMap"] = "ConstMap";
    SyntaxType["EnumMember"] = "EnumMember";
    /** Literals 字面量相关 */
    SyntaxType["CommentLine"] = "CommentLine";
    SyntaxType["CommentBlock"] = "CommentBlock";
    SyntaxType["StringLiteral"] = "StringLiteral";
    SyntaxType["IntegerLiteral"] = "IntegerLiteral";
    SyntaxType["FloatLiteral"] = "FloatLiteral";
    SyntaxType["HexLiteral"] = "HexLiteral";
    SyntaxType["ExponentialLiteral"] = "ExponentialLiteral";
    SyntaxType["BooleanLiteral"] = "BooleanLiteral";
    SyntaxType["PropertyAssignment"] = "PropertyAssignment";
    /** Tokens '特殊'字符 */
    SyntaxType["LeftParenToken"] = "LeftParenToken";
    SyntaxType["RightParenToken"] = "RightParenToken";
    SyntaxType["LeftBraceToken"] = "LeftBraceToken";
    SyntaxType["RightBraceToken"] = "RightBraceToken";
    SyntaxType["LeftBracketToken"] = "LeftBracketToken";
    SyntaxType["RightBracketToken"] = "RightBracketToken";
    SyntaxType["CommaToken"] = "CommaToken";
    SyntaxType["DotToken"] = "DotToken";
    SyntaxType["MinusToken"] = "MinusToken";
    SyntaxType["SemicolonToken"] = "SemicolonToken";
    SyntaxType["ColonToken"] = "ColonToken";
    SyntaxType["StarToken"] = "StarToken";
    SyntaxType["EqualToken"] = "EqualToken";
    SyntaxType["LessThanToken"] = "LessThanToken";
    SyntaxType["GreaterThanToken"] = "GreaterThanToken";
    /** Keywords 关键字 */
    SyntaxType["NamespaceKeyword"] = "NamespaceKeyword";
    SyntaxType["IncludeKeyword"] = "IncludeKeyword";
    SyntaxType["CppIncludeKeyword"] = "CppIncludeKeyword";
    SyntaxType["ExceptionKeyword"] = "ExceptionKeyword";
    SyntaxType["ServiceKeyword"] = "ServiceKeyword";
    SyntaxType["ExtendsKeyword"] = "ExtendsKeyword";
    SyntaxType["RequiredKeyword"] = "RequiredKeyword";
    SyntaxType["OptionalKeyword"] = "OptionalKeyword";
    SyntaxType["FalseKeyword"] = "FalseKeyword";
    SyntaxType["TrueKeyword"] = "TrueKeyword";
    SyntaxType["ConstKeyword"] = "ConstKeyword";
    SyntaxType["DoubleKeyword"] = "DoubleKeyword";
    SyntaxType["StructKeyword"] = "StructKeyword";
    SyntaxType["TypedefKeyword"] = "TypedefKeyword";
    SyntaxType["UnionKeyword"] = "UnionKeyword";
    SyntaxType["StringKeyword"] = "StringKeyword";
    SyntaxType["BinaryKeyword"] = "BinaryKeyword";
    SyntaxType["BoolKeyword"] = "BoolKeyword";
    SyntaxType["ByteKeyword"] = "ByteKeyword";
    SyntaxType["EnumKeyword"] = "EnumKeyword";
    SyntaxType["SenumKeyword"] = "SenumKeyword";
    SyntaxType["ListKeyword"] = "ListKeyword";
    SyntaxType["SetKeyword"] = "SetKeyword";
    SyntaxType["MapKeyword"] = "MapKeyword";
    SyntaxType["I8Keyword"] = "I8Keyword";
    SyntaxType["I16Keyword"] = "I16Keyword";
    SyntaxType["I32Keyword"] = "I32Keyword";
    SyntaxType["I64Keyword"] = "I64Keyword";
    SyntaxType["ThrowsKeyword"] = "ThrowsKeyword";
    SyntaxType["VoidKeyword"] = "VoidKeyword";
    SyntaxType["OnewayKeyword"] = "OnewayKeyword";
    /** Other 其他 */
    SyntaxType["Annotation"] = "Annotation";
    SyntaxType["Annotations"] = "Annotations";
    SyntaxType["EOF"] = "EOF";
})(SyntaxType || (exports.SyntaxType = SyntaxType = {}));
//# sourceMappingURL=types.js.map