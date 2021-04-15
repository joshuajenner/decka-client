<script>
	import { onMount } from "svelte";
	import { currentUser } from "../store.js";
	import { api } from "../store.js";
	import { decks } from "../store";
	import { selectedBoard } from "../store";

	import { flip } from "svelte/animate";
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME, TRIGGERS } from "svelte-dnd-action";
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

	let itemPosition = { x: 0, y: 0 };

	let draggedElement;

	let dragCardI;

	// called through transformDraggedElement
	function setDraggedElement(element, data, index) {
		draggedElement = element;
	}

	function handleMouseMove(e) {
		if (draggedElement !== undefined) {
			const dropZone = document.getElementById(boardID);
			// let positionInDropZone = getPositionIn(draggedElement, dropZone);
			// console.clear();
			// console.log(JSON.stringify(positionInDropZone));
			// itemPosition = getPositionIn(draggedElement, dropZone);
			itemPosition = { x: e.clientX - 120, y: e.clientY - 180 };
		}
	}
	onMount(() => {
		window.addEventListener("mousemove", handleMouseMove);
		return function cleanup() {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	});

	function getPositionIn(element, element2) {
		let { x: elX, y: elY } = element.getBoundingClientRect();
		let { x: el2X, y: el2Y } = element2.getBoundingClientRect();
		return {
			x: elX - el2X,
			y: elY - el2Y,
		};
	}
	async function getFreeCards() {
		try {
			const res = await fetch(`${$api}/getfreecards`, {
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
	async function updateFreeCards() {
		try {
			const res = await fetch(`${$api}/updatefreecards`, {
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
		updateFreeCards();
	}
	function updateCard() {
		$decks[deckArr].boards[boardI].cards[modalI].title = modalTitle;
		$decks[deckArr].boards[boardI].cards[modalI].content = modalContent;
		updateModal = false;
		updateFreeCards();
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
	function handleDragStart(i) {
		dragCardI = i;
		console.log(dragCardI);
	}
	function handleSort(e) {
		$decks[deckArr].boards[boardI].cards = e.detail.items;
	}
	function handleFinalize(e) {
		let ti = e.detail.items.findIndex((c) => c.dnd === e.detail.info.id);
		if (ti != -1) {
			e.detail.items[ti].xval = itemPosition.x;
			e.detail.items[ti].yval = itemPosition.y;
			$decks[deckArr].boards[boardI].cards = e.detail.items;
		}
		updateFreeCards();
	}
	getFreeCards();
	// on:mousemove={handleMouseMove} || itemPosition.y || 0  || itemPosition.x || 0 					animate:flip={{ duration: flipDurationMs }}
</script>

<div class={$selectedBoard.id === boardID ? "free" : "unselected"}>
	{#if cardsLoaded}
		<section
			id={boardID}
			class={$decks[deckArr].boards[boardI].cards.length > 0 ? "" : "empty"}
			use:dndzone={{ items: $decks[deckArr].boards[boardI].cards, flipDurationMs, transformDraggedElement: setDraggedElement, type: "cards" }}
			on:consider={(e) => handleSort(e)}
			on:finalize={(e) => handleFinalize(e)}
		>
			{#each $decks[deckArr].boards[boardI].cards as card, index (card.dnd)}
				<div style="top: {card.yval}px; left: {card.xval}px " on:click={openUpdate(index, card.title, card.content)} on:mousedown={handleDragStart(index)} id={card.id} class="card sh">
					<div class="card-title lato">
						<p>{card.title}</p>
					</div>
					<div class="card-body">
						<p>{card.content}</p>
					</div>
					<!-- {#if card[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
						<div class="custom-shadow-item">{card.title}</div>
					{/if} -->
				</div>
			{/each}
		</section>
	{/if}
</div>
<div class={updateModal ? "free-modal" : "modal-closed"}>
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
	section {
		/* position: relative; */
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
	.free-modal {
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
	.free {
		height: 100%;
		width: 100%;
		padding: 16px;
	}
	.free section {
		height: 100%;
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		border-radius: 12px;
	}
	.free section:focus {
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
		position: absolute;
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
