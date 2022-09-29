let myLibrary = [];
let titles = [];
let authors = [];
const form = document.querySelector(".form");
const addbook = document.querySelector(".addbook");
const closeForm = document.querySelector(".closeForm");
const cards = document.querySelector(".cards");
const autocomplete = document.querySelector(".autocomplete");
let input = document.querySelector("#book");
let authorInput = document.querySelector("#author");
let pages = document.querySelector("#pages");
let read = document.querySelector("#read");

autocomplete.style.display = "none";
form.style.display = "none";
closeForm.style.display = "none";

addbook.addEventListener("click", () => {
  form.style.display = "block";
  closeForm.style.display = "block";
  (input.value = ""),
    (authorInput.value = ""),
    (pages.value = ""),
    (read.checked = false);
});

closeForm.addEventListener("click", () => {
  form.style.display = "none";
  closeForm.style.display = "none";
  autocomplete.style.display = "none";
  input.value = "";
  authorInput.value = "";
  pages.value = "";
  read.checked = false;
});

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    return title + "\r\n" + author;
  };
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let formValue = e.target;

  let book = new Book(
    formValue.book.value,
    formValue.author.value,
    formValue.pages.value,
    formValue.read.checked
  );

  myLibrary.push(book.info());

  const newDiv = document.createElement("div");
  const buttonsDiv = document.createElement("div");

  const newButton = document.createElement("button");
  const text = document.createTextNode("Remove");
  const before = document.querySelector(".before");

  buttonsDiv.appendChild(newButton);
  newDiv.appendChild(buttonsDiv);

  newButton.appendChild(text);
  document.body.insertBefore(newDiv, before);

  let readButton = document.createElement("button");
  const buttonText = document.createTextNode("Read");
  const buttonNotRead = document.createTextNode("Not read");

  buttonsDiv.appendChild(readButton);

  newDiv.className = "newDiv";
  newButton.className = "buttons";
  readButton.className = "buttons";
  buttonsDiv.className = "buttonsDiv";

  getCover(book, newDiv);

  cards.appendChild(newDiv);
  formValue.read.checked
    ? readButton.appendChild(buttonText)
    : readButton.appendChild(buttonNotRead);

  newButton.addEventListener("click", () => {
    newDiv.remove();
  });

  //toggle error when read is first - readButton is not defined

  readButton.addEventListener("click", (e) => {
    e.stopPropagation();
    formValue.read.checked = formValue.read.checked !== true;
    formValue.read.checked
      ? readButton.appendChild(buttonText) &&
        readButton.removeChild(buttonNotRead)
      : readButton.appendChild(buttonNotRead) &&
        readButton.removeChild(buttonText);
  });

  form.style.display = "none";
  closeForm.style.display = "none";

  autocomplete.style.display = "none";
  autocomplete.innerHTML = "";
});

let getCover = (book, newDiv) => {
  let bookName = book.title;
  let pInfo = document.createElement("p");
  let pText = document.createTextNode(book.info());

  pInfo.appendChild(pText);
  pInfo.style.fontFamily = "Caveat";
  newDiv.appendChild(pInfo);
  pInfo.style.display = "none";

  fetch("https://openlibrary.org/search.json?q=" + bookName)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const book = data.docs.find((book) =>
        book.hasOwnProperty("cover_edition_key")
      );
      console.log(book);

      if (book) {
        let bookCover = book.cover_edition_key;
        newDiv.style.backgroundImage =
          "url('https://covers.openlibrary.org/b/olid/" +
          bookCover +
          "-M.jpg')";
      } else {
        newDiv.style.backgroundImage = "url('default_book_cover.jpg')";
      }

      const firstSentence = data.docs.find((sentence) =>
        sentence.hasOwnProperty("first_sentence")
      );

      let toggle = false;
      let makeBackground = () => {
        let sentenceP = document.createElement("p");
        newDiv.appendChild(sentenceP);
        sentenceP.style.display = "none";

        if (book) {
          if ((newDiv.style.backgroundImage = toggle)) {
            let bookCover = book.cover_edition_key;
            newDiv.style.backgroundImage =
              "url('https://covers.openlibrary.org/b/olid/" +
              bookCover +
              "-M.jpg')";
            pInfo.style.display = "none";
            sentenceP.style.display = "none";
          } else {
            newDiv.style.backgroundImage = "url('paper.jpg')";
            if (book.hasOwnProperty("first_sentence")) {
              sentenceP.style.display = "block";
              let sentence = document.createTextNode(
                firstSentence.first_sentence[0]
              );
              sentenceP.appendChild(sentence);
              newDiv.addEventListener("click", () => {
                sentenceP.style.display = "none";
              });
            } else {
              pInfo.style.display = "block";
            }
          }

          toggle = !toggle;
        } else {
          if ((newDiv.style.backgroundImage = toggle)) {
            newDiv.style.backgroundImage = "url('default_book_cover.jpg')";
            pInfo.style.display = "none";
            sentenceP.style.display = "none";
          } else {
            newDiv.style.backgroundImage = "url('paper.jpg')";
            pInfo.style.display = "block";
          }
          toggle = !toggle;
        }
      };

      newDiv.addEventListener("click", makeBackground, false);
    });
};

const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback.apply(null, args);
    }, wait);
  };
};

const getAutocomplete = debounce(() => {
  const nameInput = document.querySelector(".nameInput");
  nameInput.appendChild(autocomplete);

  fetch(`https://openlibrary.org/search.json?title=${input.value}&limit=10`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const titles = data.docs;
      console.log(titles);
      console.log(input.value);

      let bookTitles = [];
      titles.forEach((array) => bookTitles.push(array.title));
      bookTitles.unshift("");
      autocomplete.innerHTML = bookTitles.join('<p class="elements">');
      const pElements = document.querySelectorAll(".elements");
      pElements.forEach((p) =>
        p.addEventListener("click", () => {
          const innerText = p.innerHTML;
          console.log(innerText);

          const book = data.docs.find((book) =>
            book.hasOwnProperty("cover_edition_key")
          );

          const author = data.docs.find((array) =>
            array.hasOwnProperty("author_alternative_name")
          );

          const authorName = data.docs.find((author) =>
            author.hasOwnProperty("author_name")
          );

          if (book && author) {
            input.value = innerText;
            authorInput.value = author.author_alternative_name[0];
            console.log(input.value);
            console.log(innerText);
          } else if (book && authorName) {
            authorInput.value = author.author_name[0];
          } else {
            authorInput.value = "";
          }

          autocomplete.style.display = "none";
        })
      );
    });
}, 200);

input.addEventListener("keyup", getAutocomplete);
input.addEventListener("keyup", () => {
  autocomplete.style.display = "block";
});

//button focus
//keybord arrow down to go down and arrow up to go up
//start at input
//resolve US Steel book problem
