var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { deepMerge, deepCopy } from '../utils';
import createMap from './map';
import { Statuses } from './status';
var baseMaterialStatuses = {
    Fabric: ['Dry', 'Flammable'],
    Metal: ['Conductive', 'Meltable'],
    Wood: ['Flammable', 'Insulator'],
    Rubber: ['Insulator', 'Meltable'],
    Ceramic: ['Insulator'],
};
var sharedFns = {
    applyStatus: function (name) {
        var _a, _b;
        var _c;
        switch (name) {
            case 'Conductive':
                if (!this.is('Insulator'))
                    return false;
                break;
            case 'Dry':
                break;
            case 'Electrified':
                if (!this.is('Conductive'))
                    return false;
                break;
            case 'Flammable':
                break;
            case 'Ignited':
                break;
            case 'Insulator':
                break;
            case 'Meltable':
                break;
            case 'Powerable':
                break;
            case 'Powered':
                break;
            case 'Soluble':
                break;
            case 'Stuck':
                break;
            case 'Wet':
                break;
        }
        ((_a = (_c = this.status)[name]) !== null && _a !== void 0 ? _a : (_c[name] = { onRemove: (_b = Statuses[name]) === null || _b === void 0 ? void 0 : _b.call(Statuses, this, createMap([])), quantity: 0 }))
            .quantity++;
        return true;
    },
    removeStatus: function (name) {
        var _a, _b;
        if (!this.statuses[name])
            return false;
        if (--this.statuses[name].quantity === 0) {
            (_b = (_a = this.statuses[name]).onRemove) === null || _b === void 0 ? void 0 : _b.call(_a);
            return true;
        }
        return false;
    },
    is: function (name) {
        return (baseMaterialStatuses[this.material].includes(name) || this.statuses[name]);
    },
};
var defaultObjects = {
    fire: {
        primary: 1,
        suppressionPercs: {
            water: 1,
            // 'fire': 2,
        },
    },
    water: {
        primary: 2,
    },
    smoke: {
        primary: 1,
    },
};
var create = function (defaultProps) {
    var fns = {};
    for (var key in defaultProps)
        if (typeof defaultProps[key] === 'function')
            fns[key] = defaultProps[key];
    return function (props) {
        return (__assign(__assign(__assign({}, deepMerge(deepCopy(defaultProps !== null && defaultProps !== void 0 ? defaultProps : {}), props)), fns), sharedFns));
    };
};
var factory = {
    water: create(defaultObjects['water']),
    fire: create(defaultObjects['fire']),
    smoke: create(defaultObjects['smoke']),
};
var createGameObject = function (type, props) { return factory[type](props); };
// const test = createGameObject('fire', {});
export default createGameObject;
//# sourceMappingURL=objects.js.map