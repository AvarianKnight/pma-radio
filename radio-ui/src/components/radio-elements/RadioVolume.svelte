<script lang="ts">
	import { radioVolume } from "../../store/radio";

	const onClick = (ev: MouseEvent) => {
		const target: string = (ev.target as any).target;
		const isVolumeUp = target === "volume_up" ? true : false;

		radioVolume.update((val) => {
			let vol = val + (isVolumeUp ? 10 : -10);
			// clamp the max volume to 100
			if (vol > 100) {
				vol = 100;
			} else if (vol <= 0) {
				// clamp the min volume to 1.
				vol = 1;
			}
			return vol;
		});
	};
</script>

<area
	on:click={onClick}
	class="radio-button"
	target="volume_up"
	alt="volume up"
	title="volume up"
	coords="192,319,214,399"
	shape="rect"
/>
<area
	on:click={onClick}
	class="radio-button"
	target="volume_down"
	alt="volume down"
	title="volume down"
	coords="192,449,215,534"
	shape="rect"
/>

<style>
	.radio-button {
		cursor: pointer;
	}
</style>
