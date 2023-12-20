import { definition_map } from "./generater";
import { FieldType, FunctionType, ListType, SyntaxType } from "./types";

export const randomNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const generate_num = (type: SyntaxType) => {
  switch (type) {
    case SyntaxType.I8Keyword:
    // return randomNum(0, 255);
    case SyntaxType.I16Keyword:
    // return randomNum(0, 65535);
    case SyntaxType.I32Keyword:
    // return randomNum(0, 4294967295);
    case SyntaxType.I64Keyword:
    // return randomNum(0, Math.pow(2, 53));
    default:
      return randomNum(0, 65535);
  }
};

export const generate_double_num = () =>
  Number((Math.random() * 100).toFixed(2));

export const generate_by_type = (type: FunctionType) => {
  switch (type.type) {
    case SyntaxType.ListType:
      return generate_list(type);
    case SyntaxType.Identifier:
      return generate_definition_obj(type.value);
    default:
      return generate_basic(type.type);
  }
};

export const generate_basic = (type: SyntaxType) => {
  switch (type) {
    case SyntaxType.StringKeyword:
      return generate_string(2, 8);
    case SyntaxType.I8Keyword:
    case SyntaxType.I16Keyword:
    case SyntaxType.I32Keyword:
    case SyntaxType.I64Keyword:
      return generate_num(SyntaxType.I64Keyword);
    case SyntaxType.DoubleKeyword:
      return generate_double_num();
    default:
      return undefined;
  }
};

export const generate_list = (type: ListType) => {
  const result = [];
  switch (type.valueType.type) {
    case SyntaxType.Identifier:
      for (let i = 0; i < 10; i++) {
        result[i] = generate_definition_obj(type.valueType.value);
      }
      break;
    default:
      for (let i = 0; i < 10; i++) {
        result[i] = generate_basic(type.valueType.type);
      }
      break;
  }
  return result;
};

export const generate_definition_obj = (name: string) => {
  if (!definition_map.has(name)) {
    return {};
  }
  const definition = definition_map.get(name);
  const result_obj: any = {};
  switch (definition?.type) {
    case SyntaxType.StructDefinition:
      definition.fields.some((field) => {
        result_obj[field.name.value] = generate_by_type(field.fieldType);
      });
      break;
    case SyntaxType.EnumDefinition:
      return definition.members[randomNum(0, definition.members.length - 1)]
        .name.value;
    default:
      break;
  }
  return result_obj;
};

export const generate_string = (min: number, max: number) => {
  const random = Math.random();
  if (random > 0.5) return generate_en(min, max);
  else return generate_cn(min, max);
};

export const generate_en = (min: number, max: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = randomNum(min, max);
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const generate_cn = (min: number, max: number) => {
  let result = "";
  let len = randomNum(min, max);
  for (let i = 0; i < len; i++) {
    result += String.fromCharCode(
      Math.floor(Math.random() * (0x9fa5 - 0x4e00) + 0x4e00)
    );
  }
  return result;
};
