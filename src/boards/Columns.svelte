<script>
	import { currentUser } from "../store.js";
	import { api } from "../store.js";
	import { decks } from "../store";

	import { clickOutside } from "../functions/clickOutside.js";

	import ColumnsDND from "./ColumnsDND.svelte";

	import { selectedBoard } from "../store";

	export let boardID;
	export let boardI;
	export let deckID;
	export let deckArr;
	let colTitle;
	let enterList = false;
	let input;
	let columnsLoaded = false;
	let colAdjs = [];

	// let newOrder = $decks[deckArr].board[boardI].columns.length + 1;
	// let newOrder = $decks[deckArr].boards.length + 1;

	async function getColumns() {
		const res = await fetch(`${$api}/getColumns`, {
			method: "POST",
			body: JSON.stringify({
				uid: $currentUser.uid,
				did: deckID,
				bid: $selectedBoard.id,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const allColumns = await res.json();
		$decks[deckArr].boards[boardI].columns = allColumns;
		decks.set($decks);
		console.log($decks[deckArr].boards[boardI].columns);
		let col;
		for (col in allColumns) {
			colAdjs.push(false);
		}
		columnsLoaded = true;
	}
	async function newColumn() {
		const res = await fetch(`${$api}/newcolumn`, {
			method: "POST",
			body: JSON.stringify({
				uid: $currentUser.uid,
				did: deckID,
				bid: $selectedBoard.id,
				title: colTitle,
				order: $decks[deckArr].boards[boardI].columns.length,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		$decks[deckArr].boards[boardI].columns.push({
			title: colTitle,
			order: $decks[deckArr].boards[boardI].columns.length,
		});
		decks.set($decks);
		closeInput();
	}
	function openInput() {
		input.focus();
		enterList = true;
		console.log(columnsLoaded);
	}
	function closeInput() {
		enterList = false;
		colTitle = "";
	}
	function openAdj(ind) {
		colAdjs[ind] = !colAdjs[ind];
	}
	getColumns();
</script>

<div class={$selectedBoard.id === boardID ? "columns" : "unselected"}>
	{#if columnsLoaded}
		{#each $decks[deckArr].boards[boardI].columns as column, index}
			<div class="column">
				<div class="column-title">
					<h5>{column.title}</h5>
					<div on:click={() => openAdj(index)} class="column-adj">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="slategrey">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
							/>
						</svg>
					</div>
					<div class={colAdjs[index] == true ? "column-options open" : "column-options closed"}>
						<div class="bubble">
							<p class="options-title">Properties</p>
						</div>
						<div class="col-delete">
							<button class="button-delete">Delete</button>
						</div>
					</div>
				</div>
				<ColumnsDND di={deckArr} bi={boardI} cid={column.id} />
			</div>
		{/each}
	{/if}

	<div class="column">
		<div use:clickOutside on:click_outside={closeInput} class={enterList == true ? " column-title enter" : "column-title display"}>
			<div on:click={openInput} class="add-column">
				<div class="add-icon">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				</div>
				<h5 class="add-title">Add Column</h5>
			</div>
			<form method="post" on:submit|preventDefault={newColumn}>
				<input bind:this={input} bind:value={colTitle} type="text" placeholder="Enter a title" />
				<div class="input-buttons">
					<button class="button" type="submit">Add</button>
					<div on:click={closeInput} class="close-box">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="slategrey">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>

<style>
	.card {
		border-radius: 12px;
		border: 1px solid lightgrey;
		padding: 8px 16px;
		background-color: var(--off-white);
		position: relative;
		cursor: pointer;
	}
	.card:hover {
		border-color: black;
	}
	.card-title {
		font-weight: bold;
		margin-bottom: 16px;
		padding: 8px 0px 4px 0px;
		border-bottom: 1px solid lightgrey;
	}
	/* .custom-shadow-item {
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
	} */
	.columns {
		padding: 16px;
		display: flex;
		align-items: flex-start;
		width: 100%;
		height: 100%;
	}
	.unselected {
		display: none;
	}
	.column:first-of-type {
		margin-left: 0px;
	}
	.column:last-of-type {
		margin-right: 16px;
	}
	.column {
		min-width: 338px;
		margin-left: 16px;
		position: relative;
	}
	.column:hover > .column-title {
		background-color: var(--hv-column);
	}
	.column-title {
		background-color: var(--column);
		border-top-left-radius: 16px;
		border-top-right-radius: 16px;
		height: 60px;
		transition: height 0.2s;
		padding: 16px;
		display: flex;
		justify-content: space-between;
	}
	.column-title:hover {
		background-color: var(--hv-column);
	}
	.column-adj {
		height: 26px;
		border-radius: 50%;
		padding: 2px;
	}
	.column-adj:hover {
		background-color: var(--main-green);
	}
	.column-adj:hover svg {
		stroke: var(--off-white);
	}
	.column-adj svg {
		height: 100%;
	}
	.column-title.enter {
		height: 108px;
		border-bottom-left-radius: 16px;
		border-bottom-right-radius: 16px;
		padding: 0px 16px;
	}
	.column-title.display {
		border-bottom-left-radius: 16px;
		border-bottom-right-radius: 16px;
		padding: 0px 16px;
	}
	.column-options {
		position: absolute;
		z-index: 5;
		left: calc(100% + 24px);
		width: 192px;
	}
	.options-title {
		border-bottom: 1px solid lightgrey;
		padding-bottom: 4px;
		margin-bottom: 8px;
	}
	.column-options .bubble {
		background-color: var(--off-white);
		padding: 8px;
		margin-bottom: 8px;
		width: 100%;
	}
	.column-options.open {
		display: block;
	}
	.column-options.closed {
		display: none;
	}
	.enter .add-column {
		display: none;
	}
	.add-column {
		display: flex;
		align-items: center;
		cursor: pointer;
		height: 60px;
		width: 100%;
		padding: 0px 16px;
	}
	.add-icon svg {
		height: 24px;
		margin: 2px 8px 0px 0px;
	}
	.display form {
		display: none;
	}
	.enter .add-icon,
	.enter .add-title {
		display: none;
	}
	form {
		padding: 16px;
		width: 100%;
	}
	input {
		width: 100%;
		padding: 8px;
		font-family: Roboto;
		font-size: 1em;
		border: 0px;
		border-radius: 4px;
		background-color: var(--less-white);
	}
	.input-buttons {
		display: flex;
		align-items: center;
		margin-top: 8px;
	}
	.close-box:hover svg {
		stroke: black;
	}
	.close-box svg {
		height: 100%;
	}
	.close-box {
		height: 32px;
		cursor: pointer;
		margin-left: 8px;
	}
	button {
		font-size: 0.8em;
		background-color: var(--main-green);
		padding: 8px 16px;
		border: 0px;
		color: white;
		border-radius: 4px;
		cursor: pointer;
	}
	button:hover {
		background-color: var(--hv-green);
	}
</style>
