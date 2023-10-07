<script lang="ts">
	import debounce from "lodash.debounce"
	import { fetchNui } from "$lib/fetchNui";
	import { useNuiEvent } from "$lib/useNuiEvent";
	import { onMount } from "svelte";
	import {
		maxChannels,
		maxDecimalPlaces,
		clientRadioChannel,
		radioChannelOffset,
		radioEnabled,
		radioVolume,
		visible,
        uiRadioChannel,
        radioWasInit,
	} from "../store/radio";

	useNuiEvent("openUi", ([channel, volume]: [number, number]) => {
		clientRadioChannel.set(channel === 0 ? $radioChannelOffset : channel);
		uiRadioChannel.set(channel === 0 ? $radioChannelOffset : channel);
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
	})

	useNuiEvent('radioChannelRejected', () => {
		clientRadioChannel.set($radioChannelOffset);
		uiRadioChannel.set($radioChannelOffset)
	})

	onMount(async () => {
		const data = await fetchNui<[number, number, number]>("pma-radio:uiReady");
		if (!data)
			return console.log(
				"Didn't get proper configuration, using defaults"
			);
		const [maxChannelCount, maxDecimals, channelOffset] = data;
		maxChannels.set(maxChannelCount);
		maxDecimalPlaces.set(maxDecimals);
		radioChannelOffset.set(channelOffset)
		console.log(`Max Channels: ${maxChannelCount}, Max Decimal Places: ${maxDecimals}, Radio Channel Offset: ${channelOffset}`)
	});

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
