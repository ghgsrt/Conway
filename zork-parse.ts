const src = "";

const objectData = src.split("<OBJECT ");
const objHead = objectData.shift()!;
const objTail = objectData.pop()!;

const roomData = objTail.split("<ROOM ");
const roomHead = roomData.shift()!;
const roomTail = roomData.pop()!;

const objects = {};


