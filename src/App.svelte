<script>
	import Auth from "./Auth.svelte";
	import Main from "./Main.svelte";
	import { user } from "./store";
</script>

<main>
	{#if !$user.loggedIn}
		<Auth />
	{:else}
		<Main />
	{/if}
</main>

<style>
	@import url("https://fonts.googleapis.com/css2?family=Oswald&display=swap");
	@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
</style>
