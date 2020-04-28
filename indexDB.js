const db_name = "book_store"
const db_version = 1
// const db_store = "book"
var db

if (!window.indexedDB)
{
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}


if ('indexedDB' in window)
{
  start() 
}

function start() 
{ 
let req = window.indexedDB.open (db_name,db_version)

req.onsuccess = (ev) => {
    console.log('success',ev)
    db = ev.target.result;
    console.log(db);
}


// This event is only implemented in recent browsers   
req.onupgradeneeded = (ev) => {
    console.log('upgraded',ev)
    // Save the IDBDatabase interface
    db = ev.target.result;
    // Create an objectStore for this database
  var objectStore = db.createObjectStore("MyTable", { keyPath: "ID" ,autoIncrement : true});

  // Create an index to search books by SSN. We want to ensure that
  // no two books have the same SSN, so use a unique index.
  objectStore.createIndex("title", "title", { unique: false });
  objectStore.createIndex("SSN", "SSN", { unique: true });
  objectStore.createIndex("year", "year", { unique: false });
}

req.onerror = (ev) => {
    console.log('error',ev)
}

//ADD
var addbtn = document.getElementById('addButton');
addbtn.addEventListener('click' , function(ev){
var title = document.getElementById('bookTitle').value;
var ssn = document.getElementById('bookSn').value;
var year = document.getElementById('bookYear').value;
var ObjectStore = db.transaction("MyTable", "readwrite").objectStore("MyTable");
var obj = {title ,ssn , year};
ObjectStore.add(obj);
});

//Reset
var reset = document.getElementById('addFormReset');
reset.addEventListener('click',function () {
document.getElementById('bookTitle').value ="";
document.getElementById('bookSn').value ="";
document.getElementById('bookYear').value ="";
});

//Delete
let Del = document.getElementById('deleteButton')
Del.addEventListener('click',function () {
  let id = document.getElementById('idToDelete').value
  let ssn = document.getElementById('snToDelete').value
  let tx = db.transaction('MyTable','readwrite')
  tx.onerror = (ev) => {console.log(ev.target.error.message)}
  let Store = tx.objectStore('MyTable');
        let data = Store.get(+id);
        data.onsuccess = (ev) => {
            Store.delete(+id);
        }
        
})

//clear all (clear DB)
var clear = document.getElementById('clearStoreButton');
clear.addEventListener('click',function () {
indexedDB.deleteDatabase(db_name)
});

//display your table
let search = document.getElementById('searchListButton');
    search.addEventListener('click', function (ev) {
        let view = document.getElementById('bookViewer');
        let Store = db.transaction('MyTable', 'readwrite').objectStore('MyTable');
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

};