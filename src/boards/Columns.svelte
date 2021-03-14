<script>
	import { decks } from "../store";
	import { selectedBoard } from "../store";

	export let boardID;
</script>

<div class={$selectedBoard.id === boardID ? "columns" : "unselected"}>
	<div class="column">
		<div class="column-title column-add">
			<div class="add-icon">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			</div>
			<h5>Add Column</h5>
		</div>
	</div>
</div>

<style>
	.columns {
		padding: 8px;
	}
	.unselected {
		display: none;
	}
	.column {
		background-color: var(--column);
		border-radius: 16px;
		width: 20vw;
	}
	.column:hover {
		background-color: var(--hv-column);
	}
	.column-title {
		height: 60px;
		padding: 0px 16px;
	}
	.column-add {
		display: flex;
		align-items: center;
	}
	.add-icon svg {
		height: 24px;
		margin: 2px 8px 0px 0px;
	}
</style>
