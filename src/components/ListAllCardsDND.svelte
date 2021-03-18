<!-- on:click={addToUpdate($decks[arr].id, item.id, item.title, item.content)} -->
<script>
	import { flip } from "svelte/animate";
	import { fly } from "svelte/transition";

	import { dndzone } from "svelte-dnd-action";

	const flipDurationMs = 200;

	let type = "all";
	export let items;

	function handleSort(e) {
		console.log(e.detail.items);
		items = e.detail.items;
	}
</script>

<section use:dndzone={{ items, flipDurationMs, type }} on:consider={handleSort} on:finalize={handleSort}>
	{#each items as item (item.id)}
		<div id={item.id} class="card- card-sh" in:fly={{ y: -33, duration: 200 }} animate:flip={{ duration: flipDurationMs }}>
			<div class="card-title">
				<p class="lato">
					{item.title}
				</p>
			</div>
			<div class="card-content">
				<p>{item.content}</p>
			</div>
		</div>
	{/each}
</section>

<style>
</style>
