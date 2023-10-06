<script lang="ts">
    import Radio from "$components/Radio.svelte";

</script>

<main>
	<Radio />
</main>

<style>
	/* disable selecting the radio */
	main {
		user-select: none;
	}
</style>
