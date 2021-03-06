<script>
	import { currentUser } from "./store.js";
	import { api } from "./store.js";

	import { fly } from "svelte/transition";

	let selectedDeck = {
		title: "",
	};
	let deckList = [];
	let listOpen = true;

	async function newDeck() {
		const res = await fetch(`${$api}/newdeck`, {
			method: "POST",
			body: JSON.stringify({
				uid: $currentUser.uid,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
	async function getDecks() {
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
		console.log(allDecks);
		deckList = allDecks;
	}

	function selectDeck(id, name) {
		selectedDeck = {
			id: id,
			title: name,
		};
	}
	function toggleList() {
		listOpen = !listOpen;
	}
	getDecks();
</script>

<nav class="sh">
	{#key selectedDeck}
		<div id="nav-deck" in:fly={{ y: 200, duration: 200 }}>
			<h5>{selectedDeck.title}</h5>
		</div>
	{/key}
</nav>
<div id="decka">
	<div id="deck-list" class="sh open">
		<div id="all-decks">
			{#if deckList == []}
				<p>No decks to display.</p>
			{:else}
				{#each deckList as deckItem (deckItem.id)}
					<div
						id={deckItem.id}
						class="deck-item"
						on:click={selectDeck(deckItem.id, deckItem.data.title)}
					>
						<h6>{deckItem.data.title}</h6>
						<!-- <p>{deckItem.data.content}</p> -->
					</div>
				{/each}
			{/if}
		</div>
		<div id="list-button" on:click={toggleList}>
			{#if listOpen}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
						clip-rule="evenodd"
					/>
				</svg>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
						clip-rule="evenodd"
					/>
				</svg>
			{/if}
		</div>
	</div>
</div>

<style>
	nav {
		color: var(--off-white);
		width: 100%;
		height: 60px;
		background-color: var(--main-green);
		border-bottom: 1px solid #252525;
		padding: 0px 24px;
		overflow: hidden;
	}
	#nav-deck {
		height: 60px;
		display: flex;
		align-items: center;
	}
	#decka {
		height: 100%;
		position: relative;
	}
	#deck-list {
		height: 100%;
		position: absolute;
	}
	.open {
		width: 300px;
	}
	.close {
		width: 0px;
	}
	#list-button {
		position: absolute;
		right: 0px;
		top: 50%;
		transform: translate(100%, -50%);
		height: 96px;
		width: 48px;
		padding: 8px;
		display: flex;
		align-items: center;
	}
	.deck-item {
		padding: 16px 24px;
		border-bottom: 1px solid lightgrey;
	}
</style>
