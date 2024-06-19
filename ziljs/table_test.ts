import { _INSTRUCTIONS } from '../ziljs';
import { preprocess } from './process';
import { toRecallIter } from './utils';

type PARSER<T> = (iter: ReturnType<typeof toRecallIter>) => T;
type OBJECT = {
	[key: string]: number | string | Array<string> | Set<string> | undefined; // typescript sucks ("no index signature of type string" 🤪)
	tags: Array<string>; // for Obsidian
	aliases: Array<string>; // for Obsidian
	NORTH?: string;
	SOUTH?: string;
	EAST?: string;
	WEST?: string;
	NE?: string;
	NW?: string;
	SE?: string;
	SW?: string;
	UP?: string;
	DOWN?: string;
	IN?: string;
	OUT?: string;
	LAND?: string;
	SYNONYM?: Array<string>; // valid nouns to refer to OBJECT
	ADJECTIVE?: Array<string>; // valid adjectives for OBJECT
	ACTION?: string; // associated ROUTINE called in PERFORM; OBJECT: when PRSO/PRSI; ROOM: called with M-BEG & M-END once each turn, M-ENTER on room enter, M-LOOK for describers
	DESCFN?: string; // ROUTINE for describers to descibe the OBJECT (can be ACTION if handles "OPT" M-OBJDESC or M-OBJDESC?)
	CONTFN?: string; // ROUTINE for when PRSO/PRSI is inside this OBJECT
	GENERIC?: string; // ROUTINE which handles OBJECT ambiguity (unsure what do if parser finds multiple with GENERIC set)
	DESC?: string; // ROOM: before room desc and on status line; OBJECT: verb defaults, player inv, etc. (actual display name)
	SDESC?: string; // mutable DESC
	LDESC?: string; // ROOM: long desc; OBJECT: desc when on ground
	FDESC?: string; // describes OBJECT before the first time it is moved
	LOC?: string; // name of OBJECT or ROOM which contains this OBJECT
	SIZE?: number; // also weight; if undefined, == 5
	CAPACITY?: number; // total size of OBJECTS a container can hold; if undefined, == size
	VALUE?: number; // score value
	TVALUE?: number; // treasure value
	GLOBAL?: Array<string>; // LOCAL-GLOBALS referencable in ROOM
	OWNER?: string; // OBJECT which owns this OBJECT; <OBJECT CAR ... (OWNER CYBIL)> --> "Cybil's car" -> car
	TEXT?: string; // text to display when OBJECT is READ
	PSEUDO?: string; // it's not the 80's anymore, the use case for this is gone; just create a new OBJECT
	PLURAL?: string; // plural form of OBJECT? (not used in source, apparently only Stu knows 🤷🏻‍♂️)
	ADJACENT?: Array<string>; // ROOMs for ADJACENT syntax token??? (somebody find Stu)
	FLAGS?: Set<string>; // TAKEBIT, DOORBIT, etc.; effectively defines generic OBJECT behaviors
	first?: string; // first OBJECT in container (OBJECT must have CONTBIT)
	last?: string; // last OBJECT in container (OBJECT must have CONTBIT)
	next?: string; // next OBJECT in linked LOCs
	prev?: string; // previous OBJECT in linked LOCs (for doubly linking)
};
type ROOM = OBJECT;
type ROUTINE = {
	tells: string[]; // sequestered for much easier postprocessing
	arguments: {
		[key: string]: Array<string | any> | undefined; // typescript sucks ("no index signature of type string" 🤪)
		_?: Array<any>; // argument values
		req?: Array<string>; // names & order of required arguments
		opt?: Array<string>; // " optional arguments
		aux?: Array<string>; // " local variables
	};
	main: _INSTRUCTIONS;
};
type TABLE<T = undefined> = T extends Array<infer U>
	? T
	: Array<string | number | boolean | OBJECT | ROOM | ROUTINE | TABLE>;
type GLOBAL = string | number | boolean | TABLE;
type CONSTANT = number;

type TABLE_TYPE = 'NONE' | 'BYTE' | 'WORD';
type TABLE_MOD = 'LENGTH' | 'PURE';
type TABLE_FLAG = TABLE_TYPE | TABLE_MOD;

const _STR: Array<string> = [];

// const isNumeric = (str: string) => /^\d+$/.test(str);

const isNumeric = (str: string) => +str === +str;
const resolveNumOrStr = (str: string) => (isNumeric(str) ? Number(str) : str);
const toHigh = (num: number) => (num & 0xff00) >> 8;
const toLow = (num: number) => num & 0xff;
const toNum = (high: number, low: number) => (high << 8) | low;

function TABLE(
	flags: Array<TABLE_FLAG | 'LEXV'> | string,
	args: Array<number | string> | number,
	def?: number,
	defLex1?: number,
	defLex2?: number
) {
	const table: Array<number> = [];

	const len = typeof args === 'number' ? args : args.length;
	const isLEXV = flags.includes('LEXV');

	for (let i = 0; i < len; i++) {
		const arg = Number((args as Array<string | number>)[i]);
		// const arg = typeof _arg === 'string' ? _STR.push(_arg) - 1 : _arg;

		if (flags.includes('BYTE')) {
			table.push(def ?? arg);
			continue;
		}

		if (isLEXV) table.push(toHigh(def ?? 0), toLow(def ?? 0));

		table.push(
			defLex1 ?? toHigh(def ?? arg ?? 0),
			defLex2 ?? toLow(def ?? arg ?? 0)
		);
	}

	if (flags.includes('LENGTH')) {
		if (flags.includes('BYTE')) table.unshift(table.length);
		else {
			let len = table.length;
			if (isLEXV) len *= 0.75;
			table.unshift(toHigh(len), toLow(len));
		}
	}

	table.PUT = (index: number, value: number) => {
		const realIdx = index * 2;
		table[realIdx] = toHigh(value);
		table[realIdx + 1] = toLow(value);
	};
	table.GET = (index: number) => {
		const realIdx = index * 2;
		const high = table[realIdx];
		const low = table[realIdx + 1];
		return toNum(high, low);
	};

	table.PUTB = (index: number, value: number) => (table[index] = value);
	table.GETB = (index: number) => table[index];

	return table;
}

const parseTable: PARSER<TABLE> = (iter) => {
	const flags: Array<TABLE_MOD | 'LEXV'> | Array<TABLE_FLAG> = [];
	let len: number;
	let def: number | Array<number>;

	if (iter.current === 'ITABLE') {
		if (['NONE', 'BYTE', 'WORD'].includes(iter.next()))
			return TABLE(
				iter.current as TABLE_TYPE,
				Number(iter.next()),
				Number(iter.next()) || 0 //? may be NaN
			);

		len = Number(iter.current);

		if (iter.next() === '>') return TABLE(flags, len);
		// @ts-ignore
		if (iter.current !== '(') return TABLE(flags, len, Number(iter.current)); //! might still need to move iter forward

		while (iter.next() !== ')') flags.push(iter.current);

		//@ts-ignore
		if (flags.includes('LEXV')) {
			while (iter.next() !== '>')
				((def ??= []) as Array<number>).push(Number(iter.current));

			return TABLE(
				flags as Array<TABLE_MOD | 'LEXV'>,
				len,
				...(def! as [
					number | undefined,
					number | undefined,
					number | undefined
				])
			);
		}

		def = Number(iter.next());
		iter.next(); //? '>'
		return TABLE(flags, len, def);
	}

	if (iter.current === 'PTABLE') flags.push('PURE');
	else if (iter.current === 'LTABLE') flags.push('LENGTH');
	else if (iter.current === 'PLTABLE') flags.push('PURE', 'LENGTH');

	const args: Array<number | string> = [];

	if (iter.next() === '(')
		while (iter.next() !== ')')
			(flags as Array<TABLE_FLAG>).push(iter.current as TABLE_FLAG);
	else args.push(resolveNumOrStr(iter.current));

	while (iter.next() !== '>') args.push(resolveNumOrStr(iter.current));

	return TABLE(flags as Array<TABLE_FLAG>, args);
};

const test = (tableStr: string) => {
	// const iter = toRecallIter(tableStr.split(' '));
	const iter = toRecallIter(preprocess(tableStr));
	iter.next(); //? get first element
	const temp = parseTable(iter);
	console.log(temp);
	return temp;
};

// const PUT = (table: TABLE, index: number, value: number) => {
// 	const high = (value & 0xff00) >> 8;
// 	const low = value & 0xff;
// 	const realIdx = index * 2;
// 	table[realIdx] = high;
// 	table[realIdx + 1] = low;
// };
// const GET = (table: TABLE, index: number) => {
// 	const realIdx = index * 2;
// 	const high = table[realIdx];
// 	const low = table[realIdx + 1];
// 	return (high << 8) | low;
// };
// const PUTB = (table: TABLE, index: number, value: number) =>
// 	(table[index] = value & 0xff);
// const GETB = (table: TABLE, index: number) => table[index];

// test('TABLE 1 2 3 4 5 6 7 >');
// test('TABLE ( BYTE ) 1 2 3 4 5 6 7 >');
// test('TABLE ( BYTE LENGTH ) 1 2 3 4 5 6 7 >');
// test('LTABLE 1 2 3 4 5 6 7 >');
// test('LTABLE ( BYTE ) 1 2 3 4 5 6 7 >');
// test('PTABLE 1 2 3 4 5 6 7 >');
// test('PTABLE ( BYTE ) 1 2 3 4 5 6 7 >');
// test('PLTABLE 1 2 3 4 5 6 7 >');
test('PLTABLE ( BYTE ) 1 2 3 4 5 6 7 >');
const WIT = test('ITABLE 5 >');
// test('ITABLE 5 1 >');
// test('ITABLE 5 ( BYTE ) 1 >');
const BIT = test('ITABLE BYTE 5 >');
// test('ITABLE BYTE 5 1 >');
test('ITABLE 5 ( LENGTH BYTE ) 1 >');
// test('ITABLE 5 ( LEXV ) 1 2 3 >');
const LIT = test('ITABLE 5 ( LEXV LENGTH ) 1 2 3 >');
