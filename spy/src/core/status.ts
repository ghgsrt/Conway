import createMap from './map';
import { GameObject, GameObjectType } from './objects';

export type StatusName =
	| 'Wet'
	| 'Dry' // fire spreads without heat loss for dry objects
	| 'Electrified'
	| 'Conductive'
	| 'Insulator'
	| 'Powered'
	| 'Powerable'
	| 'Ignited'
	| 'Flammable'
	| 'Stuck'
	| 'Meltable'
	| 'Soluble';

export type Status = <T extends GameObject<GameObjectType>>(
	obj: T,
	map: ReturnType<typeof createMap>
) => () => void;

export const Statuses: Partial<Record<StatusName, Status>> = {
	// Wet: (obj, map) => {
	// 	const remFlammable = obj.removeStatus('Flammable');
	// 	obj.applyStatus('Conductive');
	// },
	Electrified: (obj, map) => {
		map.applyToAdjacentCells(obj.coords, (_obj) =>
			_obj.applyStatus('Electrified')
		);

		return () => {
			map.applyToAdjacentCells(obj.coords, (_obj) =>
				_obj.removeStatus('Electrified')
			);
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
