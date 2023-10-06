<script lang="ts">
    import { getValidatedChannel } from "$utils/validateRadioChannel";
    import { maxChannels, maxDecimalPlaces, uiRadioChannel } from "../../store/radio";

	const onClick = (ev: MouseEvent) => {
		const target: string = (ev.target as any).target;
		const t = parseInt(target);
		if (isNaN(t)) return;
		uiRadioChannel.update((val) => {
			// nice little hack to append a number instead of add
			let channel = parseFloat("" + val + t)
			return getValidatedChannel(channel, $maxChannels, $maxDecimalPlaces);
		})
	}
</script>

<area
	on:click={onClick}
	class="radio-button"
	target="1"
	alt="1"
	title="1"
	coords="22,622,75,650"
	shape="rect"
/>

<area
	on:click={onClick}
	class="radio-button"
	target="2"
	alt="2"
	title="2"
	coords="91,623,143,649"
	shape="rect"
/>
<area
	on:click={onClick}
	class="radio-button"
	target="3"
	alt="3"
	title="3"
	coords="160,623,212,650"
	shape="rect"
/>
<area
	on:click={onClick}
	class="radio-button"
	target="4"
	alt="4"
	title="4"
	coords="22,652,75,675"
	shape="rect"
/>
<area
	on:click={onClick}
	class="radio-button"
	target="5"
	alt="5"
	title="5"
	coords="91,651,143,675"
	shape="rect"
/>
<area
	on:click={onClick}
	class="radio-button"
	target="6"
	alt="6"
	title="6"
	coords="160,652,212,674"
	shape="rect"
/>
<area
	on:click={onClick}
	class="radio-button"
	target="7"
	alt="7"
	title="7"
	coords="22,677,75,705"
	shape="rect"
/>
<area
	on:click={onClick}
	class="radio-button"
	target="8"
	alt="8"
	title="8"
	coords="91,678,143,703"
	shape="rect"
/>
<area
	on:click={onClick}
	class="radio-button"
	target="9"
	alt="9"
	title="9"
	coords="161,676,212,704"
	shape="rect"
/>

<area
	on:click={onClick}
	class="radio-button"
	target="0"
	alt="0"
	title="0"
	coords="91,705,143,738"
	shape="rect"
/>

<style>
	.radio-button {
		cursor: pointer;
	}
</style>
