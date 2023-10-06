
// https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places
function roundTo(n: number, digits = 2): number {
  const multiplicator = Math.pow(10, digits);

  n = parseFloat((n * multiplicator).toFixed(11));
  const test =(Math.round(n) / multiplicator);
  return +(test.toFixed(digits));
}

export const getValidatedChannel = (channel: number, maxChannels = 1000, maxDecimalPlaces = 2) => {
	let validatedChannel = channel;
	if (validatedChannel > maxChannels) {
		validatedChannel = maxChannels;
	} else if (validatedChannel < 0) {
		validatedChannel = 0;
	}

	return roundTo(validatedChannel, maxDecimalPlaces);
}
