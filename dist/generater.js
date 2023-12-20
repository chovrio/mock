"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = exports.definition_map = void 0;
const types_1 = require("./types");
const utils_1 = require("./utils");
exports.definition_map = new Map();
const res_map = new Map();
const generate = (ast, res_names) => {
    ast.body.some((definition) => {
        if (definition.type !== "IncludeDefinition") {
            exports.definition_map.set(definition.name.value, definition);
        }
    });
    res_names.some((name) => {
        const definition = exports.definition_map.get(name);
        switch (definition === null || definition === void 0 ? void 0 : definition.type) {
            case types_1.SyntaxType.StructDefinition:
                res_map.set(definition.name.value, (0, utils_1.generate_definition_obj)(name));
            default:
                break;
        }
    });
    return res_map;
};
exports.generate = generate;
//# sourceMappingURL=generater.js.map