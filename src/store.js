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