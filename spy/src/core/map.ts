import { GameObject, GameObjectType } from './objects';

export type Coord = {
	x: number;
	y: number;
};

// const directions = {
// 	'+x': 1,
// 	'-x': 1,
// 	'+y': 1,
// 	'-y': 1,
// 	'+x,+y': 1,
// 	'+x,-y': 1,
// 	'-x,+y': 1,
// 	'-x,-y': 1,
// };

// type Directions = Partial<{
// 	[key in keyof typeof directions]: number;
// }>;

type Directions = Coord[];

const directions: Directions = [
	{ x: 1, y: 0 },
	{ x: -1, y: 0 },
	{ x: 0, y: 1 },
	{ x: 0, y: -1 },
	{ x: 1, y: 1 },
	{ x: 1, y: -1 },
	{ x: -1, y: 1 },
	{ x: -1, y: -1 },
];

const createMap = (map: GameObject<GameObjectType>[][][]) => {
	const getAdjacentCells = (coords: Coord, dir?: Directions) => {
		const adjacent: GameObject<GameObjectType>[][] = [];

		for (const _dir of dir ?? directions) {
			adjacent.push(map[coords.x + _dir.x][coords.y + _dir.y]);
		}

		return adjacent;
	};

	const applyToAdjacentCells = (
		coords: Coord,
		fn: (obj: GameObject<GameObjectType>) => void,
		dir?: Directions
	) => {
		for (const cell of getAdjacentCells(coords, dir)) {
			for (const obj of cell) fn(obj);
		}
	};

	return {
		map,
		getAdjacentCells,
		applyToAdjacentCells,
	};
};

export default createMap;
