<script lang="ts">
	import {
		clientRadioChannel,
		radioEnabled,
		radioVolume,
		radioWasInit,
		uiRadioChannel,
	} from "../../store/radio";

	const audioFiles = [
		"off",
		"on",
		"volume_down",
		"volume_up",
		"channel_connect"
	]

	let lastRadioVolume = $radioVolume;

	let audio = new Audio();

	const updateAndPlayAudio = (audioName: string, volume = 25) => {
		// we ignore audio until the radio gets opened
		if (!$radioWasInit) return;
		audio.src = `./audio/${audioName}.ogg`;
		audio.volume = volume / 100;
		audio.play().catch(() => {});
	};

	$: {
		if (lastRadioVolume < $radioVolume) {
			updateAndPlayAudio("volume_up");
		} else {
			updateAndPlayAudio("volume_down");
		}
		lastRadioVolume = $radioVolume;
	}

	$: {
		if ($radioEnabled) {
			updateAndPlayAudio("on");
		} else {
			updateAndPlayAudio("off");
		}
	}

	$: {
		// if we're on 0 then we don't want to do anything
		if ($uiRadioChannel !== 0 && $uiRadioChannel !== $clientRadioChannel) {
			updateAndPlayAudio("channel_connect");
		}
	}
</script>

<audio preload="auto">
	{#each audioFiles as audioName}
		<source src={`./audio/${audioName}.ogg`} type="audio/ogg" />
	{/each}
</audio>
