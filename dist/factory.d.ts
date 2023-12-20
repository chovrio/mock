import { Annotations, BaseType, BooleanLiteral, ConstList, ConstMap, ConstValue, DoubleConstant, ExponentLiteral, FieldType, FloatLiteral, HexLiteral, Identifier, IntConstant, IntegerLiteral, KeywordType, MapType, PropertyAssignment, StringLiteral, SyntaxType, TextPosition, Token } from "./types";
import { ScanError, TextLocation } from "./types";
/** 创建一个扫描错误的对象 */
export declare function createScanError(message: string, loc: TextLocation): ScanError;
/** 创建一个Token类型对象 */
export declare function createToken(type: SyntaxType, text: string, loc: TextLocation): Token;
export declare function createIdentifier(value: string, loc: TextLocation, annotations?: Annotations): Identifier;
export declare function createTextLocation(start: TextPosition, end: TextPosition): TextLocation;
export declare function createStringLiteral(value: string, loc: TextLocation): StringLiteral;
export declare function createMapFieldType(keyType: FieldType, valueType: FieldType, loc: TextLocation, annotations?: Annotations): MapType;
export declare function createPropertyAssignment(name: ConstValue, initializer: ConstValue, loc: TextLocation): PropertyAssignment;
export declare function createIntConstant(value: IntegerLiteral | HexLiteral, loc: TextLocation): IntConstant;
export declare function createDoubleConstant(value: FloatLiteral | ExponentLiteral, loc: TextLocation): DoubleConstant;
export declare function createBooleanLiteral(value: boolean, loc: TextLocation): BooleanLiteral;
export declare function createIntegerLiteral(value: string, loc: TextLocation): IntegerLiteral;
export declare function createHexLiteral(value: string, loc: TextLocation): HexLiteral;
export declare function createFloatLiteral(value: string, loc: TextLocation): FloatLiteral;
export declare function createExponentialLiteral(value: string, loc: TextLocation): ExponentLiteral;
export declare function createKeywordFieldType(type: KeywordType, loc: TextLocation, annotations?: Annotations): BaseType;
export declare function createConstMap(properties: Array<PropertyAssignment>, loc: TextLocation): ConstMap;
export declare function createConstList(elements: Array<ConstValue>, loc: TextLocation): ConstList;
