<script>
	import { currentUser } from "../store.js";
	import { api } from "../store.js";
	import { updateCards } from "../store.js";

	async function updateCard(did, id, title, content) {
		const res = await fetch(`${$api}/updatecard`, {
			method: "POST",
			body: JSON.stringify({
				did: did,
				uid: $currentUser.uid,
				id: id,
				title: title,
				content,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		removeCard(id);
	}

	async function deleteCard(did, id) {
		const res = await fetch(`${$api}/deletecard`, {
			method: "POST",
			body: JSON.stringify({
				did: did,
				uid: $currentUser.uid,
				id: id,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		removeCard(id);
	}

	function removeCard(cid) {
		$updateCards.splice(
			$updateCards.findIndex((card) => card.id == cid),
			1
		);
		updateCards.set($updateCards);
	}
</script>

{#if $updateCards.length > 0}
	<div id="update-card-box">
		{#each $updateCards as card}
			<div class="update-card sh">
				<form on:submit|preventDefault={updateCard(card.did, card.id, card.title, card.content)}>
					<div class="update-title">
						<input name="title" type="text" bind:value={card.title} />
					</div>
					<div class="update-content">
						<textarea name="cotent" bind:value={card.content} />
					</div>
					<button class="button" type="submit">Update</button>
				</form>
				<button on:click={deleteCard(card.did, card.id)} class="button-delete">Delete</button>
			</div>
		{/each}
	</div>
{/if}

<style>
	#update-card-box {
		padding: 16px;
		display: flex;
	}
	form {
		height: 100%;
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
</style>
