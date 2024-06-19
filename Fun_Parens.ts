// const replaceAt = (s: string, idx: number, char: string) =>
// 	s.slice(0, idx) + char + s.slice(idx + 1);

// const v = (s: string, locked: string) => {};

// const validParens = (s: string, locked: string, idx = 0, open = 0) => {
// 	let opened = open;

// 	for (let i = idx; i < s.length; i++) {
// 		if (locked[i] === '0') {
// 			if (s[i] === ')') {
// 				if (opened-- === 0) {
// 					return validParens(replaceAt(s, i, '('), locked, i, opened);
// 				}
// 			} else opened++;
// 		} else {
// 			if (s[i] === ')') {
// 				if (opened-- === 0) return false;
// 			} else opened++;
// 		}
// 	}

// 	return true;
// };

// type State = {
// 	numOpen: number;
// 	numClosed: number;
// 	str: string;
// };

// no=n nc=n no-nc=0 no>nc  out
// 0    0    0       0      x
// 0    0    0       1	    2
// 0    0    1       0      0
// 0    0    1       1      1
// 0    1    0       0      xx
// 0    1    0       1      xx
// 0    1    1       0      xx
// 0    1    1       1      xx
// 1    0    0       0      1
// 1    0    0       1      1
// 1    0    1       0      1
// 1    0    1       1      1
// 1    1    0       0      p
// 1    1    0       1      p
// 1    1    1       0      p
// 1    1    1       1      p

const generateParenthesis = (n: number): string[] => {
	const combinations: string[] = [];

	const next = (opened: number, closed: number, curr: string) => {
		if (closed === n) {
			combinations.push(curr);
			return;
		}

		if (opened < n) next(opened + 1, closed, curr + '(');
		if (closed < opened) next(opened, closed + 1, curr + ')');
	};

	next(0, 0, '');
	return combinations;
};

// const wrapper = (n: number, open: string, close: string) => {
// 	const combinations: string[] = [];

// 	const openFn = (state: State) => ({
// 		numOpen: state.numOpen + 1,
// 		numClosed: state.numClosed,
// 		str: state.str + open,
// 	});

// 	const closeFn = (state: State) => ({
// 		numOpen: state.numOpen,
// 		numClosed: state.numClosed + 1,
// 		str: state.str + close,
// 	});

// 	const next = (state: State) => {
// 		if (state.numClosed === n) combinations.push(state.str);
// 		else if (state.numOpen === n) next(closeFn(state));
// 		else if (state.numOpen - state.numClosed === 0) next(openFn(state));
// 		else if (state.numOpen > state.numClosed) {
// 			next(openFn(state));
// 			next(closeFn(state));
// 		}
// 	};

// 	return (state: State) => {
// 		next(state);
// 		return combinations;
// 	};
// };

// const generateParenthesis = (n: number): string[] =>
// 	wrapper(n, '(', ')')({ numOpen: 0, numClosed: 0, str: '' });

// const openParen = ({ numOpen, numClosed, str }: State) => ({
// 	numOpen: numOpen + 1,
// 	numClosed,
// 	str: str + '(',
// });

// const closeParen = ({ numOpen, numClosed, str }: State) => ({
// 	numOpen,
// 	numClosed: numClosed + 1,
// 	str: str + ')',
// });

// function generateParenthesis(n: number): string[] {
// 	const combinations: string[] = [];

// 	const stack: State[] = [{ numOpen: 0, numClosed: 0, str: '' }];

// 	while (stack.length) {
// 		const state = stack.pop()!;
// 		const { numOpen, numClosed, str } = state;

// 		if (numOpen === n && numClosed === n) combinations.push(str);
// 		else if (numOpen === 0) stack.push(openParen(state));
// 		else if (numOpen === n) stack.push(closeParen(state));
// 		else if (numOpen > numClosed) {
// 			stack.push(openParen(state));
// 			stack.push(closeParen(state));
// 		} else if (numOpen === numClosed) stack.push(openParen(state));
// 	}

// 	return combinations;
// }

// console.log(generateParenthesis(8));

// if numOpen = 0, then we can only open
// if numOpen = n, then we can only close
// if numOpen < n and numOpen > numClosed, then we can open or close
// if numOpen < n and numOpen === numClosed, then we can only open

function calculateMinimumHP(dungeon: number[][]): number {
	let req_hp: number = 0;
	let healBuffer = 0;

	const rec = (
		x: number = 0,
		y: number = 0,
		reqHP: number = 0,
		healBuffer: number = 0
	): number => {
		switch (Math.sign(dungeon[x][y])) {
			case -1:
				const temp = Math.abs(dungeon[x][y]);
				if (healBuffer < temp) {
					reqHP += temp - healBuffer;
					healBuffer = 0;
				} else {
					healBuffer -= temp;
				}
				break;
			case 1:
				healBuffer += dungeon[x][y];
		}

		let right: number, down: number;
		if (x < dungeon.length - 1) right = rec(x + 1, y, reqHP, healBuffer);
		if (y < dungeon[0].length - 1) down = rec(x, y + 1, reqHP, healBuffer);

		if (!right! && !down!) return reqHP;
		if (!right!) return down!;
		if (!down!) return right!;

		return Math.min(right!, down!);

		// const temp = Math.min(right, down);
		// if (x === 2 || y === 2) console.log('zero,zero',temp, right, down, (temp !== 0 ? temp || reqHP : 0));
		// console.log(x, y, (temp !== 0 ? temp || reqHP : 0));

		// return (temp !== 0 ? (temp === NaN ? (!!right ? right : down) : temp) || reqHP : 0);
	};

	return rec() + 1;
}

function removeCharAt(str: string, index: number) {
	return str.slice(0, index) + str.slice(index + 1, str.length);
}

function predictPartyVictory(senate: string): string {
	while (true) {
		// let senators = '';
		let banning = senate.includes(senate[0] === 'R' ? 'D' : 'R');

		if (!banning) return senate[0] === 'R' ? 'Radiant' : 'Dire';

		for (let i = 0; i < senate.length; i++) {
			if (banning) {
				const index = senate.indexOf(senate[i] === 'R' ? 'D' : 'R');
				if (index === -1) break;
				senate =
					senate.slice(0, index) + senate.slice(index + 1, senate.length);
			}
			// senators += senate[i];
			// if (senate.slice(i).includes(senate[i] === 'R' ? 'D' : 'R')) {
			//     i++;
			// } else {
			//     return senate[i] === 'R' ? 'Radiant' : 'Dire';
			// }
		}

		// senate = senators;
	}
}

// console.log(predictPartyVictory('DDR'));


const deck = [];
const hand = [];
const graveyard = [];

const fieldZone = [];
const trapZone = [];
const monsterZone = [];
 