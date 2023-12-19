import {
  Annotations,
  BaseType,
  BooleanLiteral,
  ConstList,
  ConstMap,
  ConstValue,
  DoubleConstant,
  ExponentLiteral,
  FieldType,
  FloatLiteral,
  HexLiteral,
  Identifier,
  IntConstant,
  IntegerLiteral,
  KeywordType,
  MapType,
  PropertyAssignment,
  StringLiteral,
  SyntaxType,
  TextPosition,
  Token,
} from "./types";
import { ErrorType, ScanError, TextLocation } from "./types";

/** 创建一个扫描错误的对象 */
export function createScanError(message: string, loc: TextLocation): ScanError {
  return {
    type: ErrorType.ScanError,
    message,
    loc,
  };
}

/** 创建一个Token类型对象 */
export function createToken(
  type: SyntaxType,
  text: string,
  loc: TextLocation
): Token {
  return { type, text, loc };
}

export function createIdentifier(
  value: string,
  loc: TextLocation,
  annotations?: Annotations
): Identifier {
  return { type: SyntaxType.Identifier, value, loc, annotations };
}

export function createTextLocation(
  start: TextPosition,
  end: TextPosition
): TextLocation {
  return { start, end };
}

export function createStringLiteral(
  value: string,
  loc: TextLocation
): StringLiteral {
  return { type: SyntaxType.StringLiteral, value, loc };
}

export function createMapFieldType(
  keyType: FieldType,
  valueType: FieldType,
  loc: TextLocation,
  annotations?: Annotations
): MapType {
  return {
    type: SyntaxType.MapType,
    keyType,
    valueType,
    loc,
    annotations,
  };
}

export function createPropertyAssignment(
  name: ConstValue,
  initializer: ConstValue,
  loc: TextLocation
): PropertyAssignment {
  return {
    type: SyntaxType.PropertyAssignment,
    name,
    initializer,
    loc,
  };
}

export function createIntConstant(
  value: IntegerLiteral | HexLiteral,
  loc: TextLocation
): IntConstant {
  return { type: SyntaxType.IntConstant, value, loc };
}

export function createDoubleConstant(
  value: FloatLiteral | ExponentLiteral,
  loc: TextLocation
): DoubleConstant {
  return { type: SyntaxType.DoubleConstant, value, loc };
}

export function createBooleanLiteral(
  value: boolean,
  loc: TextLocation
): BooleanLiteral {
  return { type: SyntaxType.BooleanLiteral, value, loc };
}

export function createIntegerLiteral(
  value: string,
  loc: TextLocation
): IntegerLiteral {
  return { type: SyntaxType.IntegerLiteral, value, loc };
}

export function createHexLiteral(value: string, loc: TextLocation): HexLiteral {
  return { type: SyntaxType.HexLiteral, value, loc };
}

export function createFloatLiteral(
  value: string,
  loc: TextLocation
): FloatLiteral {
  return { type: SyntaxType.FloatLiteral, value, loc };
}

export function createExponentialLiteral(
  value: string,
  loc: TextLocation
): ExponentLiteral {
  return { type: SyntaxType.ExponentialLiteral, value, loc };
}

export function createKeywordFieldType(
  type: KeywordType,
  loc: TextLocation,
  annotations?: Annotations
): BaseType {
  return { type, loc, annotations };
}

export function createConstMap(
  properties: Array<PropertyAssignment>,
  loc: TextLocation
): ConstMap {
  return {
    type: SyntaxType.ConstMap,
    properties,
    loc,
  };
}

export function createConstList(
  elements: Array<ConstValue>,
  loc: TextLocation
): ConstList {
  return {
    type: SyntaxType.ConstList,
    elements,
    loc,
  };
}
