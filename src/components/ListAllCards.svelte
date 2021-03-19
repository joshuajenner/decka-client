<script>
	import { updateCards } from "../store.js";
	import { decks } from "../store";

	import { flip } from "svelte/animate";
	import { fly } from "svelte/transition";

	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from "svelte-dnd-action";

	import { listCards } from "../store";
	import { modalNewCard } from "../store";

	export let arr;
	const flipDurationMs = 200;

	function openNewCardModal() {
		modalNewCard.set(true);
	}
	function addToUpdate(did, id, title, content) {
		$updateCards.push({
			did: did,
			id: id,
			title: title,
			content: content,
		});
		updateCards.set($updateCards);
		console.log($updateCards);
	}

	function handleSort(e) {
		$decks[arr].cards = e.detail.items;
		console.log(e);
	}
	function transformDraggedElement(draggedEl, data, index) {
		draggedEl.style.opacity = 0.7;
	}
</script>

<div id="card-list" class={$listCards ? "open sh" : "close"}>
	<div id="card-list-menu">
		<div class="card-menu-icon">
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="slategrey">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
				/>
			</svg>
		</div>
		<div class="card-menu-icon" on:click={openNewCardModal}>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="slategrey">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		</div>
	</div>
	{#if $decks[arr].cards != undefined}
		<div id="all-cards">
			{#if $decks[arr].cards == undefined}
				<div id="loader" class="center dark"><span /></div>
			{:else}
				{#if $decks[arr].cards.length == 0}
					<p class="lato">No Cards to display.</p>
				{/if}
				<section use:dndzone={{ items: $decks[arr].cards, flipDurationMs, transformDraggedElement }} on:consider={handleSort} on:finalize={handleSort}>
					{#each $decks[arr].cards as item (item.order)}
						<div
							id={item.id}
							class="card"
							in:fly={{ y: -33, duration: 200 }}
							animate:flip={{ duration: flipDurationMs }}
							on:click={addToUpdate($decks[arr].id, item.id, item.title, item.content)}
						>
							<div class="card-title">
								<p class="lato">
									{item.title}
								</p>
							</div>
							<div class="card-content">
								<p>{item.content}</p>
							</div>
							{#if item[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
								<div class="custom-shadow-item">{item.title}</div>
							{/if}
						</div>
					{/each}
				</section>
			{/if}
		</div>
	{/if}
</div>

<style>
	#card-list {
		transition: margin 0.15s;
		border-right: 1px solid lightgrey;
		width: 340px !important;
		z-index: 1;
		background-color: var(--less-white);
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	#card-list.open {
		margin-left: 0px;
	}
	#card-list.close {
		margin-left: -340px;
	}
	#card-list-menu {
		width: 100%;
		height: 60px;
		background-color: var(--off-white);
		border-bottom: 1px solid lightgrey;
		display: flex;
		justify-content: space-between;
	}
	.card-menu-icon {
		width: 44px;
		padding: 16px 8px;
		cursor: pointer;
	}
	.card-menu-icon svg {
		height: 100%;
	}
	.card-menu-icon:hover svg {
		stroke: black;
	}
	#all-cards {
		padding: 8px;
		overflow-y: scroll;
		height: 100%;
	}
	.card {
		border-radius: 12px;
		border: 1px solid lightgrey;
		padding: 8px 16px;
		min-height: 240px;
		background-color: var(--off-white);
		margin-top: -180px;
		position: relative;
		transition: margin 0.2s;
		cursor: pointer;
	}
	.card.sh {
		box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
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
		min-height: 240px;
	}
	.card:first-of-type {
		margin-top: 24px;
	}
	.card:first-of-type:hover {
		margin-top: 0px;
		margin-bottom: 24px;
	}
	.card:hover {
		margin-top: -204px;
		margin-bottom: 24px;
		border-color: black;
	}
	.card-title {
		font-weight: bold;
		margin-bottom: 16px;
		padding: 8px 0px 4px 0px;
		border-bottom: 1px solid lightgrey;
	}
</style>
