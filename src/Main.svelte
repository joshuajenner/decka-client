<script>
	import { currentUser } from "./store.js";
	import { decks } from "./store";
	import { api } from "./store.js";
	import { selectedBoard } from "./store.js";

	import { listAny } from "./store";
	import { listDecks } from "./store";
	import { listCards } from "./store";

	import { modalUpdateDeck } from "./store";
	import { modalNewDeck } from "./store";
	import { modalError } from "./store";

	import NavTop from "./components/NavTop.svelte";
	import NavSide from "./components/NavSide.svelte";

	import UpdateDeckModal from "./components/UpdateDeckModal.svelte";
	import NewDeckModal from "./components/NewDeckModal.svelte";

	import NewBoardModal from "./components/NewBoardModal.svelte";

	import UpdateCardModal from "./components/UpdateCardModal.svelte";
	import NewCardModal from "./components/NewCardModal.svelte";
	import ListAllCards from "./components/ListAllCards.svelte";

	import Grid from "./boards/Grid.svelte";
	import Columns from "./boards/Columns.svelte";
	import Free from "./boards/Free.svelte";
	import Calendar from "./boards/Calendar.svelte";

	let selectedDeck = {
		arr: -1,
		title: "",
		id: "",
	};
	let modalDeck = {
		title: "",
		id: "",
	};
	let boardsLoaded = [];

	async function getDecks() {
		try {
			const res = await fetch(`${$api}/getdecks`, {
				method: "POST",
				body: JSON.stringify({
					uid: $currentUser.uid,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});

			const allDecks = await res.json();
			setBoardsStatus(allDecks.length);
			$decks = allDecks;
		} catch (e) {
			modalError.set({
				check: true,
				msg: e,
			});
		}
	}
	async function getDeckBoards(deckID) {
		try {
			const res = await fetch(`${$api}/getdeckboards`, {
				method: "POST",
				body: JSON.stringify({
					uid: $currentUser.uid,
					did: deckID,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const allData = await res.json();
			if (allData.length > 0) {
				$decks[$decks.findIndex((deck) => deck.id === deckID)].boards = allData;
				selectedBoard.set({
					id: allData[0].id,
					i: 0,
				});
			} else {
				$decks[$decks.findIndex((deck) => deck.id === deckID)].boards = [];
			}
			boardsLoaded[selectedDeck.arr] = true;
			decks.set($decks);
		} catch (e) {
			modalError.set({
				check: true,
				msg: e,
			});
		}
	}
	async function getDeckCards(deckID) {
		try {
			const res = await fetch(`${$api}/getdeckcards`, {
				method: "POST",
				body: JSON.stringify({
					uid: $currentUser.uid,
					did: deckID,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const allData = await res.json();
			$decks[$decks.findIndex((deck) => deck.id === deckID)].cards = allData;
			console.log(allData);
		} catch (e) {
			modalError.set({
				check: true,
				msg: e,
			});
		}
	}
	function selectDeck(id, name) {
		selectedDeck = {
			arr: $decks.findIndex((deck) => deck.id === id),
			id: id,
			title: name,
		};
		toggleDeckList();
		listCards.set(true);
		getDeckCards(id);
		if (!boardsLoaded[selectedDeck.arr]) {
			getDeckBoards(id);
		} else {
			selectedBoard.set({
				id: $decks[selectedDeck.arr].boards[0].id,
				i: 0,
			});
		}
	}
	function checkListsOpen() {
		if ($listDecks || $listCards) {
			listAny.set(true);
		} else {
			listAny.set(false);
		}
	}

	function toggleDeckList() {
		listDecks.set(!$listDecks);

		checkListsOpen();
	}
	function openUpdateDeckModal(gid, gtitle) {
		modalDeck = {
			id: gid,
			title: gtitle,
		};
		modalUpdateDeck.set(true);
	}
	function openNewDeckModal() {
		modalNewDeck.set(true);
	}
	function setBoardsStatus(l) {
		for (let i = 0; i < l; i++) {
			boardsLoaded.push(false);
		}
	}
	function closeError() {
		modalError.set({
			check: false,
			msg: "",
		});
	}
	getDecks();
</script>

<svelte:head>
	{#if selectedDeck.title != ""}
		<title>{selectedDeck.title} - Decka</title>
	{:else}
		<title>Decka</title>
	{/if}
</svelte:head>

<main>
	<NavTop bind:navDeck={selectedDeck} bind:boardStatus={boardsLoaded} />
	<div id="decka">
		<NavSide />
		<div id="deck-info" class={$listDecks ? "open" : "close"}>
			<div id="all-lists" class="sh">
				<div id="deck-list">
					<div id="all-decks">
						{#if $decks == {}}
							<p>No decks to display.</p>
						{:else}
							{#each $decks as deckItem (deckItem.id)}
								<div id={deckItem.id} class="deck-item p">
									<h6 on:click={selectDeck(deckItem.id, deckItem.data.title)}>
										{deckItem.data.title}
									</h6>
									<!-- <p>{deckItem.data.content}</p> -->
									<div class="deck-cog" on:click={openUpdateDeckModal(deckItem.id, deckItem.data.title)}>
										<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="lightgrey">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
											/>
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
									</div>
								</div>
							{/each}
						{/if}
					</div>
					<div id="new-deck" class="p" on:click={openNewDeckModal}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="slategrey">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<p>new Deck</p>
					</div>
				</div>
				{#if selectedDeck.id != ""}
					<ListAllCards bind:arr={selectedDeck.arr} />
				{/if}
			</div>
			<UpdateCardModal bind:arr={selectedDeck.arr} />
		</div>
		<div id="board">
			{#if selectedDeck.arr != -1}
				{#if boardsLoaded[selectedDeck.arr] == true}
					{#each $decks[selectedDeck.arr].boards as board, index}
						{#if board.type == 0}
							<Grid bind:boardID={board.id} boardI={index} bind:deckID={selectedDeck.id} bind:deckArr={selectedDeck.arr} />
						{:else if board.type == 1}
							<Columns bind:boardID={board.id} boardI={index} bind:deckID={selectedDeck.id} bind:deckArr={selectedDeck.arr} />
						{:else if board.type == 2}
							<Free bind:boardID={board.id} boardI={index} bind:deckID={selectedDeck.id} bind:deckArr={selectedDeck.arr} />
						{:else if board.type == 3}
							<Calendar bind:boardID={board.id} boardI={index} bind:deckID={selectedDeck.id} bind:deckArr={selectedDeck.arr} />
						{/if}
					{/each}
				{/if}
			{/if}
		</div>
	</div>
	<NewCardModal bind:deck={selectedDeck} />
	<NewBoardModal bind:deckID={selectedDeck.id} />
	<UpdateDeckModal bind:deck={modalDeck} bind:select={selectedDeck} bind:boards={boardsLoaded} />
	<NewDeckModal />

	<div id="error-modal" class={$modalError.check ? "modal-error" : ""}>
		<div class="close-box" on:click={closeError}>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="slategrey">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		</div>
		<h1>Error</h1>
		<p>Something went wrong. Please refresh the app and try again.</p>
		<p class="error-e">{$modalError.msg}</p>
	</div>
	<div on:click={closeError} class={$modalError.check ? "blackout" : "off"} />
</main>

<style>
	#error-modal {
		position: absolute;
		display: none;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -125%);
	}
	#error-modal.modal-error {
		display: block;
		margin: auto;
		padding: 16px 32px 48px 32px;
		border-radius: 16px;
		border: 1px solid lightgrey;
		background-color: var(--less-white);
		z-index: 10;
	}
	.error-e {
		color: red;
	}
	#error-modal.modal-error p {
		margin-top: 32px;
	}
	.close-box:hover svg {
		stroke: black;
	}
	.close-box {
		position: absolute;
		top: 0px;
		right: 0px;
		height: 32px;
		width: 32px;
		margin: 8px;
		cursor: pointer;
	}
	.blackout {
		position: absolute;
		top: 0px;
		bottom: 0px;
		height: 100vh;
		width: 100vw;
		display: block;
		background-color: rgba(0, 0, 0, 0.7);
		z-index: 9;
	}
	.off {
		display: none;
	}
	main {
		flex-direction: column;
		display: flex;
	}
	#decka {
		height: 100%;
		position: relative;
		display: flex;
		margin-top: 64px;
	}
	#all-lists {
		display: flex;
	}
	#deck-list {
		height: 100%;
		width: 300px;
		border-right: 1px solid lightgrey;
		background-color: var(--less-white);
		z-index: 2;
	}
	#deck-info {
		z-index: 2;
		display: flex;
		height: 100%;
		transition: margin-left 0.15s;
	}
	#deck-info.open {
		margin-left: 0px;
	}
	#deck-info.close {
		margin-left: -300px;
	}
	.deck-item {
		height: 60px;
		border-bottom: 1px solid lightgrey;
		display: flex;
		justify-content: space-between;
	}
	.deck-item:hover {
		background-color: var(--hv-white);
	}
	.deck-item:hover h6 {
		padding: 0px 28px;
	}
	.deck-item h6 {
		display: block;
		line-height: 60px;
		padding: 0px 24px;
		transition: padding 0.2s;
		flex-grow: 1;
	}
	.deck-cog {
		width: 60px;
		height: 100%;
		padding: 16px 24px 16px 8px;
	}
	.deck-cog:hover svg {
		stroke: slategrey;
	}
	#new-deck {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 16px;
		height: 60px;
		color: slategrey;
	}
	#new-deck svg {
		height: 100%;
		margin-right: 4px;
	}
	#new-deck:hover,
	#new-deck:hover svg {
		color: #eda700;
		stroke: #eda700;
	}
	#board {
		flex-grow: 1;
		overflow: scroll;
	}
</style>
