const getFirstDigit = (str: string): number => {
	str.lastIndexOf(/[^0-9]/);
};