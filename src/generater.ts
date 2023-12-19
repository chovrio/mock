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

export const generate = (ast: ThriftDocument, res_names: string[]) => {
  ast.body.some((definition) => {
    if (definition.type !== "IncludeDefinition") {
      definition_map.set(definition.name.value, definition);
    }
  });
  res_names.some((name) => {
    const definition = definition_map.get(name);
    switch (definition?.type) {
      case SyntaxType.StructDefinition:
        res_map.set(definition.name.value, generate_definition_obj(name));
      default:
        break;
    }
  });
  return res_map;
};
