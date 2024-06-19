export var deepCopy = function (obj) {
    return JSON.parse(JSON.stringify(obj));
};
export var deepMerge = function (target, source) {
    for (var key in target) {
        if (source[key] === undefined)
            continue;
        if (source[key] instanceof Object)
            target[key] = deepMerge(target[key], source[key]);
        else
            target[key] = source[key];
    }
    return target;
};
//# sourceMappingURL=utils.js.map