export interface ThriftError {
  type: ErrorType; // 错误类型
  message: string; // 错误信息
  loc: TextLocation; // 错误位置
}

export interface ParseError extends ThriftError {
  type: ErrorType.ParseError;
}

export interface ScanError extends ThriftError {
  type: ErrorType.ScanError;
}

export interface StructLike {
  name: Identifier;
  fields: Array<FieldDefinition>;
  annotations?: Annotations;
  comments: Array<Comment>;
  loc: TextLocation;
}

export interface TextLocation {
  start: TextPosition;
  end: TextPosition;
}

export interface TextPosition {
  line: number; // 行
  column: number; // 列
  index: number; // 位
}

export enum ErrorType {
  ParseError = "ParseError", // 解析错误
  ScanError = "ScanError", // 扫描错误
}

export interface Node {
  type: SyntaxType;
}

export interface SyntaxNode extends Node {
  loc: TextLocation;
}

export interface Token extends SyntaxNode {
  text: string;
}

export interface ThriftDocument extends Node {
  type: SyntaxType.ThriftDocument;
  body: Array<ThriftStatement>;
  tokens?: Array<Token>;
}

export interface ThriftErrors {
  type: SyntaxType.ThriftErrors;
  errors: Array<ThriftError>;
}

export type ThriftStatement =
  | NamespaceDefinition
  | IncludeDefinition
  | ConstDefinition
  | StructDefinition
  | UnionDefinition
  | ExceptionDefinition
  | ServiceDefinition
  | TypedefDefinition
  | EnumDefinition;

export type Comment = CommentLine | CommentBlock;

export interface CommentLine extends SyntaxNode {
  type: SyntaxType.CommentLine;
  value: string;
}

export interface CommentBlock extends SyntaxNode {
  type: SyntaxType.CommentBlock;
  value: Array<string>;
}

export interface Annotation extends SyntaxNode {
  name: Identifier;
  value?: StringLiteral;
}

export interface Annotations extends SyntaxNode {
  annotations: Array<Annotation>;
}

export interface PrimarySyntax extends SyntaxNode {
  comments: Array<Comment>;
}

export type FieldType = BaseType | ContainerType | Identifier;

export interface NamespaceDefinition extends PrimarySyntax {
  type: SyntaxType.NamespaceDefinition;
  scope: Identifier;
  name: Identifier;
}

export interface IncludeDefinition extends PrimarySyntax {
  type: SyntaxType.IncludeDefinition;
  path: StringLiteral;
}

export interface ConstDefinition extends PrimarySyntax {
  type: SyntaxType.ConstDefinition;
  name: Identifier;
  fieldType: FieldType;
  initializer: ConstValue;
  annotations?: Annotations;
}

export interface EnumDefinition extends PrimarySyntax {
  type: SyntaxType.EnumDefinition;
  name: Identifier;
  members: Array<EnumMember>;
  annotations?: Annotations;
}

export interface EnumMember extends PrimarySyntax {
  type: SyntaxType.EnumMember;
  name: Identifier;
  initializer: IntConstant | null;
  annotations?: Annotations;
}

export interface TypedefDefinition extends PrimarySyntax {
  type: SyntaxType.TypedefDefinition;
  name: Identifier;
  definitionType: FieldType;
  annotations?: Annotations;
}

export interface ServiceDefinition extends PrimarySyntax {
  type: SyntaxType.ServiceDefinition;
  name: Identifier;
  extends: Identifier | null;
  functions: Array<FunctionDefinition>;
  annotations?: Annotations;
}

export interface FunctionDefinition extends PrimarySyntax {
  type: SyntaxType.FunctionDefinition;
  name: Identifier;
  oneway: boolean;
  returnType: FunctionType;
  fields: Array<FieldDefinition>;
  throws: Array<FieldDefinition>;
  modifiers: Array<Token>;
  annotations?: Annotations;
}

export interface ParametersDefinition extends SyntaxNode {
  type: SyntaxType.ParametersDefinition;
  fields: Array<FieldDefinition>;
}

export interface ThrowsDefinition extends SyntaxNode {
  type: SyntaxType.ThrowsDefinition;
  fields: Array<FieldDefinition>;
}

export interface InterfaceWithFields extends PrimarySyntax {
  name: Identifier;
  fields: Array<FieldDefinition>;
  annotations?: Annotations;
}

export interface StructDefinition extends InterfaceWithFields {
  type: SyntaxType.StructDefinition;
}

export interface UnionDefinition extends InterfaceWithFields {
  type: SyntaxType.UnionDefinition;
}

export interface ExceptionDefinition extends InterfaceWithFields {
  type: SyntaxType.ExceptionDefinition;
}

export interface FieldDefinition extends PrimarySyntax {
  type: SyntaxType.FieldDefinition;
  name: Identifier;
  fieldId: FieldId | null;
  fieldType: FunctionType;
  requiredness: FieldRequired | null;
  defaultValue: ConstValue | null;
  annotations?: Annotations;
}
export interface FieldId extends SyntaxNode {
  type: SyntaxType.FieldId;
  value: number;
}

export type FunctionType = FieldType | VoidType;

export type FieldRequired = "required" | "optional";

export type KeywordType =
  | SyntaxType.StringKeyword
  | SyntaxType.DoubleKeyword
  | SyntaxType.BoolKeyword
  | SyntaxType.I8Keyword
  | SyntaxType.I16Keyword
  | SyntaxType.I32Keyword
  | SyntaxType.I64Keyword
  | SyntaxType.BinaryKeyword
  | SyntaxType.ByteKeyword;

export interface VoidType extends SyntaxNode {
  type: SyntaxType.VoidKeyword;
}

export type ContainerType = SetType | MapType | ListType;

export interface BaseType extends SyntaxNode {
  type: KeywordType;
  annotations?: Annotations;
}

export interface SetType extends SyntaxNode {
  type: SyntaxType.SetType;
  valueType: FieldType;
  annotations?: Annotations;
}

export interface MapType extends SyntaxNode {
  type: SyntaxType.MapType;
  keyType: FieldType;
  valueType: FieldType;
  annotations?: Annotations;
}

export interface ListType extends SyntaxNode {
  type: SyntaxType.ListType;
  valueType: FieldType;
  annotations?: Annotations;
}

export interface Identifier extends SyntaxNode {
  type: SyntaxType.Identifier;
  value: string;
  annotations?: Annotations;
}

export type ConstValue =
  | StringLiteral
  | IntConstant
  | DoubleConstant
  | BooleanLiteral
  | ConstMap
  | ConstList
  | Identifier;

export interface StringLiteral extends SyntaxNode {
  type: SyntaxType.StringLiteral;
  value: string;
}
export interface BooleanLiteral extends SyntaxNode {
  type: SyntaxType.BooleanLiteral;
  value: boolean;
}

export interface IntegerLiteral extends SyntaxNode {
  type: SyntaxType.IntegerLiteral;
  value: string;
}

export interface HexLiteral extends SyntaxNode {
  type: SyntaxType.HexLiteral;
  value: string;
}

export interface FloatLiteral extends SyntaxNode {
  type: SyntaxType.FloatLiteral;
  value: string;
}

export interface ExponentLiteral extends SyntaxNode {
  type: SyntaxType.ExponentialLiteral;
  value: string;
}

export interface IntConstant extends SyntaxNode {
  type: SyntaxType.IntConstant;
  value: IntegerLiteral | HexLiteral;
}

export interface DoubleConstant extends SyntaxNode {
  type: SyntaxType.DoubleConstant;
  value: FloatLiteral | ExponentLiteral;
}

export interface ConstMap extends SyntaxNode {
  type: SyntaxType.ConstMap;
  properties: Array<PropertyAssignment>;
}

export interface ConstList extends SyntaxNode {
  type: SyntaxType.ConstList;
  elements: Array<ConstValue>;
}

export interface PropertyAssignment extends SyntaxNode {
  type: SyntaxType.PropertyAssignment;
  name: ConstValue;
  initializer: ConstValue;
}

/** 语法类型 */
export enum SyntaxType {
  ThriftDocument = "ThriftDocument",
  ThriftErrors = "ThriftErrors",

  Identifier = "Identifier",
  FieldId = "FieldId",

  /** Statements 声明(块) */
  NamespaceDefinition = "NamespaceDefinition",
  IncludeDefinition = "IncludeDefinition",
  CppIncludeDefinition = "CppIncludeDefinition",
  ConstDefinition = "ConstDefinition",
  StructDefinition = "StructDefinition",
  EnumDefinition = "EnumDefinition",
  ServiceDefinition = "ServiceDefinition",
  ExceptionDefinition = "ExceptionDefinition",
  TypedefDefinition = "TypedefDefinition",
  UnionDefinition = "UnionDefinition",

  /** Fields 声明(字段) */
  FieldDefinition = "FieldDefinition",
  FunctionDefinition = "FunctionDefinition",
  ParametersDefinition = "ParametersDefinition",
  ThrowsDefinition = "ThrowsDefinition",

  /** Type Annotations 类型注释 */
  FieldType = "FieldType",
  BaseType = "BaseType",
  SetType = "SetType",
  MapType = "MapType",
  ListType = "ListType",

  /** Values 定义的值的类型 */
  ConstValue = "ConstValue",
  IntConstant = "IntConstant",
  DoubleConstant = "DoubleConstant",

  ConstList = "ConstList",
  ConstMap = "ConstMap",
  EnumMember = "EnumMember",

  /** Literals 字面量相关 */
  CommentLine = "CommentLine", // 普通注释
  CommentBlock = "CommentBlock", // 代码块注释
  StringLiteral = "StringLiteral", // 字符串字面量
  IntegerLiteral = "IntegerLiteral", // 整数字面量
  FloatLiteral = "FloatLiteral", // 浮点数字面量
  HexLiteral = "HexLiteral", // 十六进制字面量
  ExponentialLiteral = "ExponentialLiteral", // 科学计数法字面量
  BooleanLiteral = "BooleanLiteral", // 布尔值字面量
  PropertyAssignment = "PropertyAssignment", // 属性赋值操作 如:obj.key = 'value

  /** Tokens '特殊'字符 */
  LeftParenToken = "LeftParenToken", // (
  RightParenToken = "RightParenToken", // )
  LeftBraceToken = "LeftBraceToken", // {
  RightBraceToken = "RightBraceToken", // }
  LeftBracketToken = "LeftBracketToken", // [
  RightBracketToken = "RightBracketToken", // ]
  CommaToken = "CommaToken", // ,
  DotToken = "DotToken", // .
  MinusToken = "MinusToken", // -
  SemicolonToken = "SemicolonToken", // ;
  ColonToken = "ColonToken", // :
  StarToken = "StarToken", // *
  EqualToken = "EqualToken", // =
  LessThanToken = "LessThanToken", // <
  GreaterThanToken = "GreaterThanToken", // >

  /** Keywords 关键字 */
  NamespaceKeyword = "NamespaceKeyword",
  IncludeKeyword = "IncludeKeyword",
  CppIncludeKeyword = "CppIncludeKeyword",
  ExceptionKeyword = "ExceptionKeyword",
  ServiceKeyword = "ServiceKeyword",
  ExtendsKeyword = "ExtendsKeyword",
  RequiredKeyword = "RequiredKeyword",
  OptionalKeyword = "OptionalKeyword",
  FalseKeyword = "FalseKeyword",
  TrueKeyword = "TrueKeyword",
  ConstKeyword = "ConstKeyword",
  DoubleKeyword = "DoubleKeyword",
  StructKeyword = "StructKeyword",
  TypedefKeyword = "TypedefKeyword",
  UnionKeyword = "UnionKeyword",
  StringKeyword = "StringKeyword",
  BinaryKeyword = "BinaryKeyword",
  BoolKeyword = "BoolKeyword",
  ByteKeyword = "ByteKeyword",
  EnumKeyword = "EnumKeyword",
  SenumKeyword = "SenumKeyword",
  ListKeyword = "ListKeyword",
  SetKeyword = "SetKeyword",
  MapKeyword = "MapKeyword",
  I8Keyword = "I8Keyword",
  I16Keyword = "I16Keyword",
  I32Keyword = "I32Keyword",
  I64Keyword = "I64Keyword",
  ThrowsKeyword = "ThrowsKeyword",
  VoidKeyword = "VoidKeyword",
  OnewayKeyword = "OnewayKeyword",

  /** Other 其他 */
  Annotation = "Annotation", // 注解
  Annotations = "Annotations", // 多个注解

  EOF = "EOF", // 结尾
}
