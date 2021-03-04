<script>
  let givenUser;
  let givenPass;
</script>

<style>
  #auth {
    height: 100%;
  }
  #auth > * {
    flex-grow: 1;
  }
  #hero-image {
    position: relative;
    overflow: hidden;
    background: var(--main-green);
    background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zM6 5v1H5z'/%3E%3C/g%3E%3C/svg%3E");
  }
  #hero-image img {
    height: 120%;
    position: absolute;
    opacity: 9%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>

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
        bind:value={givenUser} />
      <label for="loginPass">Password</label>
      <input
        type="password"
        id="loginPass"
        name="loginPass"
        bind:value={givenPass} />
    </form>
    <form>
      <h1>SIGNUP</h1>
    </form>
  </div>
  <div id="hero-image">
    <img src="/decka-black.png" alt="Decka Logo" />
  </div>
</div>
