let myLibrary = [];
let titles = [];

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

let book = (title, author, pages, read) => {
  const info = () => {
    return title + " " + author + " " + "Pages: " + pages;
  };
  return {
    title,
    author,
    pages,
    read,
    info,
  };
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

        input.addEventListener("keydown", (e) => {
          if (input.value !== "" && e.key === "ArrowDown") {
            let firstElement = pArray[0];
            firstElement.focus();
            firstElement.className = "arrowElements";
            input.value = firstElement.innerHTML;

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
            let startElement = document.activeElement;
            let moveElement = pArray[pArray.indexOf(startElement) + 1];

            if (moveElement) {
              moveElement.focus();
              moveElement.className = "arrowElements";
              startElement.classList.remove("arrowElements");
              input.value = moveElement.innerHTML;
            }
          };

          let goUp = () => {
            let startElement = document.activeElement;
            let moveElement = pArray[pArray.indexOf(startElement) - 1];

            if (moveElement) {
              moveElement.focus();
              moveElement.className = "arrowElements";
              startElement.classList.remove("arrowElements");
              input.value = moveElement.innerHTML;
            }
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

    let newbook = book(
      formValue.book.value,
      formValue.author.value,
      formValue.pages.value,
      formValue.read.checked
    );

    myLibrary.push(newbook.info());

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

    getCover(newbook, newDiv);

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

let getCover = (a, b) => {
  let pInfo = document.createElement("p");
  let pText = document.createTextNode(a.info());

  console.log(a.info());

  pInfo.appendChild(pText);
  pInfo.style.fontFamily = "Caveat";
  b.appendChild(pInfo);
  pInfo.style.display = "none";

  fetch("https://openlibrary.org/search.json?q=" + input.value)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      const cover = data.docs.find((cover) =>
        cover.hasOwnProperty("cover_edition_key")
      );

      const bookTitle = data.docs.find(
        (bookTitle) => bookTitle.title === input.value
      );

      if (cover && bookTitle === cover) {
        let bookCover = cover.cover_edition_key;
        b.style.backgroundImage =
          "url('https://covers.openlibrary.org/b/olid/" +
          bookCover +
          "-M.jpg')";
      } else {
        b.style.backgroundImage = "url('default_book_cover.jpg')";
      }

      const firstSentence = data.docs.find((sentence) =>
        sentence.hasOwnProperty("first_sentence")
      );

      let toggle = false;
      let toggleBackground = () => {
        let sentenceP = document.createElement("p");
        sentenceP.className = "fit";
        b.appendChild(sentenceP);
        sentenceP.style.display = "none";

        if (cover && bookTitle === cover) {
          if ((b.style.backgroundImage = toggle)) {
            let bookCover = cover.cover_edition_key;
            b.style.backgroundImage =
              "url('https://covers.openlibrary.org/b/olid/" +
              bookCover +
              "-M.jpg')";
            pInfo.style.display = "none";
            sentenceP.style.display = "none";
          } else {
            b.style.backgroundImage = "url('paper.jpg')";
            if (bookTitle.hasOwnProperty("first_sentence")) {
              sentenceP.style.display = "block";
              let sentence = document.createTextNode(
                firstSentence.first_sentence[0]
              );
              sentenceP.style.fontFamily = "Caveat";
              sentenceP.appendChild(sentence);
              b.addEventListener("click", () => {
                sentenceP.style.display = "none";
              });
            } else {
              pInfo.style.display = "block";
            }
          }
          toggle = !toggle;
        } else {
          if ((b.style.backgroundImage = toggle)) {
            b.style.backgroundImage = "url('default_book_cover.jpg')";
            pInfo.style.display = "none";
            sentenceP.style.display = "none";
          } else {
            b.style.backgroundImage = "url('paper.jpg')";
            pInfo.style.display = "block";
          }
          toggle = !toggle;
        }
      };

      b.addEventListener("click", toggleBackground, false);
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
