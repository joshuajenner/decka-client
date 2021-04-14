<script>
	import { currentUser } from "../store.js";
	import { decks } from "../store";
	import { selectedBoard } from "../store";

	import { api } from "../store.js";

	import { listAny } from "../store";
	import { listDecks } from "../store";
	import { listCards } from "../store";

	import { modalNewBoard } from "../store";

	import { fly } from "svelte/transition";

	export let navDeck;
	export let boardStatus;

	let menuOpen = false;
	let userOptions = false;
	let boardOptions = false;
	let blackoutOpen = false;
	let userConfirm = "";
	let modalID = "";
	let modalTitle = "";
	let modalConfirm = "";
	let modalIndex;
	let confirm = true;

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
		console.log(b);
		selectedBoard.set(b);
	}
	function openMenu() {
		menuOpen = !menuOpen;
	}
	function openUserOptions() {
		userOptions = true;
		blackoutOpen = true;
		confirm = true;
	}
	function openBoardOptions(id, title, index) {
		boardOptions = true;
		blackoutOpen = true;
		confirm = true;
		modalTitle = title;
		modalID = id;
		modalIndex = index;
	}
	function closeModals() {
		userOptions = false;
		boardOptions = false;
		blackoutOpen = false;
	}
	function logout() {
		currentUser.set({
			loggedIn: false,
			uid: "",
			name: "",
		});
	}
	async function delUser() {
		if (userConfirm === $currentUser.name) {
			let u = $currentUser.user;
			u.delete()
				.then(function () {
					console.log("User Deleted");
				})
				.catch(function (error) {
					// An error happened.
				});
			const res = await fetch(`${$api}/deleteuser`, {
				method: "POST",
				body: JSON.stringify({
					uid: $currentUser.uid,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
		} else {
			confirm = false;
		}
	}
	async function updateBoard() {
		// let bi = $decks[navDeck.arr].boards.findIndex((x) => x.id === modalID);
		$decks[navDeck.arr].boards[modalIndex].title = modalTitle;
		decks.set($decks);
		closeModals();
		const res = await fetch(`${$api}/updateboard`, {
			method: "POST",
			body: JSON.stringify({
				uid: $currentUser.uid,
				did: $decks[navDeck.arr].id,
				bid: modalID,
				title: modalTitle,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
	}
	async function deleteBoard() {
		if (modalConfirm === $decks[navDeck.arr].boards[modalIndex].title) {
			$decks[navDeck.arr].boards.splice(modalIndex, 1);
			decks.set($decks);
			closeModals();
			const res = await fetch(`${$api}/deleteboard`, {
				method: "POST",
				body: JSON.stringify({
					uid: $currentUser.uid,
					did: $decks[navDeck.arr].id,
					bid: modalID,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
		} else {
			confirm = false;
		}
	}
</script>

<nav class="sh">
	<div id="user-data">
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
								{:else if board.type == 2}
									<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
										/>
									</svg>
								{:else if board.type == 3}
									<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
										/>
									</svg>
								{/if}
								{board.title}
								<svg
									on:click={openBoardOptions(board.id, board.title, i)}
									class="board-options"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
									/>
								</svg>
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
	</div>
	{#if $currentUser.name != ""}
		<div on:click={openMenu} id="user-box">
			<div id="user-name">{$currentUser.name}</div>
			<div id="user-icon">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
		</div>
	{/if}
</nav>
<div id="user-menu" class={menuOpen ? "menuOpen" : ""}>
	<div on:click={openUserOptions} id="user-options">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
			/>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
		</svg>
		<p>Options</p>
	</div>
	<div on:click={logout} id="logout">
		<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
		</svg>
		<p>Logout</p>
	</div>
</div>
<div id="user-modal" class={userOptions ? "userOptions" : ""}>
	<div class="close-box" on:click={closeModals}>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="slategrey">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	</div>
	<h1>Options</h1>
	<form class="danger" method="post" on:submit|preventDefault={delUser}>
		<label for="title">Please type in your username to confirm deletion.</label>
		<input class={confirm ? "" : "wrong"} name="title" type="text" bind:value={userConfirm} />
		<button class="delete" type="submit">Delete</button>
	</form>
</div>
<div id="board-modal" class={boardOptions ? "boardOptions" : ""}>
	<div class="close-box" on:click={closeModals}>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="slategrey">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
		</svg>
	</div>
	<h1>Options</h1>
	<form id="first" method="post" on:submit|preventDefault={updateBoard}>
		<label for="title">Rename</label>
		<input name="title" type="text" bind:value={modalTitle} />
		<button class="button" type="submit">Update</button>
	</form>
	<form class="danger" method="post" on:submit|preventDefault={deleteBoard}>
		<label for="title">Please type in the board's name to confirm deletion.</label>
		<input class={confirm ? "" : "wrong"} name="title" type="text" bind:value={modalConfirm} />
		<button class="delete" type="submit">Delete</button>
	</form>
</div>
<div on:click={closeModals} class={blackoutOpen ? "blackout" : "off"} />

<style>
	#first {
		padding: 0px !important;
		margin-top: 8px !important;
	}
	input.wrong {
		border: 2px solid var(--main-red);
		background-color: lightpink;
	}
	nav {
		color: var(--off-white);
		width: 100%;
		background-color: var(--main-green);
		/* border-bottom: 1px solid #252525; */
		overflow: hidden;
		display: flex;
		justify-content: space-between;
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
	#user-data {
		display: flex;
	}
	#user-box {
		display: flex;
		align-items: center;
		padding-left: 16px;
		position: relative;
	}
	#user-menu {
		position: absolute;
		right: 24px;
		top: 74px;
		opacity: 0%;
		transition: opacity 0.2s;
		color: black;
		background-color: var(--less-white);
		border-radius: 4px;
		border: 1px solid lightgrey;
		box-shadow: rgb(0 0 0 / 15%) 1.95px 1.95px 2.6px;
	}
	#user-menu div {
		padding: 16px 8px 16px 8px;
		border-bottom: 1px solid lightgrey;
		display: flex;
		align-items: center;
		cursor: pointer;
	}
	#user-menu div p {
		padding-left: 8px;
	}
	#user-menu div:hover {
		background-color: var(--hv-white);
	}
	#user-menu div svg {
		stroke: lightgrey;
		height: 24px;
		width: 24px;
	}
	#user-menu div:hover svg {
		stroke: slategrey;
	}
	#user-menu.menuOpen {
		opacity: 100%;
		z-index: 5;
	}
	#user-modal,
	#board-modal {
		position: absolute;
		display: none;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	form input {
		border: 1px solid grey;
		border-radius: 4px;
		padding: 4px;
	}
	#user-modal.userOptions,
	#board-modal.boardOptions {
		display: block;
		margin: auto;
		padding: 16px 32px 32px 32px;
		border-radius: 16px;
		border: 1px solid lightgrey;
		background-color: var(--less-white);
		z-index: 10;
	}
	#user-modal form,
	#board-modal form {
		display: flex;
		flex-direction: column;
		padding: 16px;
		position: relative;
		margin-top: 32px;
	}
	#user-modal .danger,
	#board-modal .danger {
		border-radius: 4px;
		border: 2px solid var(--main-red);
	}
	#user-modal .danger:before,
	#board-modal .danger:before {
		content: "Danger Zone";
		color: var(--main-red);
		position: absolute;
		background-color: var(--less-white);
		padding: 2px 4px;
		top: -12px;
		left: 8px;
	}
	#user-modal form *,
	#board-modal form * {
		margin-top: 16px;
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
	.button {
		background-color: var(--main-green);
		padding: 8px;
		border: 0px;
		color: white;
		border-radius: 4px;
		cursor: pointer;
	}
	.button:hover {
		background-color: var(--hv-green);
	}
	.delete {
		background-color: var(--main-red) !important;
		color: white;
		padding: 8px;
		border-radius: 4px;
		border: 0px;
	}
	#user-box:hover {
		cursor: pointer;
	}
	#user-box:hover #user-name {
		color: #eda700;
	}
	#user-box:hover #user-icon svg {
		stroke: #eda700;
	}
	#user-name {
		margin-top: -4px;
	}
	#user-icon {
		width: 60px;
		padding: 16px;
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
	.board-options {
		display: none;
		stroke: rgba(255, 255, 255, 0.5);
		margin: 0px 0px 0px 4px !important;
	}
	.board-options:hover {
		stroke: var(--off-white);
	}
	.board-item.selected .board-options {
		display: block;
	}
	.board-item.selected::after {
		height: 6px;
	}
</style>
