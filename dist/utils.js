"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate_cn = exports.generate_en = exports.generate_string = exports.generate_definition_obj = exports.generate_list = exports.generate_basic = exports.generate_by_type = exports.generate_double_num = exports.generate_num = exports.randomNum = void 0;
const generater_1 = require("./generater");
const types_1 = require("./types");
const randomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
exports.randomNum = randomNum;
const generate_num = (type) => {
    switch (type) {
        case types_1.SyntaxType.I8Keyword:
        // return randomNum(0, 255);
        case types_1.SyntaxType.I16Keyword:
        // return randomNum(0, 65535);
        case types_1.SyntaxType.I32Keyword:
        // return randomNum(0, 4294967295);
        case types_1.SyntaxType.I64Keyword:
        // return randomNum(0, Math.pow(2, 53));
        default:
            return (0, exports.randomNum)(0, 65535);
    }
};
exports.generate_num = generate_num;
const generate_double_num = () => Number((Math.random() * 100).toFixed(2));
exports.generate_double_num = generate_double_num;
const generate_by_type = (type) => {
    switch (type.type) {
        case types_1.SyntaxType.ListType:
            return (0, exports.generate_list)(type);
        case types_1.SyntaxType.Identifier:
            return (0, exports.generate_definition_obj)(type.value);
        default:
            return (0, exports.generate_basic)(type.type);
    }
};
exports.generate_by_type = generate_by_type;
const generate_basic = (type) => {
    switch (type) {
        case types_1.SyntaxType.StringKeyword:
            return (0, exports.generate_string)(2, 8);
        case types_1.SyntaxType.I8Keyword:
        case types_1.SyntaxType.I16Keyword:
        case types_1.SyntaxType.I32Keyword:
        case types_1.SyntaxType.I64Keyword:
            return (0, exports.generate_num)(types_1.SyntaxType.I64Keyword);
        case types_1.SyntaxType.DoubleKeyword:
            return (0, exports.generate_double_num)();
        default:
            return undefined;
    }
};
exports.generate_basic = generate_basic;
const generate_list = (type) => {
    const result = [];
    switch (type.valueType.type) {
        case types_1.SyntaxType.Identifier:
            for (let i = 0; i < 10; i++) {
                result[i] = (0, exports.generate_definition_obj)(type.valueType.value);
            }
            break;
        default:
            for (let i = 0; i < 10; i++) {
                result[i] = (0, exports.generate_basic)(type.valueType.type);
            }
            break;
    }
    return result;
};
exports.generate_list = generate_list;
const generate_definition_obj = (name) => {
    if (!generater_1.definition_map.has(name)) {
        return {};
    }
    const definition = generater_1.definition_map.get(name);
    const result_obj = {};
    switch (definition === null || definition === void 0 ? void 0 : definition.type) {
        case types_1.SyntaxType.StructDefinition:
            definition.fields.some((field) => {
                result_obj[field.name.value] = (0, exports.generate_by_type)(field.fieldType);
            });
            break;
        case types_1.SyntaxType.EnumDefinition:
            return definition.members[(0, exports.randomNum)(0, definition.members.length - 1)]
                .name.value;
        default:
            break;
    }
    return result_obj;
};
exports.generate_definition_obj = generate_definition_obj;
const generate_string = (min, max) => {
    const random = Math.random();
    if (random > 0.5)
        return (0, exports.generate_en)(min, max);
    else
        return (0, exports.generate_cn)(min, max);
};
exports.generate_string = generate_string;
const generate_en = (min, max) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = (0, exports.randomNum)(min, max);
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
exports.generate_en = generate_en;
const generate_cn = (min, max) => {
    let result = "";
    let len = (0, exports.randomNum)(min, max);
    for (let i = 0; i < len; i++) {
        result += String.fromCharCode(Math.floor(Math.random() * (0x9fa5 - 0x4e00) + 0x4e00));
    }
    return result;
};
exports.generate_cn = generate_cn;
//# sourceMappingURL=utils.js.map