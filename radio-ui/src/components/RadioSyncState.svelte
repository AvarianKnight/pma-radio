<script lang="ts">
	import debounce from "lodash.debounce"
	import { fetchNui } from "$lib/fetchNui";
	import { useNuiEvent } from "$lib/useNuiEvent";
	import { onMount } from "svelte";
	import {
		maxChannels,
		maxDecimalPlaces,
		clientRadioChannel,
		defaultRadioChannel,
		radioEnabled,
		radioVolume,
		visible,
        uiRadioChannel,
        radioWasInit,
	} from "../store/radio";

	useNuiEvent("openUi", ([channel, volume]: [number, number]) => {
		clientRadioChannel.set(channel === 0 ? $defaultRadioChannel : channel);
		uiRadioChannel.set(channel === 0 ? $defaultRadioChannel : channel);
		radioVolume.set(volume);
		radioWasInit.set(true);
		visible.set(true);
	});

	useNuiEvent("closeUi", () => {
		visible.set(false);
	});

	// sync this so our check farther on remains valid
	useNuiEvent("updateClientRadioChannel", (radioChannel: number) => {
		clientRadioChannel.set(radioChannel);
		uiRadioChannel.set(radioChannel);
	})

	useNuiEvent('radioChannelRejected', () => {
		clientRadioChannel.set($defaultRadioChannel);
		uiRadioChannel.set($defaultRadioChannel)
	})

	useNuiEvent("updateDisabled", (disabled: boolean) => {
		radioEnabled.set(!disabled)
	})

	onMount(async () => {
		const data = await fetchNui<[number, number, number]>("pma-radio:uiReady");
		if (!data)
			return console.log(
				"Didn't get proper configuration, using defaults"
			);
		const [maxChannelCount, maxDecimals, defaultChannel] = data;
		maxChannels.set(maxChannelCount);
		maxDecimalPlaces.set(maxDecimals);
		defaultRadioChannel.set(defaultChannel)
		console.log(`Max Channels: ${maxChannelCount}, Max Decimal Places: ${maxDecimals}, Default Radio Channel: ${defaultChannel}`)
	});

	useNuiEvent("updateDefaultRadio", (radioChannel: number) => {
		defaultRadioChannel.set(radioChannel)
	})

	const debounceRadioChannel = debounce(([uiChannel, clientChannel]) => {
		if (uiChannel !== clientChannel) fetchNui("pma-radio:setRadioChannel", $uiRadioChannel);
	}, 200)

	const debounceVolume = debounce((volume) => {
		fetchNui("pma-radio:setRadioVolume", volume);
	}, 200)

	// we don't want to do this if the radio channels are the same
	$: debounceRadioChannel([$uiRadioChannel, $clientRadioChannel])
	$: fetchNui("pma-radio:setRadioIsDisabled", !$radioEnabled);
	$: debounceVolume($radioVolume)
</script>
