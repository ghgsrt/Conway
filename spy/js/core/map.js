var directions = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
];
var createMap = function (map) {
    var getAdjacentCells = function (coords, dir) {
        var adjacent = [];
        for (var _i = 0, _a = dir !== null && dir !== void 0 ? dir : directions; _i < _a.length; _i++) {
            var _dir = _a[_i];
            adjacent.push(map[coords.x + _dir.x][coords.y + _dir.y]);
        }
        return adjacent;
    };
    var applyToAdjacentCells = function (coords, fn, dir) {
        for (var _i = 0, _a = getAdjacentCells(coords, dir); _i < _a.length; _i++) {
            var cell = _a[_i];
            for (var _b = 0, cell_1 = cell; _b < cell_1.length; _b++) {
                var obj = cell_1[_b];
                fn(obj);
            }
        }
    };
    return {
        map: map,
        getAdjacentCells: getAdjacentCells,
        applyToAdjacentCells: applyToAdjacentCells,
    };
};
export default createMap;
//# sourceMappingURL=map.js.map