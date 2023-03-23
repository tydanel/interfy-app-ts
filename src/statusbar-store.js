import { writable, get } from 'svelte/store';


function createstatusbarStore() {
    const store = writable([]);
    return {
        push: value => {
            const items = [ ...get(store) ];
            items.push(value);
            store.set(items);
        },
        pop: () => {
            const items = [ ...get(store) ];
            items.pop();
            store.set(items);
        },
        set: store.set,
        subscribe: store.subscribe
    };
}


export default createstatusbarStore();