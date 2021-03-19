<!-- on:click={addToUpdate($decks[arr].id, item.id, item.title, item.content)} -->
<script>
	let type = "all";
	let items = [
		{ id: "test1", order: 1, title: "Test 1", content: "Test Content" },
		{ id: "test2", order: 2, title: "Test 2", content: "Test Content" },
		{ id: "test3", order: 3, title: "Test 3", content: "Test Content" },
		{ id: "test4", order: 4, title: "Test 4", content: "Test Content" },
		{ id: "test5", order: 5, title: "Test 5", content: "Test Content" },
	];

	function handleSort(e) {
		console.log(e);
		items = e.detail.items;
	}
</script>

<style>
</style>
