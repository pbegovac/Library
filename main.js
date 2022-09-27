let myLibrary = [];
let titles = [];
let authors = [];
const form = document.querySelector(".form");
const addbook = document.querySelector(".addbook");
const closeForm = document.querySelector(".closeForm");
const cards = document.querySelector(".cards");
let input = document.querySelector("#book");
const autocomplete = document.querySelector(".autocomplete");
let authorInput = document.querySelector("#author");

autocomplete.style.display = "none";
form.style.display = "none";
closeForm.style.display = "none";

addbook.addEventListener("click", () => {
  form.style.display = "block";
  closeForm.style.display = "block";
});

closeForm.addEventListener("click", () => {
  form.style.display = "none";
  closeForm.style.display = "none";
  autocomplete.style.display = "none";
  Book.value = "";
  Book.author.value = "";
  Book.pages.value = "";
  Book.read.checked = false;
});

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    return `${title} by ${author}, ${pages} pages`;
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
  const infoButton = document.createElement("button");
  const infoText = document.createTextNode("Info");

  buttonsDiv.appendChild(readButton);
  infoButton.appendChild(infoText);
  buttonsDiv.appendChild(infoButton);

  newDiv.className = "newDiv";
  newButton.className = "buttons";
  readButton.className = "buttons";
  infoButton.className = "buttons";
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
  (formValue.book.value = ""),
    (formValue.author.value = ""),
    (formValue.pages.value = ""),
    (formValue.read.checked = false);

  bookTitles = [];

  autocomplete.style.display = "none";
  autocomplete.innerHTML = "";
});

let getCover = (book, newDiv) => {
  let bookName = book.title;
  fetch("https://openlibrary.org/search.json?q=" + bookName)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const book = data.docs.find((book) =>
        book.hasOwnProperty("cover_edition_key")
      );

      if (book) {
        const bookCover = book.cover_edition_key;
        newDiv.style.backgroundImage =
          "url('https://covers.openlibrary.org/b/olid/" +
          bookCover +
          "-M.jpg')";
      } else {
        newDiv.style.backgroundImage = "url(defaullt_book_cover.jpg)";
      }
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

input.addEventListener("click", () => {
  autocomplete.style.display = "block";
});

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
}, 1);

console.log(autocomplete.innerHTML);

input.addEventListener("keyup", getAutocomplete);
// arrayLines.addEventListener("click", () => {});
// autocomplete.addEventListener("mouseover", () => {
//   bookTitles.style. = "red";
// });
