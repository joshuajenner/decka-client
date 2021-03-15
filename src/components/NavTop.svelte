<script>
	import { decks } from "../store";
	import { selectedBoard } from "../store";

	import { listAny } from "../store";
	import { listDecks } from "../store";
	import { listCards } from "../store";

	import { modalNewBoard } from "../store";

	import { fly } from "svelte/transition";

	export let navDeck;
	export let boardStatus;

	function checkListsOpen() {
		if ($listDecks || $listCards) {
			listAny.set(true);
		} else {
			listAny.set(false);
		}
	}
	function toggleAllLists() {
		if ($listAny) {
			listDecks.set(false);
			listCards.set(false);
		} else {
			listDecks.set(true);
			listCards.set(true);
		}
		listAny.set(!$listAny);
	}
	function toggleDeckList() {
		listDecks.set(!$listDecks);
		checkListsOpen();
	}
	function openNewBoard() {
		modalNewBoard.set(true);
	}
	function selectBoard(b) {
		selectedBoard.set(b);
	}
</script>

<nav class="sh">
	<div id="nav-deck">
		<div id="nav-icon" class={$listAny ? "nav-icon-open" : "nav-icon-close"} on:click={toggleAllLists}>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
			</svg>
		</div>
		{#key navDeck}
			<div id="deck-title" class="p" in:fly={{ y: 200, duration: 200 }} on:click={toggleDeckList}>
				<h5>{navDeck.title}</h5>
				{#if navDeck.title != ""}
					<div id="nav-arrow">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
						</svg>
					</div>
				{/if}
			</div>
			<div id="loader" class="center none"><span /></div>
		{/key}
	</div>
	<div id="nav-boards">
		{#if navDeck.arr != -1}
			<ul id="boards-list">
				{#if boardStatus[navDeck.arr] == true}
					{#each $decks[navDeck.arr].boards as board, i}
						<li on:click={selectBoard(board)} class={$selectedBoard.id === board.id ? "board-item selected" : "board-item"}>
							{#if board.type == 0}
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
									/>
								</svg>
							{:else if board.type == 1}
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
									/>
								</svg>
							{/if}
							{board.title}
						</li>
					{/each}
				{/if}
				<li class="board-item" on:click={openNewBoard}>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg> Add Board
				</li>
			</ul>
		{/if}
	</div>
</nav>

<style>
	nav {
		color: var(--off-white);
		width: 100%;
		background-color: var(--main-green);
		/* border-bottom: 1px solid #252525; */
		overflow: hidden;
		display: flex;
	}
	#nav-icon {
		display: flex;
		width: 60px;
		padding: 16px;
		border-right: 1px solid #032720;
		cursor: pointer;
	}
	#nav-icon:hover svg {
		stroke: #eda700;
	}
	.nav-icon-open svg {
		stroke: #eda700;
	}
	.nav-icon-close svg {
		stroke: var(--off-white);
	}
	#nav-deck {
		display: flex;
		height: 100%;
		width: 360px;
	}
	#deck-title {
		display: flex;
		width: 300px;
		align-items: center;
		padding-left: 24px;
		justify-content: space-between;
		cursor: pointer;
	}
	#nav-arrow {
		height: 100%;
		padding: 14px 16px 18px 16px;
		width: 60px;
		margin-right: -30px;
	}
	#boards-list {
		list-style-type: none;
		display: flex;
		margin: 0px 0px 0px 12px;
		height: 100%;
		padding: 0px;
	}
	.board-item {
		margin-left: 28px;
		line-height: 60px;
		position: relative;
		padding: 0px 8px;
		color: lightgrey;
		cursor: pointer;
		justify-content: center;
		align-items: center;
		display: flex;
	}
	.board-item svg {
		height: 24px;
		margin-right: 4px;
		margin-bottom: 2px;
	}
	.board-item::after {
		content: "";
		position: absolute;
		bottom: 0px;
		left: 0px;
		width: 100%;
		height: 0px;
		background-color: #eda700;
		transition: height 0.1s;
	}
	.board-item:hover {
		color: inherit;
	}
	.board-item:hover::after {
		height: 6px;
	}
	.board-item.selected {
		color: inherit;
	}
	.board-item.selected::after {
		height: 6px;
	}
</style>
