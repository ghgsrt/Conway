export var Statuses = {
    // Wet: (obj, map) => {
    // 	const remFlammable = obj.removeStatus('Flammable');
    // 	obj.applyStatus('Conductive');
    // },
    Electrified: function (obj, map) {
        map.applyToAdjacentCells(obj.coords, function (_obj) {
            return _obj.applyStatus('Electrified');
        });
        return function () {
            map.applyToAdjacentCells(obj.coords, function (_obj) {
                return _obj.removeStatus('Electrified');
            });
        };
    },
    // Conductive: {},
    // Insulator: {},
    // Powered: {},
    // Powerable: {},
    // Ignited: {},
    // Flammable: {},
    // Stuck: {},
    // Meltable: {},
    // Soluble: {},
};
//# sourceMappingURL=status.js.map