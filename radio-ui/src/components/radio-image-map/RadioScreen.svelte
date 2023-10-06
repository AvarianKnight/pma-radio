<script lang="ts">
	import {
		maxChannels,
		uiRadioChannel,
		radioEnabled,
		radioVolume,
	} from "../../store/radio";

	import Fa from "svelte-fa";
	import { faPowerOff, faVolumeLow } from "@fortawesome/free-solid-svg-icons";
	import { fly } from "svelte/transition";
	import { getValidatedChannel } from "$utils/validateRadioChannel";

	const onClick = (ev: MouseEvent) => {
		const target: string = (ev.target as any).target;
		if (target === "toggle_radio") {
			radioEnabled.update((val) => {
				return !val;
			});
		}
	};

	$: channel = $uiRadioChannel;

	const handleChange = (ev: any, shouldValidate = false) => {
		// if our length is 0 then just ignore, unless we lost focus or the user
		// submitted, then we should validate
		if (ev.target.value.length === 0 && !shouldValidate) return;
		// this could be a string, parse to be safe
		const value = parseFloat(ev.target.value);
		// >:(
		if (isNaN(value)) return;
		const validated = getValidatedChannel(value);
		$uiRadioChannel = validated;
		if (shouldValidate) {
			channel = validated;
		}
	};
</script>

<area
	on:click={onClick}
	class="radio-button"
	target="toggle_radio"
	alt="toggle radio"
	title="toggle radio"
	coords="154,189,216,254"
	shape="rect"
/>

<!-- unlike other elements, we're not actually bound to the image so we have to "emulate" it to make it feel like we are -->
<div class="screen" transition:fly={{ y: 750, duration: 1000 }}>
	<div class="radio-volume">{$radioVolume}</div>
	<span class="volume-icon">
		<Fa size="sm" icon={faVolumeLow} />
	</span>
	<span class="power-icon">
		<Fa icon={faPowerOff} style={$radioEnabled ? "color: #ff0000" : ""} />
	</span>
	<div class="input-container">
		<input
			bind:value={channel}
			class="radio-input"
			type="number"
			min="0"
			max={$maxChannels}
			on:submit={(ev) => handleChange(ev, true)}
			on:change={(ev) => handleChange(ev)}
			on:focusout={(ev) => handleChange(ev, true)}
		/><span class="indent-span">hz</span>
	</div>
</div>

<!-- <area alt="screen" title="screen" coords="46,336,190,531" shape="rect" /> -->

<style>
	.radio-button {
		cursor: pointer;
	}

	.screen {
		position: absolute;

		/* magic values */
		right: 44px;
		bottom: 220px;

		/* set the screen to be the exact same size */
		height: 200px;
		width: 144px;

		/* set font size */
		font-size: 18px;
		font-family: "E1234";
	}

	.input-container {
		padding-top: 74px;
	}

	.power-icon {
		float: right;
		padding: 4px;
	}

	.volume-icon {
		float: left;
		padding: 1px;
	}

	.radio-volume {
		float: left;
		padding: 4px;
	}

	.indent-span {
		margin-left: -4px;
	}

	input {
		/* set font size */
		font-family: "E1234";
		font-size: 20px;

		border: none;
		outline: 0;
		background-color: transparent;
		/*  just big enough to fit everything :D */
		width: 110px;
	}

	/* disable number input arrows */
	input[type="number"] {
		-moz-appearance: textfield;
		appearance: textfield;
	}

	/* disable number input arrows */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}
</style>
