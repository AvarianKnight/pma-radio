
const loadDict = async (dict) => {
	RequestAnimDict(dict)
	while (!HasAnimDictLoaded(dict)) {
		await Delay(0);
	}
}

const UNARMED = GetHashKey('weapon_unarmed');


// https://stackoverflow.com/questions/15762768/javascript-math-round-to-two-decimal-places
function roundTo(n, digits = 2) {
	const multiplicator = Math.pow(10, digits);

	n = parseFloat((n * multiplicator).toFixed(11));
	const test = (Math.round(n) / multiplicator);
	return +(test.toFixed(digits));
}

/**
 * @param {number} channel the channel to validate
 * @returns {number} the validated channel number.
 */
export const getValidatedChannel = (channel, maxChannels = 1000, maxDecimalPlaces = 2) => {
	let validatedChannel = channel;
	if (validatedChannel > maxChannels) {
		validatedChannel = maxChannels;
	} else if (validatedChannel < 0) {
		validatedChannel = 0;
	}

	return roundTo(validatedChannel, maxDecimalPlaces);
}

class RadioHandler {
	#radioChannel = 0
	#uiReady = false;
	#radioOpen = false;
	#radioTick = 0;
	#firstRadioCall = true;
	#talkingOnRadio = false;
	#runningRadioOpenTick = false;
	#disableRadioAnim = GetConvarInt("radio_useRadioAnim", 1) == 1;
	#defaultRadio = GetConvarInt("radio_defaultStartChannel", 21);

	constructor() {
		// the current radio channel
		const curRadio = LocalPlayer.state.radioChannel
		this.RadioChannel = curRadio ?? 0;
		LocalPlayer.state.radioOpen = false;


		onNet("pma-voice:radioChangeRejected", () => {
			this.RadioChannel = 0;
			if (this.#uiReady) {
				SendNUIMessage({
					action: "radioChannelRejected",
				})
			}
		})

		on("pma-voice:radioActive", async (isActive) => {
			this.#talkingOnRadio = isActive;
		})

		AddStateBagChangeHandler("radioChannel", `player:${GetPlayerServerId(PlayerId())}`, (_, __, value) => {
			if (value !== this.#radioChannel) {
				this.#radioChannel = value;

				SendNUIMessage({
					action: "updateClientRadioChannel",
					data: value
				})
			}
		})
	}

	#handleRadioTick() {
		// remove any radio tick if we have one
		if (this.#radioTick) clearTick(this.#radioTick);
		// reset radio tick back to default
		this.#radioTick = 0

		if (this.#radioOpen) {
			// disable control actions that might be annoying
			this.#radioTick = setTick(() => {
				// disable looking left and right
				DisableControlAction(0, 1, true)
				// disble looking up and down
				DisableControlAction(0, 2, true)
				// disable attacking
				DisableControlAction(0, 24, true)
				// disable aiming
				DisableControlAction(0, 24, true)

				// disable frontend (map)
				DisableControlAction(0, 199, true)
				DisableControlAction(0, 200, true)
				DisableControlAction(0, 201, true)
				DisableControlAction(0, 202, true)
			})
		} else {
			// delay escape doing anything for a second so players who
			// hold escape don't get put into the map
			const escTick = setTick(() => {

				// disable frontend
				DisableControlAction(0, 199, true)
				DisableControlAction(0, 200, true)
				DisableControlAction(0, 201, true)
				DisableControlAction(0, 202, true)
			})
			setTimeout(() => clearTick(escTick), 1000)
		}
	}

	/**
	 * @param {number} defaultChannel the default channel to set to
	 */
	set DefaultRadioChannel(defaultChannel) {
		this.#defaultRadio = defaultChannel;
		if (this.#uiReady) {
			SendNUIMessage({
				action: "updateDefaultRadio",
				data: defaultChannel
			})
		}
	}

	get DefaultRadioChannel() {
		return this.#defaultRadio;
	}

	async #handleRadioAnim() {
		if (this.#runningRadioOpenTick || this.#disableRadioAnim) return;
		LocalPlayer.state.set("showRadioProp", true, true)

		this.#runningRadioOpenTick = true;
		const talking = ["cellphone@str", "cellphone_call_listen_a"]
		const holdingRadio = ["cellphone@", "cellphone_text_in"];

		let dict = holdingRadio[0]
		let anim = holdingRadio[1];

		await loadDict(talking[0])
		await loadDict(holdingRadio[0]);

		// -1 just opened radio, will transition to 0 automatically
		// 0 is holding radio
		// 1 is talking on radio
		let curState = -1;

		const animTick = setTick(async () => {
			const ped = PlayerPedId();
			// our state changed, clear out this tick.
			if (!this.#radioOpen) {
				StopAnimTask(ped, dict, anim, -4.0)
				// cleanup the dict
				RemoveAnimDict(dict)
				LocalPlayer.state.set("showRadioProp", false, true)
				clearTick(animTick);
				return;
			}
			const [hasWeapon, curWeapon] = GetCurrentPedWeapon(ped, 1)

			// its easier this way
			if (curWeapon !== UNARMED) {
				SetCurrentPedWeapon(ped, UNARMED, true)
			}

			if (this.#talkingOnRadio && curState !== 1) {
				curState = 1;
				dict = talking[0]
				anim = talking[1];
				TaskPlayAnim(ped, dict, anim, 6.0, 2.0, -1, 50, 2.0, false, false, false)
			} else if (!this.#talkingOnRadio && curState !== 0) {
				curState = 0;
				dict = holdingRadio[0];
				anim = holdingRadio[1];
				TaskPlayAnim(ped, dict, anim, 4.0, 2.0, -1, 50, 2.0, false, false, false)
			}
		})

		RemoveAnimDict(talking[0])
		RemoveAnimDict(holdingRadio[0])

		this.#runningRadioOpenTick = false;
	}

	/**
	 * @param {boolean} open sets if the radio is open
	 */
	set RadioOpen(open) {
		this.#radioOpen = open

		// disable the radio animation while we're in the radio, we should be using our own animation
		if (open) {
			exports['pma-voice'].setDisableRadioAnim(true);
		} else {
			exports['pma-voice'].setDisableRadioAnim(false);
		}

		this.#handleRadioAnim()

		this.#handleRadioTick();

		LocalPlayer.state.radioOpen = open;

		SetNuiFocus(open, open);
		SetNuiFocusKeepInput(open);
		SendNUIMessage({
			action: open ? "openUi" : "closeUi",
			data: [
				radioHandler.RadioChannel,
				radioHandler.RadioVolume
			]
		})
	}

	/**
	 * @returns {boolean} if the radio is open or not
	 */
	get RadioOpen() {
		return this.#radioOpen
	}


	/**
	 * @param {number} radioChannel the radio channel to set to
	 */
	set RadioChannel(radioChannel) {
		const channel = getValidatedChannel(radioChannel, GetConvarInt("radio_maxChannels", 1000), GetConvarInt("radio_maxDecimalPlaces", 2));
		this.#radioChannel = channel;
		exports['pma-voice'].setRadioChannel(channel);
		// TODO: get rid of radioEnabled in pma-voice
		if (this.#firstRadioCall) {
			this.#firstRadioCall = false;
			exports['pma-voice'].setVoiceProperty("radioEnabled", true)
		}
		if (this.#uiReady) {
			SendNUIMessage({
				action: "updateClientRadioChannel",
				data: channel
			})
		}
	}

	/**
	 * @returns {number} the radio channel the player is currently in
	 */
	get RadioChannel() {
		return this.#radioChannel
	}

	/**
	 * @param {boolean} ready if the radios ui is currently ready
	 */
	set UiReady(ready) {
		this.#uiReady = ready;
	}

	/**
	 * @returns {boolean} wheather or not the radio is disabled.
	 */
	get RadioDisabled() {
		return LocalPlayer.state.disableRadio !== 0;
	}

	/**
	 * @param {number} isDisabled if we disable we add the '32' bit [PlayerDisabledRadio] otherwise we remove it
	 */
	set RadioDisabled(isDisabled) {
		if (this.#uiReady) {
			SendNUIMessage({
				action: "updateDisabled",
				data: isDisabled
			})
		}
		// 32 is PlayerDisabledRadio
		isDisabled ? exports['pma-voice'].addRadioDisableBit(32) : exports['pma-voice'].removeRadioDisableBit(32)
	}

	/**
	 * @returns {number} the players current radio volume
	 */
	get RadioVolume() {
		return exports['pma-voice'].getRadioVolume() * 100;
	}

	/**
	 * @param {number} volume the volume to set the radio to
	 */
	set RadioVolume(volume) {
		let actualVolume = 0;
		if (volume > 100) {
			actualVolume = 100;
		} else if (volume <= 0) {
			actualVolume = 1;
		}
		actualVolume = volume;

		exports['pma-voice'].setRadioVolume(actualVolume);
	}

	/**
	 * @param {boolean} disable if we should disable the anim
	 */
	set DisableRadioAnim(disable) {
		this.#disableRadioAnim = disable;
	}
}

// add the radio to the global table so everything can use it.
globalThis.radioHandler = new RadioHandler();
