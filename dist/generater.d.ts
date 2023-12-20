import { NamespaceDefinition, ThriftDocument } from "./types";
export declare const definition_map: Map<string, NamespaceDefinition | import("./types").ConstDefinition | import("./types").StructDefinition | import("./types").UnionDefinition | import("./types").ExceptionDefinition | import("./types").ServiceDefinition | import("./types").TypedefDefinition | import("./types").EnumDefinition>;
export declare const generate: (ast: ThriftDocument, res_names: string[]) => Map<string, any>;
