# Library

#Odin - Library project - constructor exercise

#Using OpenLibrary API to display covers of books

#Using OpenLibrary Search API to make autocomplete on user input

Live demo - https://pbegovac.github.io/Library/

const innerText = p.innerHTML;
input.value = innerText;

          //ako je cover_edition_key.title = author_alternative.name.title ili ako je cover_edition_key.title = author_name ili ""
          const cover = data.docs.find((photo) =>
            photo.hasOwnProperty("edition_key")
          );
          console.log(cover);
          const book = data.docs.find(
            (book) => (book.title_suggest = input.value)
          );

          console.log(book);

          const bookAuthorName = book.hasOwnProperty("author_alternative_name");
          const bookAuthorAltName = book.hasOwnProperty("author_name");

          console.log(bookAuthorName);
          console.log(bookAuthorAltName);

          console.log(book.title_suggest);

          if (book && bookAuthorAltName) {
            authorInput.value = book.author_name[0];
            console.log(1);
            console.log(data.docs[0].edition_key);
          } else if (book && bookAuthorName) {
            authorInput.value = book.author_alternative_name[0];
            console.log(2);
          } else {
            authorInput.value = "";
            console.log(3);
          }
