<script>
	let givenUser;
	let givenPass;
</script>

<svelte:head>
	<title>Welcome to Decka</title>
</svelte:head>

<div id="auth" class="flex">
	<div id="form-container">
		<form>
			<h1>LOGIN</h1>
			<label for="loginUser">Username</label>
			<input
				type="text"
				id="loginUser"
				name="loginUser"
				bind:value={givenUser}
			/>
			<label for="loginPass">Password</label>
			<input
				type="password"
				id="loginPass"
				name="loginPass"
				bind:value={givenPass}
			/>
		</form>
		<form>
			<h1>SIGNUP</h1>
		</form>
	</div>
	<div id="hero-image" />
</div>

<style>
	#auth {
		height: 100%;
	}
	#auth > * {
		flex-grow: 1;
	}
	#hero-image {
		background-color: var(--main-green);
	}
</style>
