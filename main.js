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

form.style.display = "none";
closeForm.style.display = "none";

addbook.addEventListener("click", () => {
  form.style.display = "block";
  closeForm.style.display = "block";
  input.focus();
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
    return title + " " + author + " " + "Pages: " + pages;
  };
}

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
      const titles = data.docs;

      let bookTitles = [];
      titles.forEach((array) => bookTitles.push(array.title));
      bookTitles.unshift("");
      autocomplete.innerHTML = bookTitles.join('<p class="elements">');

      const pElements = document.querySelectorAll(".elements");

      pElements.forEach((p) =>
        p.addEventListener("click", () => {
          const innerText = p.innerHTML;
          input.value = innerText;

          const cover = data.docs.find((cover) =>
            cover.hasOwnProperty("cover_edition_key")
          );

          const bookTitle = data.docs.find(
            (bookTitle) => bookTitle.title === input.value
          );

          console.log(bookTitle);

          if (cover && bookTitle) {
            authorInput.value = bookTitle.author_name[0];
            pages.value = bookTitle.number_of_pages_median;
          } else {
            authorInput.value = "";
            pages.value = "";
          }

          autocomplete.style.display = "none";
        })
      );

      let highlightArrows = () => {
        let pArray = Array.from(pElements);
        pArray.forEach((p) => (p.tabIndex = 0));
        console.log(pArray);
        let iterator = pArray.values();
        let currentElementArray = [];

        input.addEventListener("keydown", (e) => {
          if (input.value !== "" && e.key === "ArrowDown") {
            let firstElement = pArray[0];
            firstElement.focus();

            pArray.forEach((p) =>
              p.addEventListener("keydown", (e) => {
                if (e.key === "ArrowDown") {
                  goDown();
                } else if (e.key === "ArrowUp") {
                  goUp();
                }

                if (e.key === "Enter") {
                  const bookTitle = data.docs.find(
                    (bookTitle) => bookTitle.title === input.value
                  );
                  authorInput.value = bookTitle.author_name[0];
                  pages.value = bookTitle.number_of_pages_median;
                  autocomplete.style.display = "none";
                }
              })
            );
          }

          let goDown = () => {
            let currentElement = iterator.next().value;
            currentElementArray.unshift(currentElement);

            if (currentElement) {
              let theElement = currentElementArray[0].innerHTML;
              let firstElement = currentElementArray[0];
              let secondElement = currentElementArray[1];

              firstElement.className = "arrowElements";
              secondElement.classList.remove("arrowElements");

              input.value = theElement;
            }

            // if there is a previous element remove class from him
          };
          let goUp = () => {
            console.log();

            //focus current element
            //if there is a previous element remove class from him
            // give class to current element
            // input.value = currentElement.HTML
          };
        });
      };

      highlightArrows();
    });
}, 200);

let clickForm = () => {
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

    newButton.addEventListener("click", (e) => {
      e.stopPropagation();
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
};

let getCover = (book, newDiv) => {
  let pInfo = document.createElement("p");
  let pText = document.createTextNode(book.info());

  pInfo.appendChild(pText);
  pInfo.style.fontFamily = "Caveat";
  newDiv.appendChild(pInfo);
  pInfo.style.display = "none";

  fetch("https://openlibrary.org/search.json?q=" + input.value)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      //some books  dont have this data.docs => TypeError: Cannot read properties of undefined (reading '0')
      const authorName = data.docs.find(
        (authorName) => authorName.author_name[0] === authorInput.value
      );

      const cover = data.docs.find((cover) =>
        cover.hasOwnProperty("cover_edition_key")
      );

      if (authorName && cover) {
        let bookCover = cover.cover_edition_key;
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
      let toggleBackground = () => {
        let sentenceP = document.createElement("p");
        sentenceP.className = "fit";
        newDiv.appendChild(sentenceP);
        sentenceP.style.display = "none";

        if (authorName && cover) {
          if ((newDiv.style.backgroundImage = toggle)) {
            let bookCover = cover.cover_edition_key;
            newDiv.style.backgroundImage =
              "url('https://covers.openlibrary.org/b/olid/" +
              bookCover +
              "-M.jpg')";
            pInfo.style.display = "none";
            sentenceP.style.display = "none";
          } else {
            newDiv.style.backgroundImage = "url('paper.jpg')";
            if (authorName.hasOwnProperty("first_sentence")) {
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

      newDiv.addEventListener("click", toggleBackground, false);
    });
};

document.addEventListener("click", (e) => {
  if (!autocomplete.contains(e.target)) {
    autocomplete.style.display = "none";
  }
});
input.addEventListener("keyup", getAutocomplete);
clickForm();
input.addEventListener("keyup", () => {
  autocomplete.style.display = "block";
});

//button.appendChild toggle problem
//keybord arrow down to go down and arrow up to go up
//if knows author => fill input.value
