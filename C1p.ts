const graph = [[], [2, 3], [3, 4], [6], [1, 3, 5], [6], [1, 4, 7]];
// const graph = [[], [2], [3], [4, 5], [2, 6], [2, 6], [7]];

function C1p(graph: number[][], startIdx: number, endIdx = graph.length) {
	let numTests = 0;

	const _C1p = (_graph: number[][], idx: number): Record<number, {}> => {
		if (idx === endIdx) {
			numTests++;
			return 'END';
		}
		if (_graph[idx].length === 0) return 'X';
		if (graph[idx].length === 1)
			// force continue
			return { [graph[idx][0]]: _C1p(_graph, graph[idx][0]) };

		const coverage: Record<number, {}> = {};

		for (const branch of _graph[idx]) {
			const copy = [..._graph];
			copy[idx] = copy[idx].filter((el) => el !== branch);
			coverage[branch] = _C1p(copy, branch);
		}

		return coverage;
	};

	return {
		coverage: { [startIdx]: _C1p(graph, startIdx) },
		numTests,
	};
}

const { coverage, numTests } = C1p(graph, 1);
console.log(JSON.stringify(coverage, null, 2), numTests);

function toMermaid(tree: Record<number, {}>) {
	let iota = -1;
	let str = 'graph TD\n';

	const _toMermaid = (
		tree: Record<number, {}>,
		parent: string | number = iota,
		isStart = false
	) => {
		for (const key in tree) {
			if (parent === -1) {
				_toMermaid(tree[key], ++iota, true);
				continue;
			}

			str += `${
				isStart ? `${parent}((${parent}))` : parent
			}-->${++iota}((${key}))\n`;

			if (tree[key] !== 'END' && tree[key] !== 'X') _toMermaid(tree[key], iota);
			else str += `${iota}-->${++iota}((${tree[key]}))\n`;
		}
	};

	_toMermaid(tree);
	return str;
}

console.log(toMermaid(coverage));
