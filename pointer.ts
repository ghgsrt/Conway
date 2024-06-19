const arr = [1, 2, 3];

function mutateArray(arr: number[]) {
	arr.pop();
}

console.log('before mutating', arr);
mutateArray(arr); // pass by reference
console.log('after pass by reference', arr);
mutateArray([...arr])// pass by value
console.log('after pass by value', arr);
