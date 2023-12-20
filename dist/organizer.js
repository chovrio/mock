"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organize = void 0;
const types_1 = require("./types");
function organize(raw) {
    const namespaces = [];
    const includes = [];
    const constants = [];
    const enums = [];
    const typedefs = [];
    const structs = [];
    const unions = [];
    const exceptions = [];
    const services = [];
    for (const next of raw.body) {
        switch (next.type) {
            case types_1.SyntaxType.NamespaceDefinition:
                namespaces.push(next);
                break;
            case types_1.SyntaxType.IncludeDefinition:
                includes.push(next);
                break;
            case types_1.SyntaxType.ConstDefinition:
                constants.push(next);
                break;
            case types_1.SyntaxType.EnumDefinition:
                enums.push(next);
                break;
            case types_1.SyntaxType.StructDefinition:
                structs.push(next);
                break;
            case types_1.SyntaxType.UnionDefinition:
                unions.push(next);
                break;
            case types_1.SyntaxType.ExceptionDefinition:
                exceptions.push(next);
                break;
            case types_1.SyntaxType.TypedefDefinition:
                typedefs.push(next);
                break;
            case types_1.SyntaxType.ServiceDefinition:
                services.push(next);
                break;
            default:
                const msg = next;
                throw new Error(`Unexpected statement type found: ${msg}`);
        }
    }
    return {
        type: types_1.SyntaxType.ThriftDocument,
        body: [
            ...namespaces,
            ...includes,
            ...enums,
            ...typedefs,
            ...constants,
            ...structs,
            ...unions,
            ...exceptions,
            ...services,
        ],
        tokens: raw.tokens,
    };
}
exports.organize = organize;
//# sourceMappingURL=organizer.js.map