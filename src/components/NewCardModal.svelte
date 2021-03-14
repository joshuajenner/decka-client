<script>
	import { currentUser } from "../store.js";
	import { api } from "../store.js";

	import { modalNewCard } from "../store";

	export let deck = "";
	let formTitle;
	let formContent;

	function setClose() {
		modalNewCard.set(false);
		formTitle = "";
		formContent = "";
	}
	async function newCard() {
		const res = await fetch(`${$api}/newcard`, {
			method: "POST",
			body: JSON.stringify({
				uid: $currentUser.uid,
				did: deck,
				title: formTitle,
				content: formContent,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		console.log("yuh");
		modalNewCard.set(false);
	}
</script>

<div id="new-card-box" class={$modalNewCard ? "open" : "close"}>
	<div id="blackout" on:click={setClose} />
	<div id="new-card-modal">
		<form method="post" on:submit|preventDefault={newCard}>
			<label for="title">Title</label>
			<input name="title" type="text" bind:value={formTitle} />
			<label for="content">Content</label>
			<input name="content" type="text" bind:value={formContent} />
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
	#new-card-box {
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
	#new-card-modal {
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
