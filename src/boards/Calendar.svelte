<script>
	import { currentUser } from "../store.js";
	import { api } from "../store.js";
	import { decks } from "../store";
	import { selectedBoard } from "../store";

	import { flip } from "svelte/animate";
	import { dndzone, SHADOW_ITEM_MARKER_PROPERTY_NAME } from "svelte-dnd-action";
	import { clickOutside } from "../functions/clickOutside.js";

	export let boardID;
	export let boardI;
	export let deckID;
	export let deckArr;
	const flipDurationMs = 200;

	let cardsLoaded = false;

	let updateModal = false;
	let modalI = 0;
	let modalTitle = "";
	let modalContent = "";

	function daysInMonth(year, monthAfter) {
		return new Date(year, monthAfter, 0).getDate();
	}

	let today = new Date();
	let year = today.getFullYear();
	let month = today.getMonth();
	let monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	let monthLength = daysInMonth(year, month + 1);
	let yearInd = 0;
	let calGrid = [];

	console.log(monthLength);
	$decks[deckArr].boards[boardI].years = [{ id: year, months: [] }];

	async function getCalendarCards() {
		const res = await fetch(`${$api}/getcalendarcards`, {
			method: "POST",
			body: JSON.stringify({
				uid: $currentUser.uid,
				did: deckID,
				bid: boardID,
				year: year,
				month,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const cards = await res.json();
		// let card = 0;
		// $decks[deckArr].boards[boardI].cards = [];
		// console.log($decks[deckArr].boards[boardI].cards);
		// for (card in cards) {
		// 	$decks[deckArr].boards[boardI].cards.push(cards[card]);
		// }
		yearInd = $decks[deckArr].boards[boardI].years.findIndex((y) => y.id === year);
		$decks[deckArr].boards[boardI].month = cards;
		constructCalendar();
		cardsLoaded = true;
		console.log($decks[deckArr].boards[boardI].month.days);
	}
	function constructCalendar() {
		let firstDay = new Date(year, month, 1).getDay();
		if (firstDay != 1) {
			if (firstDay == 0) {
				firstDay = 7;
			}
			firstDay -= 1;
			for (let i = 0; i > -firstDay; --i) {
				calGrid.unshift({ month: month - 1, date: new Date(year, month, i).getDate() });
			}
		}
		for (let j = 1; j <= monthLength; j++) {
			calGrid.push({ month: month, date: j, ind: j - 1 });
		}
		if (calGrid.length < 35) {
			let fill = 35 - calGrid.length;
			for (let k = 1; k <= fill; k++) {
				calGrid.push({ month: month + 1, date: k });
			}
		} else if (calGrid.length > 35) {
			let fill = 42 - calGrid.length;
			for (let m = 1; m <= fill; m++) {
				calGrid.push({ month: month + 1, date: m });
			}
		}
		console.log(calGrid);
	}
	async function updateCalendarCards(di, dd) {
		const res = await fetch(`${$api}/updatecalendarcards`, {
			method: "POST",
			body: JSON.stringify({
				uid: $currentUser.uid,
				did: deckID,
				bid: boardID,
				year: year,
				month: month,
				day: dd,
				cards: $decks[deckArr].boards[boardI].month.days[di].cards,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	function deleteCard() {
		$decks[deckArr].boards[boardI].cards.splice(modalI, 1);
		decks.set($decks);
		updateModal = false;
		updateCalendarCards();
	}
	function updateCard() {
		$decks[deckArr].boards[boardI].cards[modalI].title = modalTitle;
		$decks[deckArr].boards[boardI].cards[modalI].content = modalContent;
		updateModal = false;
		updateCalendarCards();
	}
	function closeModal() {
		updateModal = false;
	}
	function openUpdate(id, title, content) {
		updateModal = true;
		modalI = id;
		modalTitle = title;
		modalContent = content;
	}
	function transformDraggedElement(draggedEl, data, index) {
		draggedEl.style.opacity = 0.7;
	}
	function handleSort(e, di) {
		$decks[deckArr].boards[boardI].month.days[di].cards = e.detail.items;
	}
	function handleFinalize(e, di, dd) {
		$decks[deckArr].boards[boardI].month.days[di].cards = e.detail.items;
		decks.set($decks);
		updateCalendarCards(di, dd);
	}

	getCalendarCards();
</script>

<div class={$selectedBoard.id === boardID ? "calendar" : "unselected"}>
	{#if cardsLoaded}
		<div class="date-box">
			<h4>{monthName[month]}, {year}</h4>
		</div>
		<div class={calGrid.length <= 35 ? "cal-box row6" : "cal-box row7"}>
			<div class="day"><p>Monday</p></div>
			<div class="day"><p>Tuesday</p></div>
			<div class="day"><p>Wednesday</p></div>
			<div class="day"><p>Thursday</p></div>
			<div class="day"><p>Friday</p></div>
			<div class="day"><p>Saturday</p></div>
			<div class="day"><p>Sunday</p></div>
			{#each calGrid as day, i}
				<div class="day">
					<p class="dn">{day.date}</p>
					{#if day.month === month}
						<section
							use:dndzone={{ items: $decks[deckArr].boards[boardI].month.days[day.ind].cards, flipDurationMs, transformDraggedElement, type: "cards" }}
							on:consider={(e) => handleSort(e, day.ind)}
							on:finalize={(e) => handleFinalize(e, day.ind, day.date)}
						>
							{#each $decks[deckArr].boards[boardI].month.days[day.ind].cards as card (card.dnd)}
								<div on:click={openUpdate(card.title, card.content)} id={card.id} class="card sh" animate:flip={{ duration: flipDurationMs }}>
									<div class="card-title lato">
										<p>{card.title}</p>
									</div>
									<!-- <div class="card-body">
										<p>{card.content}</p>
									</div> -->
									{#if card[SHADOW_ITEM_MARKER_PROPERTY_NAME]}
										<div class="custom-shadow-item">{card.title}</div>
									{/if}
								</div>
							{/each}
						</section>
					{/if}
				</div>
			{/each}
		</div>
	{:else}
		<h4>Loading...</h4>
	{/if}
</div>
<div class={updateModal ? "calendar-modal" : "modal-closed"}>
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
	.day {
		border: 0.5px solid rgb(233, 233, 233);
		padding: 8px;
		height: 163px;
	}
	.day section {
		height: 100%;
	}
	.dn {
		color: slategrey;
	}
	.date-box {
		margin-bottom: 16px;
	}
	.cal-box {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		height: 100%;
		border: 0.5px solid rgb(233, 233, 233);
	}
	.row6 {
		grid-template-rows: 36px 1fr 1fr 1fr 1fr 1fr;
	}
	.row7 {
		grid-template-rows: 36px 1fr 1fr 1fr 1fr 1fr 1fr;
	}
	section.empty {
		position: relative;
	}
	section.empty:after {
		content: "There are no cards to display.";
		position: absolute;
		color: slategrey;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	.modal-closed {
		display: none;
	}
	.calendar-modal {
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
		bottom: 16px;
		right: 96px;
	}
	.calendar {
		height: 100%;
		width: 100%;
		padding: 16px;
	}
	.calendar section {
		width: 100%;
		border-radius: 12px;
	}
	.calendar section:focus {
		outline: 0px;
	}
	.unselected {
		display: none;
	}
	.card {
		border-radius: 12px;
		border: 1px solid lightgrey;
		padding: 8px 16px;
		background-color: var(--off-white);
		position: relative;
		cursor: pointer;
		margin: 4px;
		width: 100%;
		height: 48px;
	}
	.sh {
		box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
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
</style>
