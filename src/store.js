import { writable } from 'svelte/store';
import { readable } from 'svelte/store';


// Q2qfwFNyHSNO7pqigpOJ3BznN3r2
export const currentUser = writable({
    loggedIn: true,
    uid: "Q2qfwFNyHSNO7pqigpOJ3BznN3r2"
});

// local is http://127.0.0.1:3000
export const api = readable("http://127.0.0.1:3000")

export const fb = writable();
export const db = writable();


export const decks = writable([]);
export const updateCards = writable([]);
export const selectedBoard = writable({});

export const listAny = writable(true);
export const listDecks = writable(true);
export const listCards = writable(false);

export const modalNewCard = writable(false);
export const modalNewBoard = writable(false);
export const modalUpdateDeck = writable(false);
export const modalNewDeck = writable(false);
