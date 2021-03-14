<script>
	import { listDecks } from "../store";
	import { listCards } from "../store";

	function toggleDeckList() {
		listDecks.set(!$listDecks);
	}

	function toggleCardList() {
		listCards.set(!$listCards);
	}
</script>

<div id="nav-side" class="flex">
	<div id="tooltip-icon" class="nsi-icon">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="slategrey">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			/>
		</svg>
	</div>
	<div id="nav-side-icons">
		<div id="decks-icon" class={$listDecks ? "nsi-icon tt nso" : "nsi-icon tt nsc"} on:click={toggleDeckList}>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
			</svg>
		</div>
		<div id="cards-icon" class={$listCards ? "nsi-icon tt nso" : "nsi-icon tt nsc"} on:click={toggleCardList}>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

<style>
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
</style>
