import "materialize-css";
import config from "./firebase.js";
import firebase from 'firebase/app';
import 'firebase/database';
//import 'TinyDatePicker';
//import { DH_NOT_SUITABLE_GENERATOR } from "constants";
firebase.initializeApp(config);

document.addEventListener('DOMContentLoaded', () => {
    const elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);
    document.getElementById("add_list").addEventListener("click", fIWanttoReadThis);
});

function fIWanttoReadThis(evt){
    let sName = document.getElementById("book_name").value;
    document.getElementById("book_name").value = "";
    let sAuthor = document.getElementById("book_author").value;
    let sGenre = document.getElementById("book_genre").value;
    document.getElementById("book_genre").value = "";
    let sPublished = document.getElementById("book_published").value;
    document.getElementById("book_genre").value = "";
    let sBookID = new Date().toISOString().replace(".", "_");
    firebase.database().ref('books/' + sBookID).set({
        name: sName,
        author: sAuthor,
        genre: sGenre,
        published: sPublished
    }).then(() => {
        console.log("inserted");
    });
}

function fIReadThis(evt){
    evt.preventDefault();
    let sId = evt.target.parentNode.id;
    firebase.database().ref('books/' + sId + "/purchaseTimestamp").set(new Date().toISOString(), ()=>{
        console.log("completed " + sId);

    });
}

function fIAmNotInterested(evt){
    evt.preventDefault();
   let sId = evt.target.parentNode.id;
    firebase.database().ref('books/' + sId).remove(()=>{
        console.log("removed " + sId);
    });
}


firebase.database().ref('books').on("value", snapshot => {
    // the database has changed
    let oBooks = snapshot.val();
    let oBookList = document.getElementById("booklist");
    console.log(oBooks);
    oBookList.innerHTML = "";
    Object.keys(oBooks).map((key) => {
         //we have an item here let's make a card for it
        let oBook = oBooks[key];
        let oCard = document.createElement("div");
        oCard.className ="card blue-grey darken-1";

        //card content
        let oCardContent = document.createElement("div");
        oCardContent.className = "card-content white-text";

        if(oBook.published){
            oCardContent.innerHTML = "<span class=\"card-title purchased\">" + oBook.name + "</span>";

        }else{
            oCardContent.innerHTML = "<span class=\"card-title\">" + oBook.name + "</span>";
           }
        oCardContent.innerHTML += "<p>" + oBook.author + "</p>" +"<br/>";
        oCardContent.innerHTML += "<p>" + oBook.genre + "</p>";
        oCardContent.innerHTML += "<p>" + oBook.published + "</p>";
        oCardContent.innerHTML += "<p>" + oBook.purchaseTimestamp + "</p>";

       if(oBook.purchaseTimestamp)
       {
           oCardContent.style.setProperty("text-decoration","line-through");
        } 
        oCardAction.append(oCardContent);
        //card action
        let oCardAction = document.createElement("div");
        oCardAction.className = "card-action";
        oCardAction.id = key;

        //I bought this
        let oIReadThis = document.createElement("a");
        oIReadThis.href = "#";
        oIReadThis.innerHTML = "I Read this";
        oIReadThis.addEventListener("click", fIReadThis);

        oCardAction.append(oIReadThis);

        

        //I don't need this
        let oIAmNotInterested = document.createElement("a");
        oIAmNotInterested.href = "#";
        oIAmNotInterested.innerHTML = "I don't need this";
        oIAmNotInterested.addEventListener("click", fIAmNotInterested);
        oCardAction.append(oIAmNotInterested);

        oCard.append(oCardAction);


        oBookList.prepend(oCard);
    });
});