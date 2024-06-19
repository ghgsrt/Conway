// function collectEscapedStrings(obj, propertyName) {
// 	const results = [];
// 	const regex = /"(?:[^"\\]|\\.)*"/g; // Regular expression to match escaped strings

// 	if (!obj[propertyName] || !Array.isArray(obj[propertyName])) {
// 		return results;
// 	}

// 	for (const str of obj[propertyName]) {
// 		let match;
// 		while ((match = regex.exec(str)) !== null) {
// 			results.push(match[0]);
// 		}
// 	}

// 	return results;
// }

// // Sample object with a property containing an array of strings
// const myObject = {
// 	myProperty: [
// 		'Here is a string "with escaped content"',
// 		'Another string "more escaped content" and "even more"',
// 		'Yet another "more to see"',
// 	],
// };

// const escapedStrings = collectEscapedStrings(myObject, 'myProperty');
// console.log(escapedStrings);
