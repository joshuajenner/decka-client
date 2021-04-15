<script>
	import { currentUser } from "../store.js";
	import { api } from "../store.js";
	import { decks } from "../store";

	import { flip } from "svelte/animate";
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from "svelte-dnd-action";
	import { clickOutside } from "../functions/clickOutside.js";
	import { modalError } from "../store";

	import { selectedBoard } from "../store";

	export let boardID;
	export let boardI;
	export let deckID;
	export let deckArr;
	const flipDurationMs = 200;
	let colTitle;
	let enterList = false;
	let input;
	let columnsLoaded = false;
	let colAdjs = [];
	let keepCards = true;
	let displayDelete = false;
	let updateModal = false;
	let modalTitle = "";
	let modalContent = "";
	let modalColID = 0;
	let modalColI = 0;
	let modalCardID = "";

	// let newOrder = $decks[deckArr].board[boardI].columns.length + 1;
	// let newOrder = $decks[deckArr].boards.length + 1;

	async function getColumns() {
		try {
			const res = await fetch(`${$api}/getcolumns`, {
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
			const allColumns = await res.json();
			$decks[deckArr].boards[boardI].columns = allColumns;
			decks.set($decks);
			let col;
			for (col in allColumns) {
				colAdjs.push(false);
			}
			columnsLoaded = true;
		} catch (e) {
			modalError.set({
				check: true,
				msg: e,
			});
		}
	}
	async function newColumn() {
		try {
			let dndID = Math.floor(Math.random() * 90000) + 10000;
			const res = await fetch(`${$api}/newcolumn`, {
				method: "POST",
				body: JSON.stringify({
					uid: $currentUser.uid,
					did: deckID,
					bid: boardID,
					title: colTitle,
					dnd: dndID,
					order: $decks[deckArr].boards[boardI].columns.length + 10,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			let colID = await res.json();
			$decks[deckArr].boards[boardI].columns.push({
				id: colID.id,
				title: colTitle,
				order: $decks[deckArr].boards[boardI].columns.length + 10,
				cards: [],
				dnd: dndID,
			});
			$decks[deckArr].boards[boardI].columns = $decks[deckArr].boards[boardI].columns;
			decks.set($decks);
			closeInput();
		} catch (e) {
			closeInput();
			modalError.set({
				check: true,
				msg: e,
			});
		}
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
	async function renameColumn(id, i) {
		try {
			const res = await fetch(`${$api}/renamecolumn`, {
				method: "POST",
				body: JSON.stringify({
					uid: $currentUser.uid,
					did: deckID,
					bid: boardID,
					cid: id,
					title: $decks[deckArr].boards[boardI].columns[i].title,
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
	async function deleteColumn(id, i) {
		try {
			const res = await fetch(`${$api}/deletecolumn`, {
				method: "POST",
				body: JSON.stringify({
					uid: $currentUser.uid,
					did: deckID,
					bid: boardID,
					cid: id,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			$decks[deckArr].boards[boardI].columns.splice(i, 1);
			decks.set($decks);
		} catch (e) {
			modalError.set({
				check: true,
				msg: e,
			});
		}
	}
	async function updateColumnCards(id, i) {
		try {
			const res = await fetch(`${$api}/updatecolumncards`, {
				method: "POST",
				body: JSON.stringify({
					uid: $currentUser.uid,
					did: deckID,
					bid: boardID,
					cid: id,
					cards: $decks[deckArr].boards[boardI].columns[i].cards,
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
	async function reorderColumns() {
		try {
			const res = await fetch(`${$api}/reordercolumns`, {
				method: "POST",
				body: JSON.stringify({
					uid: $currentUser.uid,
					did: deckID,
					bid: boardID,
					cols: $decks[deckArr].boards[boardI].columns,
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
	function updateCard() {
		let tempIndex = $decks[deckArr].boards[boardI].columns[modalColI].cards.findIndex((x) => x.id === modalCardID);
		$decks[deckArr].boards[boardI].columns[modalColI].cards[tempIndex].title = modalTitle;
		$decks[deckArr].boards[boardI].columns[modalColI].cards[tempIndex].content = modalContent;
		decks.set($decks);
		closeModal();
		updateColumnCards(modalColID, modalColI);
	}

	function deleteCard() {
		$decks[deckArr].boards[boardI].columns[modalColI].cards.splice($decks[deckArr].boards[boardI].columns[modalColI].cards.indexOf(modalCardID), 1);
		decks.set($decks);
		closeModal();
		updateColumnCards(modalColID, modalColI);
	}

	function openUpdate(colID, colI, cardID, title, content) {
		updateModal = true;
		modalTitle = title;
		modalContent = content;
		modalColID = colID;
		modalColI = colI;
		modalCardID = cardID;
	}
	function closeModal() {
		updateModal = false;
	}
	function transformDraggedElement(draggedEl, data, index) {
		draggedEl.style.opacity = 0.7;
	}
	function handleDndConsiderColumns(e) {
		$decks[deckArr].boards[boardI].columns = e.detail.items;
	}
	function handleDndFinalizeColumns(e) {
		$decks[deckArr].boards[boardI].columns = e.detail.items;
		reorderColumns();
	}
	function handleSort(ci, cid, e) {
		$decks[deckArr].boards[boardI].columns[ci].cards = e.detail.items;
	}
	function handleFinalize(ci, cid, e) {
		updateColumnCards(cid, ci);
		$decks[deckArr].boards[boardI].columns[ci].cards = e.detail.items;
	}
	getColumns();
</script>

<div class={$selectedBoard.id === boardID ? "columns" : "unselected"}>
	{#if columnsLoaded}
		<section
			class="columns-dnd"
			use:dndzone={{ items: $decks[deckArr].boards[boardI].columns, flipDurationMs, type: "columns" }}
			on:consider={handleDndConsiderColumns}
			on:finalize={handleDndFinalizeColumns}
		>
			{#each $decks[deckArr].boards[boardI].columns as column, index (column.dnd)}
				<div class="column" animate:flip={{ duration: flipDurationMs }}>
					<div class="column-title">
						<form method="post" on:submit|preventDefault={renameColumn(column.id, index)}>
							<input type="text" name="colTitle" bind:value={column.title} on:blur={renameColumn(column.id, index)} />
						</form>
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
							<!-- <div class="bubble">
								<p class="options-title">Properties</p>
							</div> -->
							<div on:click={deleteColumn(column.id, index)} class="col-delete">
								<button class="button-delete">Delete</button>
							</div>
						</div>
					</div>
					<section
						class="column-body"
						use:dndzone={{ items: column.cards, flipDurationMs, transformDraggedElement, type: "cards" }}
						on:consider={(e) => handleSort(index, column.id, e)}
						on:finalize={(e) => handleFinalize(index, column.id, e)}
					>
						{#each column.cards as card (card.dnd)}
							<div on:click={openUpdate(column.id, index, card.id, card.title, card.content)} id={card.id} class="card" animate:flip={{ duration: flipDurationMs }}>
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
				</div>
			{/each}
		</section>
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
	<!-- <div class={displayDelete == true ? "del-mdl" : "del-mdl closed"}>
		<div class="blackout" />
		<div class="modal">
			<form method="post" on:submit|preventDefault={deleteColumn}>
				<p>Would you like to move the cards in the column?</p>
				<label>
					<input type="checkbox" bind:checked={keepCards} />
					Yes, please keep the cards.
				</label>
			</form>
		</div>
	</div> -->
</div>
<div class={updateModal ? "columns-modal" : "modal-closed"}>
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
	.modal-closed {
		display: none;
	}
	.columns-modal {
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
		bottom: 14px;
		right: 96px;
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
	.columns-dnd {
		display: flex;
		align-items: flex-start;
		height: 100%;
		max-height: 900px;
	}
	.columns-dnd:focus {
		outline: 0px;
	}
	.column-title form {
		padding: 0px;
		margin-right: 4px;
	}
	.column-title input {
		background-color: transparent;
		font-family: "Recursive";
		font-size: 1.25em;
		padding: 4px;
	}
	.column-title input:focus {
		outline: 0px;
		background-color: var(--light);
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
	.column:focus {
		outline: 0px;
	}
	.column:hover > .column-title,
	.column:hover .column-body {
		background-color: var(--hv-column);
	}
	.column-title {
		background-color: var(--column);
		border-top-left-radius: 16px;
		border-top-right-radius: 16px;
		height: 60px;
		transition: height 0.2s;
		padding: 24px 12px 12px 12px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.column-title:hover {
		background-color: var(--hv-column);
	}
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
		margin-bottom: 8px;
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
		left: calc(100%);
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
