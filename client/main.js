
let lastState = 0;
AddStateBagChangeHandler("disableRadio", `player:${GetPlayerServerId(PlayerId())}`, (_, __, value, slotId, wasClient) => {
	// don't duplicate changes
	if (value === lastState || !wasClient) return;
	lastState = value
	// if the value has any bits set then we want to disable the radio
	if (value !== 0) {
		exports['pma-voice'].setVoiceProperty("radioEnabled", false);
	} else {
		exports['pma-voice'].setVoiceProperty("radioEnabled", true);
	}
});

/** @type {RadioHandler} */
const radioHandler = globalThis.radioHandler;

/**
 *
 * @param {boolean} open wheather the ui should be opened or closed.
 */
function openRadio() {
	radioHandler.RadioOpen = true;
}
onNet("pma-radio:openRadioUi", openRadio);
exports("openRadio", openRadio);

function closeRadio() {
	radioHandler.RadioOpen = false;
}
onNet("pma-radio:closeRadioUi", closeRadio)
exports("closeRadio", closeRadio)

function toggleRadio() {
	radioHandler.RadioOpen = !radioHandler.RadioOpen
}
onNet("pma-radio:toggleRadioUi", toggleRadio)
exports("toggleRadio", toggleRadio)

if (GetConvarInt("radio_enableRadioCommands", 1)) {
	RegisterCommand("radio", toggleRadio)
	RegisterCommand("r", toggleRadio)
}

RegisterNuiCallback("pma-radio:closeUi", (_, cb) => {
	closeRadio()
	cb({})
})

RegisterNuiCallback("pma-radio:setRadioChannel", (data, cb) => {
	radioHandler.RadioChannel = data;
	cb({})
})


RegisterNuiCallback("pma-radio:setRadioIsDisabled", (data, cb) => {
	radioHandler.RadioDisabled = data;
	cb({})
})

RegisterNuiCallback("pma-radio:setRadioVolume", (data, cb) => {
	radioHandler.RadioVolume = data;
	cb({})
})

RegisterNuiCallback("pma-radio:uiReady", (_, cb) => {
	radioHandler.UiReady = true;
	cb([
		GetConvarInt("radio_maxChannels", 1000),
		GetConvarInt("radio_maxDecimalPlaces", 2),
		radioHandler.DefaultRadioChannel
	])
})

exports("setDefaultChannel", (radioChannel) => {
	radioHandler.DefaultRadioChannel = radioChannel;
})

const handleMute = () => {
	radioHandler.RadioDisabled = !radioHandler.RadioDisabled;
}

RegisterCommand("m", handleMute);
RegisterCommand("mute", handleMute);

const handleFrequency = (source, args) => {
	let freq = args[0];
	if (!freq) return console.log(`Expected a radio frequency, but didn't get one.`);
	freq = parseFloat(freq);
	if (isNaN(freq)) return console.log(`Expected a valid decimal number.`)
	radioHandler.RadioChannel = freq;
}

RegisterCommand("f", handleFrequency);
RegisterCommand("freq", handleFrequency);
RegisterCommand("frequency", handleFrequency);
