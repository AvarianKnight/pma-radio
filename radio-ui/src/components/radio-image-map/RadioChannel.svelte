<script lang="ts">
    import { getValidatedChannel } from "$utils/validateRadioChannel";
    import { maxChannels, maxDecimalPlaces, uiRadioChannel } from "../../store/radio";

	const onClick = (ev: MouseEvent) => {
		const target: string = (ev.target as any).target;
		const isChannelUp = target === "radio_channel_up" ? true : false;
		uiRadioChannel.update((chan) => {
			const channel = chan + (isChannelUp ? 1 : -1);
			return getValidatedChannel(channel, $maxChannels, $maxDecimalPlaces);
		})
	}
</script>

<area
	on:click={onClick}
	class="radio-button"
	target="radio_channel_up"
	alt="radio channel up"
	title="radio channel up"
	coords="23,312,44,395"
	shape="rect"
/>
<area
	on:click={onClick}
	class="radio-button"
	target="radio_channel_down"
	alt="radio channel down"
	title="radio channel down"
	coords="22,441,44,532"
	shape="rect"
/>

<style>
	.radio-button {
		cursor: pointer;
	}
</style>
