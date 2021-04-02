<script>
	import { decks } from "../store.js";
	import { currentUser } from "../store.js";
	import { api } from "../store.js";

	import { modalUpdateDeck } from "../store.js";

	// id, title, content
	export let deck = {};
	export let select;
	export let boards;

	let formTitle = deck.title;
	let confirm = "";

	function setClose() {
		modalUpdateDeck.set(false);
	}

	async function updateDeck() {
		const res = await fetch(`${$api}/updatedeck`, {
			method: "POST",
			body: JSON.stringify({
				uid: $currentUser.uid,
				did: deck.id,
				title: formTitle,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		modalUpdateDeck.set(false);
	}

	async function deleteDeck() {
		if (confirm === deck.title) {
			console.log(boards);
			const res = await fetch(`${$api}/deletedeck`, {
				method: "POST",
				body: JSON.stringify({
					uid: $currentUser.uid,
					did: deck.id,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (select.arr == $decks.findIndex((d) => d.id === deck.id)) {
				select = {
					arr: -1,
					title: "",
					id: "",
				};
			}
			boards.splice(
				$decks.findIndex((d) => d.id === deck.id),
				1
			);
			$decks.splice(
				$decks.findIndex((d) => d.id === deck.id),
				1
			);
			decks.set($decks);
			modalUpdateDeck.set(false);
		}
	}
</script>

<div id="update-deck-box" class={$modalUpdateDeck ? " box open" : "close"}>
	<div id="blackout" on:click={setClose} />
	<div id="update-deck-modal" class="modal">
		<h6>{deck.title}</h6>
		<form method="post" on:submit|preventDefault={updateDeck}>
			<label for="title">Rename</label>
			<input name="title" type="text" bind:value={formTitle} />
			<button type="submit">Submit</button>
		</form>
		<label for="delete-confirm">Please type in the name of the deck to confirm deletion.</label>
		<input name="delete-confirm" type="text" bind:value={confirm} />
		<button class="button-delete" type="button" on:click={deleteDeck}>Delete</button>
		<div id="close-box" on:click={setClose}>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="slategrey">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		</div>
	</div>
</div>

<style>
	.box {
		z-index: 10;
		position: absolute;
		top: 0px;
		left: 0px;
		height: 100%;
		width: 100%;
	}
	.modal {
		position: relative;
		width: 40%;
		background-color: var(--off-white);
		border-radius: 16px;
		padding: 64px;
		z-index: 1;
	}
	#blackout {
		position: absolute;
		top: 0px;
		left: 0px;
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.6);
	}
	#close-box:hover svg {
		stroke: black;
	}
	#close-box {
		position: absolute;
		top: 0px;
		right: 0px;
		height: 32px;
		width: 32px;
		margin: 8px;
		cursor: pointer;
	}
	.open {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.close {
		display: none;
	}
	form {
		display: flex;
		flex-direction: column;
	}
	input {
		padding: 12px 8px;
		margin: 4px 0px;
	}
	label {
		margin-top: 24px;
	}
	button {
		margin-top: 24px;
		font-size: 1.2em;
		background-color: var(--main-green);
		padding: 8px;
		border: 0px;
		color: white;
		border-radius: 4px;
		cursor: pointer;
	}
	button:hover {
		background-color: var(--hv-green);
	}
</style>
