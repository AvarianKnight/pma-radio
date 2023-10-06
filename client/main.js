
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
		GetConvarInt("radio_allowDecimalPlaces", 2),
		GetConvarInt("radio_defaultStartChannel", 21)
	])
})

// TODO: Quick commands for mute/frequency changes
