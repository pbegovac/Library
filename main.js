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
});

function Book(isbn, title, author, pages, read) {
  this.isbn = isbn;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    return ``;
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
  const content = document.createTextNode(myLibrary.shift());
  const newButton = document.createElement("button");
  const text = document.createTextNode("Remove");
  const before = document.querySelector(".before");
  newDiv.appendChild(content);
  newDiv.appendChild(newButton);
  newButton.appendChild(text);
  document.body.insertBefore(newDiv, before);

  const readButton = document.createElement("button");
  const buttonText = document.createTextNode("Read");
  const buttonNotRead = document.createTextNode("Not read");
  newDiv.appendChild(readButton);

  newDiv.className = "newDiv";
  newButton.className = "buttons";
  readButton.className = "buttons";
  let isbn = Number(nameOfTheBook.isbn);
  newDiv.style.backgroundImage =
    "url('https://covers.openlibrary.org/b/isbn/" + isbn + "-M.jpg')";

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
  (formValue.isbn.value = ""),
    (formValue.book.value = ""),
    (formValue.author.value = ""),
    (formValue.pages.value = ""),
    (formValue.read.checked = false);
});

// kad krenes pisat dobiješ prijedloge iz knjiznice - API
// Napravit arhivu - korisnik se logira i može unutar svojeg usernamea spremat liste
