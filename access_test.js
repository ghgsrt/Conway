const add = (a, b) => a + b;

const obj = {
	add,
};

const arr = [add]

let t1 = Date.now();
for (let i = 0; i < 10_000_000_000; i++) arr[0](1, 2);
let t2 = Date.now();

console.log(t2 - t1);
