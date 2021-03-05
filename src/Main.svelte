<script>
  import { currentUser } from "./store.js";
  import { api } from "./store.js";

  let selectedDeck;
  let deckList;

  async function newDeck() {
    const res = await fetch(`${$api}/newdeck`, {
      method: "POST",
      body: JSON.stringify({
        uid: $currentUser.uid
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  async function getDecks() {
    const res = await fetch(`${$api}/getdecks`, {
      method: "POST",
      body: JSON.stringify({
        uid: $currentUser.uid
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const allDecks = await res.json();
    console.log(allDecks);
    deckList = allDecks;
  }
  getDecks();
</script>

<style>
  nav {
    width: 100%;
    height: 60px;
    background-color: var(--main-green);
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  }
</style>

<div id="decka">
  <nav />
  <div id="container">
    <div id="deck-list" />
  </div>
</div>
