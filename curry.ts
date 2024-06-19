function curry(fn: (...args: any[]) => any) {
	return function curried(...args: any[]) {
		fn = fn.bind(null, ...args);
		return fn.length === 0 ? fn() : curried;
	};
}

const add = (a: number, b: number, c: number) => a + b + c;

const curriedAdd = curry(add);
console.log(curry(add)(1, 2, 3));
console.log(curry(add)(1, 2)(3));
console.log(curry(add)(1)(2, 3));
console.log(curry(add)(1)(2)(3));

interface Array<T> {
	groupBy(fn: (item: T) => string): Record<string, T[]>;
}

// Array.prototype.groupBy = function <T>(fn: (item: T) => string) {
// 	return (this as Array<T>).reduce(
// 		(groups: Record<ReturnType<typeof fn>, Array<T>>, curr) =>
// 			(groups[fn(curr)] ??= []).push(curr),
// 		{}
// 	);
// };
// Array.prototype.groupBy = function (fn: Function) {
// 	return this.reduce(
// 		(groups, curr) => (groups[fn(curr)] ??= []).push(curr),
// 		{}
// 	);
// };

// console.log(([1, 2, 3, 4, 5] as unknown as Array<number>).groupBy(String));

function throttle(fn: Function, t: number) {
	let throttled = false;
	let tempFn: typeof fn | undefined;
	return function (...args: any[]) {
		if (!throttled) {
			throttled = true;
			setTimeout(() => {
				throttled = false;
				if (tempFn) {
					tempFn();
					tempFn = undefined;
				}
			}, t);
			fn(...args);
		} else {
			tempFn = fn.bind(null, ...args);
		}
	};
}

const throttled = throttle(console.log, 3000);
throttled('log');
throttled('log');