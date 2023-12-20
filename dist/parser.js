"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParser = exports.createFieldId = exports.createParseError = void 0;
const debugger_1 = require("./debugger");
const factory_1 = require("./factory");
const types_1 = require("./types");
function isStatementBeginning(token) {
    switch (token.type) {
        case types_1.SyntaxType.NamespaceKeyword:
        case types_1.SyntaxType.IncludeKeyword:
        case types_1.SyntaxType.ConstKeyword:
        case types_1.SyntaxType.StructKeyword:
        case types_1.SyntaxType.UnionKeyword:
        case types_1.SyntaxType.ExceptionKeyword:
        case types_1.SyntaxType.ServiceKeyword:
        case types_1.SyntaxType.TypedefKeyword:
        case types_1.SyntaxType.EnumKeyword:
            return true;
        default:
            return false;
    }
}
function createParseError(message, loc) {
    return {
        type: types_1.ErrorType.ParseError,
        message,
        loc,
    };
}
exports.createParseError = createParseError;
function createFieldId(value, loc) {
    return {
        type: types_1.SyntaxType.FieldId,
        value,
        loc,
    };
}
exports.createFieldId = createFieldId;
class ParseError extends Error {
    constructor(msg, loc) {
        super(msg);
        this.message = msg;
        this.loc = loc;
    }
}
function createParser(tokens, report = debugger_1.noopReporter) {
    let comments = [];
    let currentIndex = 0;
    // PUBLIC
    function parse() {
        const thrift = {
            type: types_1.SyntaxType.ThriftDocument,
            body: [],
        };
        while (!isAtEnd()) {
            try {
                const statement = parseStatement();
                if (statement !== null) {
                    thrift.body.push(statement);
                }
            }
            catch (e) {
                report(createParseError(e.message, e.loc));
            }
        }
        return thrift;
    }
    function synchronize() {
        while (!isAtEnd() && !isStatementBeginning(currentToken())) {
            advance();
        }
    }
    function parseStatement() {
        const next = currentToken();
        switch (next.type) {
            /** 命名空间 */
            case types_1.SyntaxType.NamespaceKeyword:
                return parseNamespace();
            /** include关键字 */
            case types_1.SyntaxType.IncludeKeyword:
                return parseInclude();
            case types_1.SyntaxType.ConstKeyword:
                return parseConst();
            case types_1.SyntaxType.StructKeyword:
                return parseStruct();
            case types_1.SyntaxType.UnionKeyword:
                return parseUnion();
            case types_1.SyntaxType.ExceptionKeyword:
                return parseException();
            case types_1.SyntaxType.ServiceKeyword:
                return parseService();
            case types_1.SyntaxType.TypedefKeyword:
                return parseTypedef();
            case types_1.SyntaxType.EnumKeyword:
                return parseEnum();
            case types_1.SyntaxType.CommentBlock:
            case types_1.SyntaxType.CommentLine:
                consumeComments();
                return null;
            default:
                throw reportError(`Invalid start to Thrift statement ${next.text}`);
        }
    }
    function parseNamespace() {
        const _keywordToken = consume(types_1.SyntaxType.NamespaceKeyword);
        const keywordToken = requireValue(_keywordToken, `'namespace' keyword expected`);
        const _scopeToken = consume(types_1.SyntaxType.Identifier);
        const scopeToken = requireValue(_scopeToken, `Unable to find scope identifier for namespace`);
        const _nameToken = consume(types_1.SyntaxType.Identifier);
        const nameToken = requireValue(_nameToken, `Unable to find name identifier for namespace`);
        return {
            type: types_1.SyntaxType.NamespaceDefinition,
            scope: (0, factory_1.createIdentifier)(scopeToken.text, scopeToken.loc),
            name: (0, factory_1.createIdentifier)(nameToken.text, nameToken.loc),
            comments: getComments(),
            loc: (0, factory_1.createTextLocation)(keywordToken.loc.start, nameToken.loc.end),
        };
    }
    /** IncludeDefinition → 'include' StringLiteral */
    function parseInclude() {
        const _keywordToken = consume(types_1.SyntaxType.IncludeKeyword);
        const keywordToken = requireValue(_keywordToken, `included keyword expected`);
        const _pathToken = consume(types_1.SyntaxType.StringLiteral);
        const pathToken = requireValue(_pathToken, `Include statement must include a path as string literal`);
        return {
            type: types_1.SyntaxType.IncludeDefinition,
            path: (0, factory_1.createStringLiteral)(pathToken.text, pathToken.loc),
            comments: getComments(),
            loc: (0, factory_1.createTextLocation)(keywordToken.loc.start, pathToken.loc.end),
        };
    }
    /** ServiceDefinition → 'service' Identifier ( 'extends' Identifier )? '{' Function* '} Annotations?' */
    function parseService() {
        const leadingComments = getComments();
        const _keywordToken = consume(types_1.SyntaxType.ServiceKeyword);
        const keywordToken = requireValue(_keywordToken, `Unable to find service keyword for service`);
        const _nameToken = consume(types_1.SyntaxType.Identifier);
        const nameToken = requireValue(_nameToken, `Unable to find identifier for service`);
        const extendsId = parseExtends();
        const _openBrace = consume(types_1.SyntaxType.LeftBraceToken);
        const openBrace = requireValue(_openBrace, `Expected opening curly brace`);
        const functions = parseFunctions();
        const _closeBrace = consume(types_1.SyntaxType.RightBraceToken);
        const closeBrace = requireValue(_closeBrace, `Expected closing curly brace`);
        const annotations = parseAnnotations();
        const location = (0, factory_1.createTextLocation)(keywordToken.loc.start, closeBrace.loc.end);
        return {
            type: types_1.SyntaxType.ServiceDefinition,
            name: (0, factory_1.createIdentifier)(nameToken.text, nameToken.loc),
            extends: extendsId,
            functions,
            annotations,
            comments: leadingComments,
            loc: location,
        };
    }
    function parseExtends() {
        if (checkText("extends")) {
            const _keywordToken = consume(types_1.SyntaxType.ExtendsKeyword);
            const keywordToken = requireValue(_keywordToken, `'extends' keyword expected`);
            const _nameToken = consume(types_1.SyntaxType.Identifier);
            const nameToken = requireValue(_nameToken, `Identifier expected after 'extends' keyword`);
            return (0, factory_1.createIdentifier)(nameToken.text, (0, factory_1.createTextLocation)(keywordToken.loc.start, nameToken.loc.end));
        }
        else {
            return null;
        }
    }
    function parseFunctions() {
        const functions = [];
        while (!check(types_1.SyntaxType.RightBraceToken)) {
            if (check(types_1.SyntaxType.CommentBlock, types_1.SyntaxType.CommentLine)) {
                advance();
            }
            else {
                functions.push(parseFunction());
                if (isStatementBeginning(currentToken())) {
                    throw reportError(`Closing curly brace expected, but new statement found`);
                }
                else if (check(types_1.SyntaxType.EOF)) {
                    throw reportError(`Closing curly brace expected but reached end of file`);
                }
            }
        }
        return functions;
    }
    /** Function → 'oneway'? FunctionType Identifier '(' Field* ')' Throws? Annotations? ListSeparator? */
    function parseFunction() {
        const leadingComments = getComments();
        const onewayToken = consume(types_1.SyntaxType.OnewayKeyword);
        const returnType = parseFunctionType();
        const _nameToken = consume(types_1.SyntaxType.Identifier);
        const nameToken = requireValue(_nameToken, `Unable to find function identifier`);
        const params = parseParameterFields();
        const throws = parseThrows();
        const annotations = parseAnnotations();
        const listSeparator = readListSeparator();
        const endLoc = listSeparator !== null
            ? listSeparator.loc
            : throws !== null
                ? throws.loc
                : params.loc;
        return {
            type: types_1.SyntaxType.FunctionDefinition,
            name: (0, factory_1.createIdentifier)(nameToken.text, nameToken.loc),
            returnType,
            fields: params.fields,
            throws: throws !== null ? throws.fields : [],
            annotations,
            comments: leadingComments,
            oneway: onewayToken !== null,
            modifiers: onewayToken !== null ? [onewayToken] : [],
            loc: {
                start: returnType.loc.start,
                end: endLoc.end,
            },
        };
    }
    function parseParameterFields() {
        const fields = [];
        const _openParen = consume(types_1.SyntaxType.LeftParenToken);
        const openParen = requireValue(_openParen, `Opening paren expected to start list of fields`);
        while (!check(types_1.SyntaxType.RightParenToken)) {
            readListSeparator();
            fields.push(parseField());
            if (isStatementBeginning(currentToken())) {
                throw reportError(`Closing paren ')' expected, but new statement found`);
            }
            else if (check(types_1.SyntaxType.EOF)) {
                throw reportError(`Closing paren ')' expected but reached end of file`);
            }
        }
        const _closeParen = consume(types_1.SyntaxType.RightParenToken);
        const closeParen = requireValue(_closeParen, `Closing paren expected to end list of fields`);
        return {
            type: types_1.SyntaxType.ParametersDefinition,
            fields,
            loc: {
                start: openParen.loc.start,
                end: closeParen.loc.end,
            },
        };
    }
    /** Throws → 'throws' '(' Field* ')' */
    function parseThrows() {
        if (check(types_1.SyntaxType.ThrowsKeyword)) {
            const _keywordToken = consume(types_1.SyntaxType.ThrowsKeyword);
            const keywordToken = requireValue(_keywordToken, `'throws' keyword expected`);
            const params = parseParameterFields();
            return {
                type: types_1.SyntaxType.ThrowsDefinition,
                fields: params.fields,
                loc: {
                    start: keywordToken.loc.start,
                    end: params.loc.end,
                },
            };
        }
        return null;
    }
    function parseConst() {
        const leadingComments = getComments();
        const _keywordToken = consume(types_1.SyntaxType.ConstKeyword);
        const keywordToken = requireValue(_keywordToken, `'const' keyword expected`);
        const fieldType = parseFieldType();
        const _nameToken = consume(types_1.SyntaxType.Identifier);
        const nameToken = requireValue(_nameToken, `Const definition must have a name`);
        const _initializer = parseValueAssignment();
        const initializer = requireValue(_initializer, `Const must be initialized to a value`);
        const annotations = parseAnnotations();
        readListSeparator();
        return {
            type: types_1.SyntaxType.ConstDefinition,
            name: (0, factory_1.createIdentifier)(nameToken.text, nameToken.loc),
            fieldType,
            initializer,
            annotations,
            comments: leadingComments,
            loc: {
                start: keywordToken.loc.start,
                end: initializer.loc.end,
            },
        };
    }
    /** StructLike → ('struct' | 'union' | 'exception') Identifier 'xsd_all'? '{' Field* '} Annotations?' */
    function parseStructLikeInterface() {
        const leadingComments = getComments();
        const _keywordToken = consume(types_1.SyntaxType.StructKeyword, types_1.SyntaxType.UnionKeyword, types_1.SyntaxType.ExceptionKeyword);
        const keywordToken = requireValue(_keywordToken, `'struct | union | exception' expected`);
        const _nameToken = consume(types_1.SyntaxType.Identifier);
        const nameToken = requireValue(_nameToken, `Struct-like must have an identifier`);
        const openBrace = consume(types_1.SyntaxType.LeftBraceToken);
        requireValue(openBrace, `Struct-like body must begin with opening curly brace '{'`);
        const fields = parseFields();
        const _closeBrace = consume(types_1.SyntaxType.RightBraceToken);
        const closeBrace = requireValue(_closeBrace, `Struct-like body must end with a closing curly brace '}'`);
        const annotations = parseAnnotations();
        return {
            name: (0, factory_1.createIdentifier)(nameToken.text, nameToken.loc),
            fields,
            annotations,
            comments: leadingComments,
            loc: {
                start: keywordToken.loc.start,
                end: closeBrace.loc.end,
            },
        };
    }
    function parseStruct() {
        const parsedData = parseStructLikeInterface();
        return {
            type: types_1.SyntaxType.StructDefinition,
            name: parsedData.name,
            fields: parsedData.fields,
            annotations: parsedData.annotations,
            comments: parsedData.comments,
            loc: parsedData.loc,
        };
    }
    /** UnionDefinition → 'union' Identifier 'xsd_all'? '{' Field* '} Annotations?' */
    function parseUnion() {
        const parsedData = parseStructLikeInterface();
        return {
            type: types_1.SyntaxType.UnionDefinition,
            name: parsedData.name,
            fields: parsedData.fields.map((next) => {
                next.requiredness = "optional";
                return next;
            }),
            annotations: parsedData.annotations,
            comments: parsedData.comments,
            loc: parsedData.loc,
        };
    }
    /** ExceptionDefinition → 'exception' Identifier '{' Field* '} Annotations?' */
    function parseException() {
        const parsedData = parseStructLikeInterface();
        return {
            type: types_1.SyntaxType.ExceptionDefinition,
            name: parsedData.name,
            fields: parsedData.fields,
            annotations: parsedData.annotations,
            comments: parsedData.comments,
            loc: parsedData.loc,
        };
    }
    /** ConstValue → Literal | ConstMap | ConstList */
    function parseValue() {
        const next = advance();
        switch (next.type) {
            case types_1.SyntaxType.Identifier:
                return (0, factory_1.createIdentifier)(next.text, next.loc);
            case types_1.SyntaxType.StringLiteral:
                return (0, factory_1.createStringLiteral)(next.text, next.loc);
            case types_1.SyntaxType.IntegerLiteral:
            case types_1.SyntaxType.HexLiteral:
                return parseIntValue(next);
            case types_1.SyntaxType.FloatLiteral:
            case types_1.SyntaxType.ExponentialLiteral:
                return parseDoubleValue(next);
            case types_1.SyntaxType.TrueKeyword:
                return (0, factory_1.createBooleanLiteral)(true, next.loc);
            case types_1.SyntaxType.FalseKeyword:
                return (0, factory_1.createBooleanLiteral)(false, next.loc);
            case types_1.SyntaxType.LeftBraceToken:
                return parseMapValue();
            case types_1.SyntaxType.LeftBracketToken:
                return parseListValue();
            default:
                return null;
        }
    }
    function parseValueAssignment() {
        if (check(types_1.SyntaxType.EqualToken)) {
            advance();
            return parseValue();
        }
        return null;
    }
    function parseFields() {
        const fields = [];
        while (!check(types_1.SyntaxType.RightBraceToken)) {
            if (check(types_1.SyntaxType.CommentBlock, types_1.SyntaxType.CommentLine)) {
                advance();
            }
            else {
                fields.push(parseField());
                if (isStatementBeginning(currentToken())) {
                    throw reportError(`Closing curly brace expected, but new statement found`);
                }
                else if (check(types_1.SyntaxType.EOF)) {
                    throw reportError(`Closing curly brace expected but reached end of file`);
                }
            }
        }
        return fields;
    }
    /** Field → FieldID? FieldReq? FieldType Identifier ('= ConstValue)? XsdFieldOptions Annotations? ListSeparator? */
    function parseField() {
        const startLoc = currentToken().loc;
        const fieldId = parseFieldId();
        const fieldRequired = parserequiredValuedness();
        const fieldType = parseFieldType();
        const _nameToken = consume(types_1.SyntaxType.Identifier);
        const nameToken = requireValue(_nameToken, `Unable to find identifier for field`);
        const defaultValue = parseValueAssignment();
        const annotations = parseAnnotations();
        const listSeparator = readListSeparator();
        const endLoc = listSeparator !== null
            ? listSeparator.loc
            : defaultValue !== null
                ? defaultValue.loc
                : nameToken.loc;
        const location = (0, factory_1.createTextLocation)(startLoc.start, endLoc.end);
        return {
            type: types_1.SyntaxType.FieldDefinition,
            name: (0, factory_1.createIdentifier)(nameToken.text, nameToken.loc),
            fieldId,
            fieldType,
            requiredness: fieldRequired,
            defaultValue,
            comments: getComments(),
            annotations,
            loc: location,
        };
    }
    /** FieldRequired → 'required' | 'optional' */
    function parserequiredValuedness() {
        const current = currentToken();
        if (current.text === "required" || current.text === "optional") {
            advance();
            return current.text;
        }
        return null;
    }
    /** FieldId → IntConstant ':' */
    function parseFieldId() {
        if (currentToken().type === types_1.SyntaxType.IntegerLiteral &&
            peek().type === types_1.SyntaxType.ColonToken) {
            const fieldIdToken = consume(types_1.SyntaxType.IntegerLiteral);
            const colonToken = consume(types_1.SyntaxType.ColonToken);
            return createFieldId(parseInt(fieldIdToken.text, 10), (0, factory_1.createTextLocation)(fieldIdToken.loc.start, colonToken.loc.end));
        }
        else {
            return null;
        }
    }
    /** ListSeparator → ',' | ';' */
    function readListSeparator() {
        if (check(types_1.SyntaxType.CommaToken, types_1.SyntaxType.SemicolonToken)) {
            return advance();
        }
        return null;
    }
    /** Annotation → Identifier ('=' StringLiteral)? ListSeparator? */
    function parseAnnotation() {
        const nameToken = requireValue(consume(types_1.SyntaxType.Identifier), `Annotation must have a name`);
        let valueToken;
        if (check(types_1.SyntaxType.EqualToken)) {
            advance();
            valueToken = requireValue(consume(types_1.SyntaxType.StringLiteral), `Annotation must have a value`);
        }
        readListSeparator();
        return {
            type: types_1.SyntaxType.Annotation,
            name: (0, factory_1.createIdentifier)(nameToken.text, nameToken.loc),
            value: valueToken
                ? (0, factory_1.createStringLiteral)(valueToken.text, valueToken.loc)
                : undefined,
            loc: (0, factory_1.createTextLocation)(nameToken.loc.start, (valueToken || nameToken).loc.end),
        };
    }
    function parseAnnotations() {
        if (check(types_1.SyntaxType.LeftParenToken)) {
            const annotations = [];
            const startToken = advance();
            while (!check(types_1.SyntaxType.RightParenToken)) {
                annotations.push(parseAnnotation());
            }
            const endToken = advance();
            return {
                annotations,
                type: types_1.SyntaxType.Annotations,
                loc: (0, factory_1.createTextLocation)(startToken.loc.start, endToken.loc.end),
            };
        }
        return undefined;
    }
    /** TypedefDefinition → 'typedef' 字段类型标识符 */
    function parseTypedef() {
        const _keywordToken = consume(types_1.SyntaxType.TypedefKeyword);
        const keywordToken = requireValue(_keywordToken, `'typedef' keyword expected`);
        const type = parseFieldType();
        const _nameToken = consume(types_1.SyntaxType.Identifier);
        const nameToken = requireValue(_nameToken, `Typedef is expected to have name and none found`);
        const leadingComments = getComments();
        const annotations = parseAnnotations();
        return {
            type: types_1.SyntaxType.TypedefDefinition,
            name: (0, factory_1.createIdentifier)(nameToken.text, nameToken.loc),
            definitionType: type,
            annotations,
            comments: leadingComments,
            loc: {
                start: keywordToken.loc.start,
                end: nameToken.loc.end,
            },
        };
    }
    /** EnumDefinition → 'enum' Identifier '{' EnumMember* '}' Annotations? */
    function parseEnum() {
        const leadingComments = getComments();
        const _keywordToken = consume(types_1.SyntaxType.EnumKeyword);
        const keywordToken = requireValue(_keywordToken, `'enum' keyword expected`);
        const _nameToken = consume(types_1.SyntaxType.Identifier);
        const nameToken = requireValue(_nameToken, `Expected identifier for enum definition`);
        const openBrace = consume(types_1.SyntaxType.LeftBraceToken);
        requireValue(openBrace, `Expected opening brace`);
        const members = parseEnumMembers();
        const _closeBrace = consume(types_1.SyntaxType.RightBraceToken);
        const closeBrace = requireValue(_closeBrace, `Expected closing brace`);
        const annotations = parseAnnotations();
        const loc = {
            start: keywordToken.loc.start,
            end: closeBrace.loc.end,
        };
        return {
            type: types_1.SyntaxType.EnumDefinition,
            name: (0, factory_1.createIdentifier)(nameToken.text, nameToken.loc),
            members,
            annotations,
            comments: leadingComments,
            loc,
        };
        function parseEnumMembers() {
            const members = [];
            while (!check(types_1.SyntaxType.RightBraceToken)) {
                if (check(types_1.SyntaxType.CommentBlock, types_1.SyntaxType.CommentLine)) {
                    advance();
                }
                else {
                    members.push(parseEnumMember());
                    readListSeparator();
                    if (isStatementBeginning(currentToken())) {
                        throw reportError(`Closing curly brace expected, but new statement found`);
                    }
                    else if (check(types_1.SyntaxType.EOF)) {
                        throw reportError(`Closing curly brace expected but reached end of file`);
                    }
                }
            }
            return members;
        }
    }
    /** EnumMember → (Identifier ('=' IntConstant)? Annotations? ListSeparator?)* */
    function parseEnumMember() {
        const _nameToken = consume(types_1.SyntaxType.Identifier);
        const nameToken = requireValue(_nameToken, `EnumMember must have identifier`);
        let loc = null;
        let initializer = null;
        if (consume(types_1.SyntaxType.EqualToken) !== null) {
            const _numToken = consume(types_1.SyntaxType.IntegerLiteral, types_1.SyntaxType.HexLiteral);
            const numToken = requireValue(_numToken, `Equals token "=" must be followed by an Integer`);
            initializer = parseIntValue(numToken);
            loc = (0, factory_1.createTextLocation)(nameToken.loc.start, initializer.loc.end);
        }
        else {
            loc = (0, factory_1.createTextLocation)(nameToken.loc.start, nameToken.loc.end);
        }
        const annotations = parseAnnotations();
        return {
            type: types_1.SyntaxType.EnumMember,
            name: (0, factory_1.createIdentifier)(nameToken.text, nameToken.loc),
            initializer,
            annotations,
            comments: getComments(),
            loc,
        };
    }
    function parseFieldType() {
        const typeToken = advance();
        switch (typeToken.type) {
            case types_1.SyntaxType.Identifier:
                return (0, factory_1.createIdentifier)(typeToken.text, typeToken.loc, parseAnnotations());
            case types_1.SyntaxType.MapKeyword:
                return parseMapType();
            case types_1.SyntaxType.ListKeyword:
                return parseListType();
            case types_1.SyntaxType.SetKeyword:
                return parseSetType();
            case types_1.SyntaxType.BinaryKeyword:
            case types_1.SyntaxType.BoolKeyword:
            case types_1.SyntaxType.ByteKeyword:
            case types_1.SyntaxType.StringKeyword:
            case types_1.SyntaxType.I8Keyword:
            case types_1.SyntaxType.I16Keyword:
            case types_1.SyntaxType.I32Keyword:
            case types_1.SyntaxType.I64Keyword:
            case types_1.SyntaxType.DoubleKeyword:
                return (0, factory_1.createKeywordFieldType)(typeToken.type, typeToken.loc, parseAnnotations());
            default:
                throw reportError(`FieldType expected but found: ${typeToken.type}`);
        }
    }
    /** MapType → 'map' CppType? '<' FieldType ',' FieldType '> */
    function parseMapType() {
        const _openBracket = consume(types_1.SyntaxType.LessThanToken);
        const openBracket = requireValue(_openBracket, `Map needs to defined contained types`);
        const keyType = parseFieldType();
        const _commaToken = consume(types_1.SyntaxType.CommaToken);
        const commaToken = requireValue(_commaToken, `Comma expected to separate map types <key, value>`);
        const valueType = parseFieldType();
        const _closeBracket = consume(types_1.SyntaxType.GreaterThanToken);
        const closeBracket = requireValue(_closeBracket, `Map needs to defined contained types`);
        const location = {
            start: openBracket.loc.start,
            end: closeBracket.loc.end,
        };
        return (0, factory_1.createMapFieldType)(keyType, valueType, location, parseAnnotations());
    }
    /** SetType → 'set' CppType? '<' FieldType '>' */
    function parseSetType() {
        const _openBracket = consume(types_1.SyntaxType.LessThanToken);
        const openBracket = requireValue(_openBracket, `Map needs to defined contained types`);
        const valueType = parseFieldType();
        const _closeBracket = consume(types_1.SyntaxType.GreaterThanToken);
        const closeBracket = requireValue(_closeBracket, `Map needs to defined contained types`);
        return {
            type: types_1.SyntaxType.SetType,
            valueType,
            loc: {
                start: openBracket.loc.start,
                end: closeBracket.loc.end,
            },
            annotations: parseAnnotations(),
        };
    }
    /** ListType → 'list' '<' FieldType '>' CppType? */
    function parseListType() {
        const _openBracket = consume(types_1.SyntaxType.LessThanToken);
        const openBracket = requireValue(_openBracket, `Map needs to defined contained types`);
        const valueType = parseFieldType();
        const _closeBracket = consume(types_1.SyntaxType.GreaterThanToken);
        const closeBracket = requireValue(_closeBracket, `Map needs to defined contained types`);
        return {
            type: types_1.SyntaxType.ListType,
            valueType,
            loc: {
                start: openBracket.loc.start,
                end: closeBracket.loc.end,
            },
            annotations: parseAnnotations(),
        };
    }
    /** 解析整数类型 */
    function parseIntValue(token) {
        switch (token.type) {
            case types_1.SyntaxType.IntegerLiteral:
                return (0, factory_1.createIntConstant)((0, factory_1.createIntegerLiteral)(token.text, token.loc), token.loc);
            case types_1.SyntaxType.HexLiteral:
                return (0, factory_1.createIntConstant)((0, factory_1.createHexLiteral)(token.text, token.loc), token.loc);
            default:
                throw reportError(`IntConstant expected but found: ${token.type}`);
        }
    }
    function parseDoubleValue(token) {
        switch (token.type) {
            case types_1.SyntaxType.FloatLiteral:
                return (0, factory_1.createDoubleConstant)((0, factory_1.createFloatLiteral)(token.text, token.loc), token.loc);
            case types_1.SyntaxType.ExponentialLiteral:
                return (0, factory_1.createDoubleConstant)((0, factory_1.createExponentialLiteral)(token.text, token.loc), token.loc);
            default:
                throw reportError(`DoubleConstant expected but found: ${token.type}`);
        }
    }
    /** ConstList → '[' (ConstValue ListSeparator?)* ']' */
    function parseListValue() {
        const startLoc = currentToken().loc;
        const elements = check(types_1.SyntaxType.RightBracketToken)
            ? []
            : readListValues();
        const _closeBrace = consume(types_1.SyntaxType.RightBracketToken);
        const closeBrace = requireValue(_closeBrace, `Closing square-bracket missing from list definition`);
        const endLoc = closeBrace.loc;
        return (0, factory_1.createConstList)(elements, {
            start: startLoc.start,
            end: endLoc.end,
        });
    }
    /** FunctionType → Identifier | BaseType | ContainerType */
    function parseFunctionType() {
        const typeToken = consume(types_1.SyntaxType.VoidKeyword);
        if (typeToken !== null) {
            return {
                type: types_1.SyntaxType.VoidKeyword,
                loc: typeToken.loc,
            };
        }
        else {
            return parseFieldType();
        }
    }
    /** ConstMap → '{' (ConstValue ':' ConstValue ListSeparator?)* '}' */
    function parseMapValue() {
        const startLoc = currentToken().loc;
        const properties = check(types_1.SyntaxType.RightBraceToken)
            ? []
            : readMapValues();
        const _closeBrace = consume(types_1.SyntaxType.RightBraceToken);
        const closeBrace = requireValue(_closeBrace, `Closing brace missing from map definition`);
        const endLoc = closeBrace.loc;
        const location = {
            start: startLoc.start,
            end: endLoc.end,
        };
        return (0, factory_1.createConstMap)(properties, location);
    }
    function readMapValues() {
        const properties = [];
        while (true) {
            const _key = parseValue();
            const key = requireValue(_key, `Key expected for map value`);
            const semicolon = consume(types_1.SyntaxType.ColonToken);
            requireValue(semicolon, `Semicolon expected after key in map property assignment`);
            const _value = parseValue();
            const value = requireValue(_value, "");
            properties.push((0, factory_1.createPropertyAssignment)(key, value, {
                start: key.loc.start,
                end: value.loc.end,
            }));
            if (check(types_1.SyntaxType.CommaToken)) {
                advance();
                if (check(types_1.SyntaxType.RightBraceToken)) {
                    break;
                }
            }
            else {
                break;
            }
        }
        return properties;
    }
    function readListValues() {
        const elements = [];
        while (true) {
            const value = parseValue();
            if (value !== null) {
                elements.push(value);
            }
            if (check(types_1.SyntaxType.CommaToken, types_1.SyntaxType.SemicolonToken)) {
                advance();
                if (check(types_1.SyntaxType.RightBracketToken)) {
                    break;
                }
            }
            else {
                break;
            }
        }
        return elements;
    }
    function peek() {
        return tokens[currentIndex + 1];
    }
    function check(...types) {
        for (const type of types) {
            if (type === currentToken().type) {
                return true;
            }
        }
        return false;
    }
    function checkText(...strs) {
        for (const str of strs) {
            if (str === currentToken().text) {
                return true;
            }
        }
        return false;
    }
    function consume(...types) {
        for (const type of types) {
            if (check(type)) {
                return advance();
            }
        }
        return null;
    }
    function consumeComments() {
        while (true) {
            const next = tokens[currentIndex];
            switch (next.type) {
                case types_1.SyntaxType.CommentBlock:
                    comments.push({
                        type: next.type,
                        value: next.text.split("\n"),
                        loc: next.loc,
                    });
                    currentIndex++;
                    break;
                case types_1.SyntaxType.CommentLine:
                    comments.push({
                        type: next.type,
                        value: next.text,
                        loc: next.loc,
                    });
                    currentIndex++;
                    break;
                default:
                    return;
            }
        }
    }
    function currentToken() {
        consumeComments();
        return tokens[currentIndex];
    }
    function previousToken() {
        return tokens[currentIndex - 1];
    }
    function advance() {
        if (!isAtEnd()) {
            currentIndex += 1;
        }
        return previousToken();
    }
    /** 判断是否没东西了 */
    function isAtEnd() {
        return (currentIndex >= tokens.length || currentToken().type === types_1.SyntaxType.EOF);
    }
    function getComments() {
        const current = comments;
        comments = [];
        return current;
    }
    function reportError(msg) {
        return new ParseError(msg, previousToken().loc);
    }
    function requireValue(val, msg) {
        if (val === null || val === undefined) {
            throw reportError(msg);
        }
        else {
            return val;
        }
    }
    return {
        parse,
        synchronize,
    };
}
exports.createParser = createParser;
//# sourceMappingURL=parser.js.map