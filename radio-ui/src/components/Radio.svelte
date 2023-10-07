<script lang="ts">
	import { visible } from "../store/radio";
	import { slide } from "svelte/transition";
	import RadioScreen from "./radio-elements/RadioScreen.svelte";
	import RadioChannel from "./radio-elements/RadioChannel.svelte";
	import RadioNumpad from "./radio-elements/RadioNumpad.svelte";
	import RadioVolume from "./radio-elements/RadioVolume.svelte";
	import { isEnvBrowser } from "$utils/misc";
    import RadioSyncState from "./RadioSyncState.svelte";
    import { onMount } from "svelte";
    import { fetchNui } from "$lib/fetchNui";
    import RadioImage from "./RadioImage.svelte";
    import RadioSounds from "./radio-elements/RadioSounds.svelte";

	// this should never be un-loaded but better safe then sorry
	onMount(() => {
		const listener = (ev: KeyboardEvent) => {
			if (ev.key === "Escape") {
				fetchNui("pma-radio:closeUi")
			}
		}
		window.addEventListener("keydown", listener);
		return () => window.removeEventListener('keydown', listener)
	})
</script>

{#if isEnvBrowser()}
	<input checked value={$visible} on:change={() => visible.update((val) => !val)} type="checkbox" id="toggle-radio" />
	<label for="toggle-radio">Toggle Radio</label>
{/if}

<RadioSyncState />
<RadioSounds />
{#if $visible}
	<div class="radio-container" transition:slide={{ duration: 1000 }}>
		<RadioImage />
		<map name="radio-map">
			<RadioScreen />
			<RadioChannel />
			<RadioVolume />
			<RadioNumpad />
		</map>
	</div>
{/if}

<style>
	.radio-container {
		position: absolute;
		right: 5px;
		bottom: 0;
	}
</style>
