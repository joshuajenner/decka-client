<script>
	import { decks } from "../store.js";
	import { currentUser } from "../store.js";
	import { api } from "../store.js";
	import { selectedBoard } from "../store.js";
	import { modalNewBoard } from "../store";
	import { modalError } from "../store";

	export let deckID;
	let formTitle;
	let formType;

	async function newBoard() {
		try {
			const res = await fetch(`${$api}/newboard`, {
				method: "POST",
				body: JSON.stringify({
					uid: $currentUser.uid,
					did: deckID,
					title: formTitle,
					type: formType,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const allData = await res.json();
			$decks[$decks.findIndex((deck) => deck.id === deckID)].boards.push(allData);
			selectedBoard.set({
				id: allData.id,
				i: 0,
			});
			decks.set($decks);
			setClose();
		} catch (e) {
			setClose();
			modalError.set({
				check: true,
				msg: e,
			});
		}
	}
	function setClose() {
		modalNewBoard.set(false);
	}
</script>

<div id="new-board-box" class={$modalNewBoard ? "open" : "close"}>
	<div id="blackout" on:click={setClose} />
	<div id="new-board">
		<form method="post" on:submit|preventDefault={newBoard}>
			<label for="title">Title</label>
			<input name="title" type="text" bind:value={formTitle} />
			<label for="title">Type</label>
			<label>
				<input type="radio" bind:group={formType} value={0} />
				Grid
			</label>
			<label>
				<input type="radio" bind:group={formType} value={1} />
				Columns
			</label>
			<label>
				<input type="radio" bind:group={formType} value={2} />
				Free
			</label>
			<!-- <label>
				<input type="radio" bind:group={formType} value={3} />
				Calendar
			</label> -->
			<button type="submit">Submit</button>
		</form>
		<div id="close-box" on:click={setClose}>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="slategrey">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
		</div>
	</div>
</div>

<style>
	#new-board-box {
		z-index: 10;
		position: absolute;
		top: 0px;
		left: 0px;
		height: 100%;
		width: 100%;
	}
	#blackout {
		position: absolute;
		top: 0px;
		left: 0px;
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.6);
	}
	#new-board {
		position: relative;
		width: 40%;
		background-color: var(--off-white);
		border-radius: 16px;
		padding: 64px;
		z-index: 1;
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
