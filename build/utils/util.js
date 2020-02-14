"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResponeseData = function (data, errMsg) {
    if (errMsg) {
        return {
            success: false,
            errMsg: errMsg,
            data: data
        };
    }
    return {
        success: true,
        data: data
    };
};
