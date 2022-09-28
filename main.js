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

  const readButton = document.createElement("button");
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
  readButton.addEventListener("click", () => {
    formValue.read.checked = formValue.read.checked !== true;
    formValue.read.checked
      ? readButton.appendChild(buttonText) &&
        readButton.removeChild(buttonNotRead)
      : readButton.appendChild(buttonNotRead) &&
        readButton.removeChild(buttonText);
  });

  form.style.display = "none";
  closeForm.style.display = "none";

  bookTitles = [];

  autocomplete.style.display = "none";
  autocomplete.innerHTML = "";
});

let getCover = (book, newDiv) => {
  let bookName = book.title;
  let pInfo = document.createElement("p");
  let pText = document.createTextNode(book.info());
  pInfo.appendChild(pText);
  pInfo.style.color = "#f3f3f3";
  pInfo.style.margin = "15px";
  newDiv.appendChild(pInfo);
  pInfo.style.display = "none";
  fetch("https://openlibrary.org/search.json?q=" + bookName)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const book = data.docs.find((book) =>
        book.hasOwnProperty("cover_edition_key")
      );

      if (book) {
        let bookCover = book.cover_edition_key;
        newDiv.style.backgroundImage =
          "url('https://covers.openlibrary.org/b/olid/" +
          bookCover +
          "-M.jpg')";
      } else {
        newDiv.style.backgroundImage = "url('default_book_cover.jpg')";
        pInfo.style.display = "block";
      }

      let toggle = false;
      let makeBackground = () => {
        let bookCover = book.cover_edition_key;

        if ((newDiv.style.backgroundImage = toggle)) {
          newDiv.style.backgroundImage =
            "url('https://covers.openlibrary.org/b/olid/" +
            bookCover +
            "-M.jpg')";
          pInfo.style.display = "none";
        } else {
          newDiv.style.backgroundImage = "url('paper.jpg')";
          pInfo.style.display = "block";
          pInfo.style.color = "black";
        }

        toggle = !toggle;
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

      let bookTitles = [];
      titles.forEach((array) => bookTitles.push(array.title));
      bookTitles.unshift("");
      autocomplete.innerHTML = bookTitles.join('<p class="elements">');
      const pElements = document.querySelectorAll(".elements");
      pElements.forEach((p) =>
        p.addEventListener("click", () => {
          const innerText = p.innerHTML;
          input.value = innerText;

          const author = data.docs.find((array) =>
            array.title.includes(innerText)
          );

          author.hasOwnProperty("author_name")
            ? (authorInput.value = author.author_name[0])
            : author.hasOwnProperty("author_alternative_name")(
                (authorInput.value = author.author_alternative_name[0])
              );

          autocomplete.style.display = "none";
        })
      );
    });
}, 200);

input.addEventListener("keyup", getAutocomplete);
input.addEventListener("click", () => {
  autocomplete.style.display = "block";
});
