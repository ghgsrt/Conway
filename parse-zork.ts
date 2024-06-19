// type TOKEN_TYPE = 'WORD' | 'VALUE' | 'SPECIAL';

// const Token = (type: TOKEN_TYPE, value: string) => ({ type, value });

// function objectLexer(inputString: string) {
// 	const tokens: Array<ReturnType<typeof Token>> = [];
// 	let i = 0;
// 	let isMultiline = false;
// 	let multilineValue = '';

// 	while (i < inputString.length) {
// 		const char = inputString[i];

// 		// Skip whitespace
// 		if (/\s/.test(char)) {
// 			i++;
// 			continue;
// 		}

// 		// Handle object names and keys (consider '-' as part of the word)
// 		if (/[a-zA-Z-]/.test(char)) {
// 			let word = char;
// 			while (
// 				i + 1 < inputString.length &&
// 				/[a-zA-Z0-9-]/.test(inputString[i + 1])
// 			) {
// 				i++;
// 				word += inputString[i];
// 			}
// 			tokens.push(Token('WORD', word));
// 		}

// 		// Handle numeric values
// 		else if (/[0-9]/.test(char)) {
// 			let num = char;
// 			while (i + 1 < inputString.length && /[0-9]/.test(inputString[i + 1])) {
// 				i++;
// 				num += inputString[i];
// 			}
// 			tokens.push(Token('VALUE', num));
// 		}

// 		// Handle values (assuming they are enclosed in double quotes)
// 		else if (char === '"' || isMultiline) {
// 			i++;
// 			let value = '';
// 			while (i < inputString.length && inputString[i] !== '"' && !isMultiline) {
// 				value += inputString[i];
// 				i++;
// 			}
// 			if (isMultiline) {
// 				value = multilineValue;
// 				isMultiline = false;
// 			}
// 			tokens.push(Token('VALUE', value));
// 		}

// 		// Handle multi-line values (values that start on the next line)
// 		else if (char === '\n') {
// 			isMultiline = true;
// 			multilineValue = '';
// 			while (i < inputString.length && inputString[i] !== ')') {
// 				multilineValue += inputString[i];
// 				i++;
// 			}
// 			i--; // Step back to let the loop handle the closing parenthesis
// 		}

// 		// Handle special characters
// 		else if (/[<>()=]/.test(char)) {
// 			tokens.push(Token('SPECIAL', char));
// 		} else {
// 			throw new Error(`Invalid character: ${char}`);
// 		}

// 		i++;
// 	}

// 	return tokens;
// }

// const ZorkObject = (name: string, properties: Record<string, any>) => ({
// 	name,
// 	properties,
// });

// const linkValue = (value: string) => `[[zork; ${value}|${value}]]`;

// function objectParser(tokens: ReturnType<typeof objectLexer>) {
// 	const parsedObjects: Array<ReturnType<typeof ZorkObject>> = [];
// 	let i = 0;

// 	while (i < tokens.length) {
// 		const token = tokens[i];

// 		if (token.type === 'SPECIAL' && token.value === '<') {
// 			i++;
// 			if (
// 				tokens[i].type === 'WORD' &&
// 				(tokens[i].value === 'OBJECT' || tokens[i].value === 'ROOM')
// 			) {
// 				i++;
// 				if (tokens[i].type === 'WORD') {
// 					const objectName = tokens[i].value;
// 					i++;
// 					const properties: Record<string, any> = {};

// 					while (
// 						i < tokens.length &&
// 						!(tokens[i].type === 'SPECIAL' && tokens[i].value === '>')
// 					) {
// 						if (tokens[i].type === 'SPECIAL' && tokens[i].value === '(') {
// 							i++;
// 							if (tokens[i].type === 'WORD') {
// 								const key = tokens[i].value;
// 								i++;
// 								const values: Array<string> = [];

// 								while (
// 									i < tokens.length &&
// 									!(tokens[i].type === 'SPECIAL' && tokens[i].value === ')')
// 								) {
// 									if (tokens[i].type === 'WORD') {
// 										values.push(linkValue(tokens[i].value));
// 									} else if (tokens[i].type === 'VALUE') {
// 										values.push(tokens[i].value);
// 									}
// 									i++;
// 								}

// 								properties[key] = values;
// 							}
// 						}
// 						i++;
// 					}

// 					parsedObjects.push(ZorkObject(objectName, properties));
// 				}
// 			}
// 		}
// 		i++;
// 	}

// 	return parsedObjects;
// }

// console.log(
// 	JSON.stringify(
// 		objectParser(
// 			objectLexer(`<OBJECT SKULL
// 			(IN LAND-OF-LIVING-DEAD)
// 			(SYNONYM SKULL HEAD TREASURE)
// 			(ADJECTIVE CRYSTAL)
// 			(DESC "crystal skull")
// 			(FDESC
// 		"Lying in one corner of the room is a beautifully carved crystal skull.
// 		It appears to be grinning at you rather nastily.")
// 			(FLAGS TAKEBIT)
// 			(VALUE 10)
// 			(TVALUE 10)>
// 			<ROOM LIVING-ROOM
//       (IN ROOMS)
//       (DESC "Living Room")
//       (EAST TO KITCHEN)
//       (WEST TO STRANGE-PASSAGE IF MAGIC-FLAG ELSE "The door is nailed shut.")
//       (DOWN PER TRAP-DOOR-EXIT)
//       (ACTION LIVING-ROOM-FCN)
//       (FLAGS RLANDBIT ONBIT SACREDBIT)
//       (GLOBAL STAIRS)
//       (PSEUDO "NAILS" NAILS-PSEUDO "NAIL" NAILS-PSEUDO)>`)
// 		),
// 		null,
// 		2
// 	)
// );
