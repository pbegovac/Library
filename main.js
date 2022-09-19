let myLibrary = [];
const form = document.querySelector(".form");
const addbook = document.querySelector(".addbook");
const closeForm = document.querySelector(".closeForm");
const bookshelf = document.querySelector(".bookshelf");

form.style.display = "none";
closeForm.style.display = "none";

addbook.addEventListener("click", () => {
  form.style.display = "block";
  closeForm.style.display = "block";
});

closeForm.addEventListener("click", () => {
  form.style.display = "none";
  closeForm.style.display = "none";
});

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    return `Title: ${title} Author: ${author} Pages: ${pages}`;
  };
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let formValue = e.target;

  let nameOfTheBook = new Book(
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
  bookshelf.appendChild(newDiv);

  const readButton = document.createElement("button");
  const buttonText = document.createTextNode("Read");
  const buttonNotRead = document.createTextNode("Not read");

  newDiv.appendChild(readButton);

  newDiv.className = "newDiv";
  newButton.className = "buttons";
  readButton.className = "buttons";

  console.log(readButton.children);

  formValue.read.checked
    ? readButton.appendChild(buttonText)
    : readButton.appendChild(buttonNotRead);

  newButton.addEventListener("click", () => {
    newDiv.remove();
  });

  //popravit ovo togglanje

  readButton.addEventListener("click", () => {
    formValue.read.checked = formValue.read.checked !== true;
    formValue.read.checked
      ? readButton.appendChild(buttonText) &&
        readButton.removeChild(buttonNotRead)
      : readButton.appendChild(buttonNotRead) &&
        readButton.removeChild(buttonText);

    formValue.read.checked === false;
  });

  form.style.display = "none";
  closeForm.style.display = "none";
  (formValue.book.value = ""),
    (formValue.author.value = ""),
    (formValue.pages.value = ""),
    (formValue.read.checked = false);
});

//uredit kartice da su elementi jedan ispod drugog
// kad krenes pisat dobiješ prijedloge iz knjiznice - API
// Napravit arhivu - korisnik se logira i može unutar svojeg usernamea spremat liste
// https://github.com/w3slley/bookcover-api
