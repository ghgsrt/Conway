const directions = [
	[1, 0],
	[-1, 0],
	[0, 1],
	[0, -1],
	[1, 1],
	[1, -1],
	[-1, 1],
	[-1, -1],
];

const createMap = (yDim, xDim) => {
	let map;
	let adjacentCells = [];

	const getAdjacentCells = (x, y) => {
		let _x, _y;
		for (const dir of directions) {
			_x = x + dir[0];
			_y = y + dir[1];
			if (_x < 0 || _x >= xDim || _y < 0 || _y >= yDim) continue;
			((adjacentCells[x] ??= [])[y] ??= []).push([_x, _y]);
		}
	};

	const populate = (cond = 1) => {
		map = [];
		adjacentCells = [];
		for (let x = 0; x < xDim; x++) {
			map.push([]);
			for (let y = 0; y < yDim; y++) {
				getAdjacentCells(x, y);
				map[x].push(Math.random() > cond);
			}
		}
	};

	const getLiveNeighbours = (x, y) => {
		let liveNeighbours = 0;
		for (const cell of adjacentCells[x][y]) {
			if (map[cell[0]][cell[1]]) liveNeighbours++;
		}

		return liveNeighbours;
	};

	const conwayStep = (x, y) => {
		const liveNeighbours = getLiveNeighbours(x, y);

		return liveNeighbours === 3 || (map[x][y] && liveNeighbours === 2);
	};

	const conwayStepAll = (callback) => {
		const nextMap = [];
		for (let x = 0; x < xDim; x++) {
			nextMap.push([]);
			for (let y = 0; y < yDim; y++) {
				nextMap[x][y] = conwayStep(x, y);

				callback(x, y, nextMap[x][y], map[x][y]);
			}
		}

		map = nextMap;
	};

	return {
		populate,
		conwayStep,
		conwayStepAll,
	};
};

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let computed, map, data, xDim, yDim;
const init = () => {
	computed = window.getComputedStyle(canvas);
	canvas.setAttribute('width', computed.width);
	canvas.setAttribute('height', computed.height);

	xDim = parseInt(computed.width);
	yDim = parseInt(computed.height);

	map = createMap(xDim, yDim);
	map.populate(0.8);

	data = ctx.getImageData(0, 0, xDim, yDim);
};
window.addEventListener('resize', init);
init();

let flag = false;
window.addEventListener('click', () => {
	if (!flag) requestAnimationFrame(render);
	flag = !flag;
});
window.addEventListener('contextmenu', () => {
	render();
});

let offset;
const render = () => {
	map.conwayStepAll((x, y, cellIsAlive, cellWasAlive) => {
		offset = (x * xDim + y) * 4;
		// stay alive -> black
		// become alive -> green
		// become dead -> red
		// stay dead -> white
		data.data[offset] = !(!cellIsAlive || cellWasAlive) ? 255 : 0; // R
		data.data[offset + 1] = !(cellIsAlive || !cellWasAlive) ? 255 : 0; // G
		data.data[offset + 3] = cellIsAlive || cellWasAlive ? 255 : 0; // A
	});

	ctx.putImageData(data, 0, 0);

	if (flag) requestAnimationFrame(render);
};

// const getAdjacentCells = (coords) => {
// 	let adjacent = 0;
// 	let x, y;
// 	for (const dir of directions) {
// 		x = coords.x + dir.x;
// 		y = coords.y + dir.y;
// 		if (x < 0 || x >= dims || y < 0 || y >= dims) continue;
// 		if (map[x][y]) adjacent++;
// 	}

// 	return adjacent;
// };
// requestAnimationFrame(render);

// data.data = nextMap
// 	.reduce(concat)
// 	.map((cell) => (cell ? [255, 255, 255, 1] : [0, 0, 0, 1]))
// 	.reduce(concat);

// }

// export type Coord = {
// 	x: number;
// 	y: number;
// };

// type Directions = Array<Coord>;

// const directions: Directions = [
// 	{ x: 1, y: 0 },
// 	{ x: -1, y: 0 },
// 	{ x: 0, y: 1 },
// 	{ x: 0, y: -1 },
// 	{ x: 1, y: 1 },
// 	{ x: 1, y: -1 },
// 	{ x: -1, y: 1 },
// 	{ x: -1, y: -1 },
// ];

// const createMap = () => {
// 	const map: Array<Array<boolean>> = [];

// 	const getAdjacentCells = (coords: Coord, dir?: Directions) => {
// 		const adjacent: Array<boolean> = [];

// 		for (const _dir of dir ?? directions) {
// 			adjacent.push(map[coords.x + _dir.x][coords.y + _dir.y]);
// 		}

// 		return adjacent;
// 	};

// 	const conwayStep = (coords: Coord) => {
// 		let liveNeighbours = 0;
// 		for (const cell of getAdjacentCells(coords)) {
// 			if (cell) liveNeighbours++;
// 		}

// 		if (map[coords.x][coords.y]) {
// 			if (liveNeighbours === 2 || liveNeighbours === 3) return true;
// 			else return false;
// 		} else if (liveNeighbours === 3) return true;
// 		else return false;
// 	};

// 	return {
// 		map,
// 		getAdjacentCells,
// 		conwayStep,
// 	};
// };

// const concat = (xs: Array<any>, xy: Array<any>) => xs.concat(xy);

// const map = createMap();
// const nextMap: Array<Array<boolean>> | Array<number> = [];

// const canvas = document.querySelector('canvas')!;
// const ctx = canvas.getContext('2d')!;

// while (true) {
// 	for (let x = 0; x < map.map.length; x++) {
// 		for (let y = 0; y < map.map[x].length; y++) {
// 			nextMap[x][y] = map.conwayStep({ x, y });
// 		}
// 	}

// 	map.map = nextMap as Array<Array<boolean>>;

// 	(nextMap as Array<Array<boolean>>)
// 		.reduce(concat)
// 		.map((cell) => (cell ? [255, 255, 255, 1] : [0, 0, 0, 1]))
// 		.reduce(concat);

// 	ctx.putImageData(
// 		new ImageData(Uint8ClampedArray.from(nextMap as Array<number>), 2, 2),
// 		0,
// 		0
// 	);
// }
