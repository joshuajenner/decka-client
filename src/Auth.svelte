<script>
	import { currentUser } from "./store.js";

	import { fb } from "./store.js";
	let current = "login";
	let givenEmail = "";
	let givenPass = "";
	let errorMessage = "";

	async function handleLogin() {
		if (givenEmail === "" || givenPass === "") {
			errorMessage = "Please fill in all fields.";
		} else {
			$fb
				.auth()
				.signInWithEmailAndPassword(givenEmail, givenPass)
				.then((userCredential) => {
					var user = userCredential.user;
					currentUser.set({
						loggedIn: true,
						uid: user.uid,
					});
					console.log($currentUser.uid);
				})
				.catch((error) => {
					var errorCode = error.code;
					console.log(error);
					if (errorCode === "auth/wrong-password") {
						errorMessage = "The password is incorrect.";
					} else if (errorCode === "auth/invalid-email") {
						errorMessage = "Please enter a valid email.";
					} else if (errorCode === "auth/user-not-found") {
						errorMessage = "This email was not found.";
					} else {
						errorMessage = "Error, please try again.";
					}
				});
		}
	}
	async function handleSignup() {
		if (givenEmail === "" || givenPass === "") {
			errorMessage = "Please fill in all fields.";
		} else {
			$fb
				.auth()
				.createUserWithEmailAndPassword(givenEmail, givenPass)
				.then((userCredential) => {
					var user = userCredential.user;
					currentUser.set({
						loggedIn: true,
						uid: user.uid,
					});
					initNewUserDB();
				})
				.catch((error) => {
					var errorCode = error.code;
					if (errorCode === "auth/weak-password") {
						errorMessage = "Password should be at least 6 characters.";
					} else if (errorCode === "auth/invalid-email") {
						errorMessage = "Please enter a valid email.";
					} else if (errorCode === "auth/email-already-in-use") {
						errorMessage = "This email address is already in use.";
					} else {
						errorMessage = "Error, please try again.";
					}
				});
		}
	}
</script>

<svelte:head>
	<title>Welcome to Decka</title>
</svelte:head>

<main id="auth" class="flex">
	<div id="form-container">
		<form id={current === "login" ? "selected" : ""}>
			<div class="flex form-box">
				<h1>LOGIN</h1>
				<hr />
				<label for="loginUser">Email</label>
				<input
					type="text"
					id="loginUser"
					name="loginUser"
					class="text-input"
					bind:value={givenEmail}
				/>
				<label for="loginPass">Password</label>
				<input
					type="password"
					id="loginPass"
					name="loginPass"
					class="text-input"
					bind:value={givenPass}
				/>
				<button type="button" on:click={handleLogin}>Login</button>
				<p class="switch" on:click={() => (current = "signup")}>
					I don't have an account. Signup.
				</p>
				<p>{errorMessage}</p>
			</div>
		</form>

		<form id={current === "signup" ? "selected" : ""}>
			<div class="flex form-box">
				<h1>SIGNUP</h1>
				<hr />
				<label for="signUser">Email</label>
				<input
					type="text"
					id="signUser"
					name="signUser"
					class="text-input"
					bind:value={givenEmail}
				/>
				<label for="signPass">Password</label>
				<input
					type="password"
					id="signPass"
					name="signPass"
					class="text-input"
					bind:value={givenPass}
				/>
				<button type="button" on:click={handleSignup}>Signup</button>
				<p class="switch" on:click={() => (current = "login")}>
					I already have an account. Login.
				</p>
				<p>{errorMessage}</p>
			</div>
		</form>
	</div>
	<div id="hero-image">
		<img src="/decka-black.png" alt="Decka Logo" />
	</div>
</main>

<style>
	#auth {
		height: 100%;
	}
	#auth > * {
		flex-grow: 1;
	}
	#form-container {
		margin: auto;
	}
	#hero-image {
		flex-grow: 1.8;
		position: relative;
		overflow: hidden;
		background: var(--main-green);
		background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
	}
	#hero-image img {
		height: 160%;
		position: absolute;
		opacity: 9%;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}
	form {
		display: none;
	}
	#selected {
		display: flex;
		justify-content: center;
		height: 100%;
	}
	.text-input {
		padding: 12px 8px;
		margin: 4px 0px;
	}
	label {
		margin-top: 24px;
	}
	.form-box {
		flex-direction: column;
		height: 480px;
		width: 320px;
		margin: -48px 0px 0px 0px;
	}
	button {
		margin-top: 24px;
		font-size: 1.2em;
		background-color: var(--main-green);
		padding: 8px;
		border: 0px;
		color: white;
		border-radius: 4px;
	}
	button:hover {
		background-color: var(--hv-green);
	}
	.switch {
		margin-top: 48px;
		color: var(--main-yellow);
	}
	h1 {
		margin-bottom: 0px;
	}
	hr {
		width: 100%;
		height: 0px;
		border: 1px solid var(--main-yellow);
	}
</style>
