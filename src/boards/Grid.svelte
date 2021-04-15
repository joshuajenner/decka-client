<script>
	import { currentUser } from "../store.js";
	import { api } from "../store.js";
	import { decks } from "../store";
	import { selectedBoard } from "../store";

	import { flip } from "svelte/animate";
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from "svelte-dnd-action";
	import { clickOutside } from "../functions/clickOutside.js";
	import { modalError } from "../store";

	export let boardID;
	export let boardI;
	export let deckID;
	export let deckArr;
	const flipDurationMs = 200;

	let cardsLoaded = false;

	let updateModal = false;
	let modalI = 0;
	let modalTitle = "";
	let modalContent = "";

	async function getGridCards() {
		try {
			const res = await fetch(`${$api}/getgridcards`, {
				method: "POST",
				body: JSON.stringify({
					uid: $currentUser.uid,
					did: deckID,
					bid: boardID,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const cards = await res.json();
			let card = 0;
			$decks[deckArr].boards[boardI].cards = [];
			console.log($decks[deckArr].boards[boardI].cards);
			for (card in cards) {
				$decks[deckArr].boards[boardI].cards.push(cards[card]);
			}
			cardsLoaded = true;
		} catch (e) {
			modalError.set({
				check: true,
				msg: e,
			});
		}
	}
	async function updateGridCards() {
		try {
			const res = await fetch(`${$api}/updategridcards`, {
				method: "POST",
				body: JSON.stringify({
					uid: $currentUser.uid,
					did: deckID,
					bid: boardID,
					cards: $decks[deckArr].boards[boardI].cards,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
		} catch (e) {
			modalError.set({
				check: true,
				msg: e,
			});
		}
	}

	function deleteCard() {
		$decks[deckArr].boards[boardI].cards.splice(modalI, 1);
		decks.set($decks);
		updateModal = false;
		updateGridCards();
	}
	function updateCard() {
		$decks[deckArr].boards[boardI].cards[modalI].title = modalTitle;
		$decks[deckArr].boards[boardI].cards[modalI].content = modalContent;
		updateModal = false;
		updateGridCards();
	}
	function closeModal() {
		updateModal = false;
	}
	function openUpdate(id, title, content) {
		updateModal = true;
		modalI = id;
		modalTitle = title;
		modalContent = content;
	}
	function transformDraggedElement(draggedEl, data, index) {
		draggedEl.style.opacity = 0.7;
	}
	function handleSort(e) {
		$decks[deckArr].boards[boardI].cards = e.detail.items;
	}
	function handleFinalize(e) {
		$decks[deckArr].boards[boardI].cards = e.detail.items;
		updateGridCards();
	}

	getGridCards();
</script>

<div class={$selectedBoard.id === boardID ? "grid" : "unselected"}>
	{#if cardsLoaded}
		<section
			class={$decks[deckArr].boards[boardI].cards.length > 0 ? "" : "empty"}
			use:dndzone={{ items: $decks[deckArr].boards[boardI].cards, flipDurationMs, transformDraggedElement, type: "cards" }}
			on:consider={(e) => handleSort(e)}
			on:finalize={(e) => handleFinalize(e)}
		>
			{#each $decks[deckArr].boards[boardI].cards as card, index (card.dnd)}
				<div on:click={openUpdate(index, card.title, card.content)} id={card.id} class="card sh" animate:flip={{ duration: flipDurationMs }}>
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
	{/if}
</div>
<div class={updateModal ? "grid-modal" : "modal-closed"}>
	<div use:clickOutside on:click_outside={closeModal} class="update-card">
		<form on:submit|preventDefault={updateCard}>
			<div class="update-title">
				<input name="title" type="text" bind:value={modalTitle} />
			</div>
			<div class="update-content">
				<textarea name="cotent" bind:value={modalContent} />
			</div>
			<button class="button" type="submit">Update</button>
		</form>
		<button on:click={deleteCard} class="button-delete">Delete</button>
	</div>
</div>

<style>
	section.empty {
		position: relative;
	}
	section.empty:after {
		content: "There are no cards to display.";
		position: absolute;
		color: slategrey;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.modal-closed {
		display: none;
	}
	.grid-modal {
		padding: 16px;
		display: flex;
		position: absolute;
		top: 0px;
		left: 0px;
		z-index: 15;
		height: 100vh;
		width: 100vw;
		background-color: rgba(0, 0, 0, 0.3);
		justify-content: center;
		align-items: flex-start;
	}
	form {
		position: relative;
	}
	.update-card {
		border-radius: 12px;
		border: 1px solid lightgrey;
		padding: 8px 16px 16px 16px;
		min-height: 240px;
		max-height: 360px;
		width: 300px;
		background-color: var(--off-white);
		margin-left: 8px;
		margin-top: 32px;
		position: relative;
	}
	.update-card:first-of-type {
		margin-left: 0px;
	}
	input {
		border: 0px;
		background-color: none;
		font-size: 1em;
		width: 100%;
	}
	input:focus {
		outline: 0px;
		background-color: var(--hv-white);
	}
	.update-content {
		height: 240px;
	}
	.update-title {
		margin-bottom: 16px;
		padding: 8px 0px 4px 0px;
		border-bottom: 1px solid lightgrey;
	}
	.update-title input {
		font-family: Lato;
		font-weight: bold;
	}
	button {
		margin-top: 24px;
		font-size: 1em;
		background-color: var(--main-green);
		padding: 8px;
		border: 0px;
		color: white;
		border-radius: 4px;
		cursor: pointer;
		position: absolute;
		bottom: 0px;
		right: 0px;
	}
	button:hover {
		background-color: var(--hv-green);
	}
	.button-delete {
		position: absolute;
		bottom: 16px;
		right: 96px;
	}
	.grid {
		height: 100%;
		width: 100%;
		padding: 16px;
	}
	.grid section {
		min-height: 248px;
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		border-radius: 12px;
	}
	.grid section:focus {
		outline: 0px;
	}
	.unselected {
		display: none;
	}
	.card {
		border-radius: 12px;
		border: 1px solid lightgrey;
		padding: 8px 16px;
		background-color: var(--off-white);
		position: relative;
		cursor: pointer;
		margin: 4px;
		width: 280px;
		height: 240px;
	}
	.sh {
		box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
	}
	.card:hover {
		border-color: black;
	}
	.card-title {
		font-weight: bold;
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
