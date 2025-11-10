"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCached = getCached;
exports.setCached = setCached;
// temporary no-cache version (for testing without Redis)
async function getCached(_key) {
    return null;
}
async function setCached(_key, _value) {
    return;
}
