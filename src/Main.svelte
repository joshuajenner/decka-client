<script>
	import { currentUser } from "./store.js";
	import { decks } from "./store";
	import { api } from "./store.js";

	import UpdateDeckModal from "./components/UpdateDeckModal.svelte";
	import NewDeckModal from "./components/NewDeckModal.svelte";

	import NewCardModal from "./components/NewCardModal.svelte";
	import ListAllCards from "./components/ListAllCards.svelte";

	import { fly } from "svelte/transition";

	let selectedDeck = {
		title: "",
		id: "",
	};
	let modalDeck = {
		title: "",
		id: "",
	};

	let anyListOpen = true;
	let deckListOpen = true;
	let cardListOpen = false;
	let newCardModalOpen = false;
	let updateDeckModalOpen = false;
	let newDeckModalOpen = false;

	let deckList = [];
	let cardList = [];

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
	async function getDeckData(deckID) {
		const res = await fetch(`${$api}/getdeckdata`, {
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
		cardList = allData;
	}
	function selectDeck(id, name) {
		selectedDeck = {
			id: id,
			title: name,
		};
		toggleDeckList();
		cardListOpen = true;
		getDeckData(id);
	}
	function toggleDeckList() {
		deckListOpen = !deckListOpen;
		checkListsOpen();
	}
	function toggleCardList() {
		cardListOpen = !cardListOpen;
		checkListsOpen();
	}
	function toggleAllLists() {
		if (anyListOpen) {
			deckListOpen = false;
			cardListOpen = false;
		} else {
			deckListOpen = true;
			cardListOpen = true;
		}
		anyListOpen = !anyListOpen;
	}
	function openUpdateDeckModal(gid, gtitle) {
		modalDeck = {
			id: gid,
			title: gtitle,
		};
		updateDeckModalOpen = true;
	}
	function openNewDeckModal() {
		newDeckModalOpen = true;
	}
	function checkListsOpen() {
		if (deckListOpen || cardListOpen) {
			anyListOpen = true;
		} else {
			anyListOpen = false;
		}
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
	<nav class="sh">
		<div id="nav-deck">
			<div
				id="nav-icon"
				class={anyListOpen ? "nav-icon-open" : "nav-icon-close"}
				on:click={toggleAllLists}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h7"
					/>
				</svg>
			</div>
			{#key selectedDeck}
				<div
					id="deck-title"
					class="p"
					in:fly={{ y: 200, duration: 200 }}
					on:click={toggleDeckList}
				>
					<h5>{selectedDeck.title}</h5>
					{#if selectedDeck.title != ""}
						<div id="nav-arrow">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 5l7 7-7 7M5 5l7 7-7 7"
								/>
							</svg>
						</div>
					{/if}
				</div>
				<div id="loader" class="center"><span /></div>
			{/key}
		</div>
	</nav>
	<div id="decka">
		<div id="nav-side" class="flex">
			<div id="tooltip-icon" class="nsi-icon">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="slategrey"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			</div>
			<div id="nav-side-icons">
				<div
					id="decks-icon"
					class={deckListOpen ? "nsi-icon tt nso" : "nsi-icon tt nsc"}
					on:click={toggleDeckList}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
						/>
					</svg>
				</div>
				<div
					id="cards-icon"
					class={cardListOpen ? "nsi-icon tt nso" : "nsi-icon tt nsc"}
					on:click={toggleCardList}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
						/>
					</svg>
				</div>
			</div>
		</div>
		<div id="deck-info" class={deckListOpen ? "open sh" : "close"}>
			<div id="deck-list">
				<div id="all-decks">
					{#if deckList == []}
						<p>No decks to display.</p>
					{:else}
						{#each deckList as deckItem (deckItem.id)}
							<div id={deckItem.id} class="deck-item p">
								<h6 on:click={selectDeck(deckItem.id, deckItem.data.title)}>
									{deckItem.data.title}
								</h6>
								<!-- <p>{deckItem.data.content}</p> -->
								<div
									class="deck-cog"
									on:click={openUpdateDeckModal(
										deckItem.id,
										deckItem.data.title
									)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="lightgrey"
									>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
										/>
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
										/>
									</svg>
								</div>
							</div>
						{/each}
					{/if}
				</div>
				<div id="new-deck" class="p" on:click={openNewDeckModal}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="slategrey"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<p>new Deck</p>
				</div>
			</div>
			<ListAllCards
				bind:isOpen={cardListOpen}
				bind:cards={cardList}
				bind:newCardModalToggle={newCardModalOpen}
			/>
		</div>
	</div>
	<UpdateDeckModal bind:isOpen={updateDeckModalOpen} bind:deck={modalDeck} />
	<NewDeckModal bind:isOpen={newDeckModalOpen} />
	<NewCardModal bind:isOpen={newCardModalOpen} bind:deck={selectedDeck.id} />
</main>

<style>
	main {
		flex-direction: column;
		display: flex;
	}
	nav {
		color: var(--off-white);
		width: 100%;
		height: 60px;
		background-color: var(--main-green);
		/* border-bottom: 1px solid #252525; */
		overflow: hidden;
	}
	#nav-icon {
		display: flex;
		width: 60px;
		padding: 16px;
		border-right: 1px solid #032720;
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
	#nav-side {
		height: 100%;
		position: relative;
		z-index: 5;
		width: 60px;
		background-color: var(--off-white);
		border-right: 1px solid lightgrey;
		display: flex;
		flex-direction: column-reverse;
		justify-content: space-between;
	}
	.nsi-icon {
		height: 60px;
		width: 100%;
		padding: 16px;
		background-color: var(--off-white);
		cursor: pointer;
	}
	.nsc:hover svg {
		stroke: #eda700;
	}
	.nso {
		background-color: #eda700;
	}
	.nso svg {
		stroke: var(--off-white);
	}
	.nsc svg {
		stroke: black;
	}
	#tooltip-icon:hover ~ div .tt:after {
		left: 100%;
		transform: translate(20%, -50%);
		opacity: 100%;
	}
	#tooltip-icon:hover svg {
		stroke: black;
	}
	.tt {
		position: relative;
	}
	#decks-icon:after {
		content: "Decks";
	}
	#cards-icon:after {
		content: "Cards";
	}
	#decks-icon:after,
	#cards-icon:after {
		line-height: 50px;
		height: 48px;
		width: 68px;
		padding: 0px 12px;
		position: absolute;
		left: -110%;
		top: 50%;
		opacity: 0%;
		background-color: rgba(0, 0, 0, 0.8);
		color: white;
		transform: translate(0px, -50%);
		transition: left, transform 0.2s, opacity 0.2s;
		border-radius: 8px;
		z-index: -1;
	}
	#decka {
		height: 100%;
		position: relative;
	}
	#deck-list {
		height: 100%;
		background-color: var(--less-white);
	}
	#deck-info {
		z-index: 2;
	}
	#deck-info {
		height: 100%;
		position: absolute;
		top: 0px;
		width: 300px;
		transition: left 0.15s;
		background-color: var(--less-white);
		border-right: 1px solid lightgrey;
	}

	#deck-info.open {
		left: 60px;
	}
	#deck-info.close {
		left: -240px;
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

	#loader {
		display: block;
		height: 32px;
		width: 32px;
		-webkit-animation: loader-2-1 3s linear infinite;
		animation: loader-2-1 3s linear infinite;
	}
	@-webkit-keyframes loader-2-1 {
		0% {
			-webkit-transform: rotate(0deg);
		}
		100% {
			-webkit-transform: rotate(360deg);
		}
	}
	@keyframes loader-2-1 {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	#loader {
		display: none;
	}
	#loader span {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		height: 32px;
		width: 32px;
		clip: rect(16px, 32px, 32px, 0);
		-webkit-animation: loader-2-2 1.5s cubic-bezier(0.77, 0, 0.175, 1) infinite;
		animation: loader-2-2 1.5s cubic-bezier(0.77, 0, 0.175, 1) infinite;
	}
	@-webkit-keyframes loader-2-2 {
		0% {
			-webkit-transform: rotate(0deg);
		}
		100% {
			-webkit-transform: rotate(360deg);
		}
	}
	@keyframes loader-2-2 {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	#loader span::before {
		content: "";
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		height: 32px;
		width: 32px;
		border: 3px solid transparent;
		border-top: 3px solid #fff;
		border-radius: 50%;
		-webkit-animation: loader-2-3 1.5s cubic-bezier(0.77, 0, 0.175, 1) infinite;
		animation: loader-2-3 1.5s cubic-bezier(0.77, 0, 0.175, 1) infinite;
	}
	@-webkit-keyframes loader-2-3 {
		0% {
			-webkit-transform: rotate(0deg);
		}
		100% {
			-webkit-transform: rotate(360deg);
		}
	}
	@keyframes loader-2-3 {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
	#loader span::after {
		content: "";
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin: auto;
		height: 32px;
		width: 32px;
		border: 3px solid rgba(255, 255, 255, 0.5);
		border-radius: 50%;
	}
</style>
