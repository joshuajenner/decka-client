<script>
	import { decks } from "../store";

	import { flip } from "svelte/animate";
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from "svelte-dnd-action";

	export let di;
	export let bi;
	export let cid;
	export let ci;

	const flipDurationMs = 300;

	function handleSort(e) {
		$decks[di].boards[bi].columns[ci].cards = e.detail.items;
	}

	function transformDraggedElement(draggedEl, data, index) {
		draggedEl.style.opacity = 0.7;
	}
	ci = $decks[di].boards[bi].columns.findIndex((c) => c.id === cid);
</script>

<section class="column-body" use:dndzone={{ items: $decks[di].boards[bi].columns[ci].cards, flipDurationMs, transformDraggedElement }} on:consider={handleSort} on:finalize={handleSort}>
	{#each $decks[di].boards[bi].columns[ci].cards as card (card.order)}
		<div id={card.id} class="card" animate:flip={{ duration: flipDurationMs }}>
			<div class="card-title lato">
				<p>{card.title}</p>
			</div>
			<div class="card-body">
				<p>{card.content}</p>
			</div>
			{#if card[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
				<div class="custom-shadow-item">{card.title}</div>
			{/if}
		</div>
	{/each}
</section>

<style>
	.column-body {
		border-bottom-left-radius: 16px;
		border-bottom-right-radius: 16px;
		background-color: var(--column);
		padding: 16px;
		min-height: 64px;
	}
	.column-body:hover {
		background-color: var(--hv-column);
	}
	.card {
		border-radius: 12px;
		border: 1px solid lightgrey;
		padding: 8px 16px;
		background-color: var(--off-white);
		position: relative;
		cursor: pointer;
	}
	.card-title {
		padding: 4px 0px 8px 0px;
		border-bottom: 1px solid lightgray;
		margin-bottom: 8px;
		font-weight: bold;
	}
	.custom-shadow-item {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		visibility: visible;
		background: var(--main-green);
		opacity: 0.5;
		margin: 0;
		border-radius: 12px;
		border: 1px solid lightgrey;
		padding: 8px 16px;
	}
</style>
