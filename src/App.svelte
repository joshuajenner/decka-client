<script>
  import Auth from "./Auth.svelte";
  import Main from "./Main.svelte";
  import { firebaseConfig } from "./firebase.js";
  import { currentUser } from "./store";
  import { fb } from "./store.js";
  import { db } from "./store.js";

  import firebase from "firebase/app";
  import "firebase/auth";
  import "firebase/firestore";
  firebase.initializeApp(firebaseConfig);
  fb.set(firebase);
  db.set(firebase.firestore());
</script>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Oswald&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
</style>

<main>
  {#if !$currentUser.loggedIn}
    <Auth />
  {:else}
    <Main />
  {/if}
</main>
