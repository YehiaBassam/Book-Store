const DB_NAME = 'book-store';
const DB_VERSION = 1;
const DB_STORE = 'books';
let db;
let addBtn = document.querySelector("#addButton");

if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
} else {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onsuccess = (ev) => {
        addBtn.disabled = false;
        db = ev.target.result;
    };

    req.onupgradeneeded = (ev) => {
        const db = ev.target.result;
        const upgradeTransaction = event.target.transaction;
        let store;
        if (!db.objectStoreNames.contains(DB_STORE)) {
            store = db.createObjectStore(DB_STORE, { keyPath: 'id', autoIncrement: true });

        } else {
            store = upgradeTransaction.objectStore(DB_STORE);
        }

        if (!store.indexNames.contains("title")) {
            store.createIndex('title', 'title', { unique: true });
        }

        if (!store.indexNames.contains("sn")) {
            store.createIndex('sn', 'sn', { unique: true });
        }

    }


    addBtn.addEventListener("click", () => {
        title = document.querySelector("#bookTitle").value;
        sn = document.querySelector("#bookSn").value;
        year = document.querySelector("#bookYear").value;
        let book = { title, sn, year };
        const tx = db.transaction([DB_STORE], 'readwrite');
        tx.onerror = (ev) => {
            displayActionFailure(ev.target.error.message);
        }
        tx.oncomplete = (ev) => {
            displayActionSuccess();
        };

        let objectStore = tx.objectStore(DB_STORE);

        let request = objectStore.add(book);
        request.onsuccess = function (ev) {
            console.log(ev);
        }
    });

    let deleBtn = document.querySelector("#deleteButton");
    deleBtn.addEventListener("click", () => {
        let id = document.querySelector("#idToDelete").value;
        const tx = db.transaction([DB_STORE], 'readwrite');
        tx.onerror = (ev) => {
            displayActionFailure(ev.target.error.message);
        }
        tx.oncomplete = (ev) => {
            displayActionSuccess();
        };

        const Store = tx.objectStore(DB_STORE);
        let data = Store.get(+id);
        data.onsuccess = (ev) => {
            Store.delete(+id);
        }
    });


    let clear = document.getElementById('clearStoreButton');
    clear.addEventListener('click', function (ev) {
        let Store = db.transaction(DB_STORE, "readwrite").objectStore(DB_STORE);
        Store.openCursor().onsuccess = function (event) {
            let cursor = event.target.result;
            if (cursor) {
                console.log(+cursor.value.id);
                cursor.continue();
                Store.delete(cursor.value.id)
            }
            else {
                console.log("No more entries!");
            }
        };
    });

    let search = document.getElementById('searchListButton');
    search.addEventListener('click', function (ev) {
        let view = document.getElementById('bookViewer');
        let Store = db.transaction(DB_STORE, "readwrite").objectStore(DB_STORE);
        view.innerHTML = "";
        Store.openCursor().onsuccess = function (event) {

            let cursor = event.target.result;
            if (cursor) {

                view.innerHTML += "Title : " + cursor.value.title + "<br>" + "SSN : " + cursor.value.sn + "<br>" + "Year : " + cursor.value.year + "<br>";

                cursor.continue();

            }
            else {
                console.log("No more entries!");
            }
        };
    });



}











