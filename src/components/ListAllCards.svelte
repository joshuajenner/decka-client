<script>
</script>

<div id="card-list" class={cardListOpen ? "open sh" : "close"}>
	<div id="card-list-menu">
		<div class="card-menu-icon">
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
					d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
				/>
			</svg>
		</div>
		<div class="card-menu-icon" on:click={openNewCardModal}>
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
		</div>
	</div>
	<div id="all-cards">
		{#if cardList == []}
			<p class="lato">No Cards to display.</p>
		{:else}
			{#each cardList as cardItem (cardItem.id)}
				<div id={cardItem.id} class="card-item card-sh">
					<div class="card-title">
						<p class="lato">
							{cardItem.data.title}
						</p>
					</div>
					<div class="card-content">
						<p>{cardItem.data.content}</p>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>

<style>
	#card-list {
		width: 340px !important;
		z-index: -1 !important;
		background-color: var(--less-white);
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	#card-list.open {
		left: 300px;
	}
	#card-list.close {
		left: -40px;
	}
	#card-list-menu {
		width: 100%;
		height: 60px;
		background-color: var(--off-white);
		border-bottom: 1px solid lightgrey;
		display: flex;
		justify-content: space-between;
	}
	.card-menu-icon {
		width: 44px;
		padding: 16px 8px;
	}
	.card-menu-icon svg {
		height: 100%;
	}
	.card-menu-icon:hover svg {
		stroke: black;
	}
	#all-cards {
		padding: 8px;
		overflow-y: scroll;
		height: 100%;
	}
	.card-item {
		border-radius: 12px;
		border: 1px solid lightgrey;
		padding: 8px 16px;
		min-height: 240px;
		background-color: var(--off-white);
		margin-top: -180px;
		position: relative;
		transition: margin 0.2s;
	}
	.card-sh {
		box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
			rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
	}
	.card-item:first-of-type {
		margin-top: 24px;
	}
	.card-item:first-of-type:hover {
		margin-top: 0px;
		margin-bottom: 24px;
	}
	.card-item:hover {
		margin-top: -204px;
		margin-bottom: 24px;
		border-color: black;
	}
	.card-title {
		font-weight: bold;
		font-size: 1.25em;
		margin-bottom: 16px;
		padding: 8px 0px 4px 0px;
		border-bottom: 1px solid lightgrey;
	}
</style>
