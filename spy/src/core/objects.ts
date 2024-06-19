import { Subset } from '../types/utils';
import { deepMerge, deepCopy } from '../utils';
import createMap, { Coord } from './map';
import { Status, StatusName, Statuses } from './status';

export type Material = 'Fabric' | 'Metal' | 'Wood' | 'Rubber' | 'Ceramic';

const baseMaterialStatuses: Record<Material, StatusName[]> = {
	Fabric: ['Dry', 'Flammable'],
	Metal: ['Conductive', 'Meltable'],
	Wood: ['Flammable', 'Insulator'],
	Rubber: ['Insulator', 'Meltable'],
	Ceramic: ['Insulator'],
};

type TypeSpecProps = {
	fire: {
		foo: number;
	};
	water: {
		bar: boolean;
	};
	smoke: {};
};
export type GameObjectType = keyof TypeSpecProps;

export type GameObject<T extends GameObjectType> = {
    coords: Coord;
	primary: number;
	material: Material;
	statuses: Record<
		StatusName,
		{ onRemove: ReturnType<Status>; quantity: number }
	>;
	suppressionPercs: Partial<Record<Exclude<GameObjectType, T>, number>>;
	applyStatus(name: StatusName): boolean;
	removeStatus(name: StatusName): boolean;
	is(name: StatusName): boolean;
} & TypeSpecProps[T];

type DefaultObject<T extends GameObjectType> = Partial<
	Omit<GameObject<T>, keyof typeof sharedFns>
>;

const sharedFns = {
	applyStatus: function (name) {
		switch (name) {
			case 'Conductive':
				if (!this.is('Insulator')) return false;
				break;
			case 'Dry':
				break;
			case 'Electrified':
				if (!this.is('Conductive')) return false;
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

		(this.status[name] ??= { onRemove: Statuses[name]?.(this, createMap([])), quantity: 0 })
			.quantity++;

		return true;
	},
	removeStatus: function (name) {
		if (!this.statuses[name]) return false;

		if (--this.statuses[name].quantity === 0) {
			this.statuses[name].onRemove?.();
			return true;
		}

		return false;
	},
	is: function (name) {
		return (
			baseMaterialStatuses[this.material].includes(name) || this.statuses[name]
		);
	},
} satisfies Partial<GameObject<GameObjectType>>;

const defaultObjects = {
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
} as const satisfies { [key in GameObjectType]: DefaultObject<key> };

type ReqProps<T extends GameObjectType> = Omit<
	GameObject<T>,
	keyof (typeof defaultObjects)[T] | keyof typeof sharedFns
> &
	Subset<
		Pick<GameObject<T>, Exclude<keyof DefaultObject<T>, keyof typeof sharedFns>>
	>;

const create = <T, D>(defaultProps?: D) => {
	const fns: Record<string, any> = {};

	for (const key in defaultProps)
		if (typeof defaultProps[key] === 'function') fns[key] = defaultProps[key];

	return (props: Omit<T, keyof D | keyof typeof sharedFns>) =>
		({
			...deepMerge(deepCopy(defaultProps ?? {}), props),
			...fns,
			...sharedFns,
		} as T);
};

const factory: {
	[key in GameObjectType]: ReturnType<
		typeof create<GameObject<key>, (typeof defaultObjects)[key]>
	>;
} = {
	water: create(defaultObjects['water']),
	fire: create(defaultObjects['fire']),
	smoke: create(defaultObjects['smoke']),
};

const createGameObject = <T extends GameObjectType>(
	type: T,
	props: ReqProps<T>
): GameObject<T> => factory[type](props);

// const test = createGameObject('fire', {});

export default createGameObject;
