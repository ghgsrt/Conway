//? types for ROUTINE execution
export type _ROUTINE = [string, _ROUTINE_ARGS | _COND_ARGS];
export type _INSTRUCTIONS = Array<_ROUTINE>;
export type _ROUTINE_ARGS = Array<_ROUTINE | string | number>;
export type _COND_ARGS = Array<[_ROUTINE, _INSTRUCTIONS]>;


