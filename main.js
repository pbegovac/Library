let myLibrary = [];
const form = document.querySelector(".form");
const addbook = document.querySelector(".addbook");
const closeForm = document.querySelector(".closeForm");
const cards = document.querySelector(".cards");

form.style.display = "none";
closeForm.style.display = "none";

addbook.addEventListener("click", () => {
  form.style.display = "block";
  closeForm.style.display = "block";
});

//needs fixing - acts like submit button - check event targeter
closeForm.addEventListener("click", () => {
  form.style.display = "none";
  closeForm.style.display = "none";
  isbn.value = "";
  book.value = "";
  author.value = "";
  pages.value = "";
  read.checked = false;
});

function Book(isbn, title, author, pages, read) {
  this.isbn = isbn;
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

  let nameOfTheBook = new Book(
    formValue.isbn.value,
    formValue.book.value,
    formValue.author.value,
    formValue.pages.value,
    formValue.read.checked
  );

  myLibrary.push(nameOfTheBook.info());

  const newDiv = document.createElement("div");
  const newButton = document.createElement("button");
  const text = document.createTextNode("Remove");
  const before = document.querySelector(".before");

  newDiv.appendChild(newButton);
  newButton.appendChild(text);
  document.body.insertBefore(newDiv, before);

  const readButton = document.createElement("button");
  const buttonText = document.createTextNode("Read");
  const buttonNotRead = document.createTextNode("Not read");
  const infoButton = document.createElement("button");
  const infoText = document.createTextNode("Info");
  newDiv.appendChild(readButton);
  infoButton.appendChild(infoText);
  newDiv.appendChild(infoButton);

  newDiv.className = "newDiv";
  newButton.className = "buttons";
  readButton.className = "buttons";
  infoButton.className = "buttons";

  let isbn = Number(nameOfTheBook.isbn);
  let bookName = nameOfTheBook.title;
  let authorName = nameOfTheBook.author;
  newDiv.style.backgroundImage =
    "url('https://covers.openlibrary.org/b/isbn/" + isbn + "-M.jpg')";

  cards.appendChild(newDiv);

  infoButton.addEventListener("click", () => {
    fetch(
      "https://www.googleapis.com/books/v1/volumes?q=" +
        bookName +
        "+inauthor:" +
        authorName +
        "&key=AIzaSyD5KjQTgCkvSbn5Pr-UIVtvuF4JV0dRkBQ"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  });

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
  (formValue.isbn.value = ""),
    (formValue.book.value = ""),
    (formValue.author.value = ""),
    (formValue.pages.value = ""),
    (formValue.read.checked = false);
});

// kad krenes pisat dobiješ prijedloge iz knjiznice - API
// Napravit arhivu - korisnik se logira i može unutar svojeg usernamea spremat liste
