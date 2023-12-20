import {
  IncludeDefinition,
  NamespaceDefinition,
  SyntaxType,
  ThriftDocument,
  ThriftStatement,
} from "./types";
import {
  generate_by_type,
  generate_definition_obj,
  generate_double_num,
  generate_num,
} from "./utils";

export const definition_map = new Map<
  string,
  Exclude<ThriftStatement, IncludeDefinition>
>();
const res_map = new Map<string, any>();
const func_map = new Map<string, string>();
export const generate = (ast: ThriftDocument, res_names: string[]) => {
  ast.body.some((definition) => {
    if (definition.type !== SyntaxType.IncludeDefinition) {
      definition_map.set(definition.name.value, definition);
    }
    if (definition.type === SyntaxType.ServiceDefinition) {
      definition.functions.some((func) => {
        if (func.returnType.type === SyntaxType.Identifier) {
          func_map.set(func.name.value, func.returnType.value);
        }
      });
    }
  });
  res_names.some((name) => {
    const func_name = name;
    name = func_map.get(name) || "";
    const definition = definition_map.get(name);
    switch (definition?.type) {
      case SyntaxType.StructDefinition:
        res_map.set(func_name, generate_definition_obj(name));
      default:
        break;
    }
  });
  return res_map;
};
