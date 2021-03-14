<script>
	import { decks } from "../store";
	import { selectedBoard } from "../store";

	export let boardID;
</script>

<div class={$selectedBoard.id === boardID ? "grid" : "unselected"}>
	<p>Grid</p>
</div>

<style>
	.unselected {
		display: none;
	}
</style>
