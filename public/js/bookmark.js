if (document.querySelector(".bookmark")) {
  class Bookmark {
    constructor(element) {
      this.bookmarkElement = element;
    }

    async #toggleBookmark() {
      try {
        let resPromise = await fetch(
          `/bookmarks/${this.bookmarkElement.dataset.postId}`,
          {
            method: "PUT",
          }
        );
        let res = await resPromise.json();
        if (res) {
          this.bookmarkElement.classList.toggle("has-text-success");
          this.bookmarkElement.classList.toggle("has-text-dark");
          document.querySelector(".bookmarkCounter").textContent =
            res.bookmarks || 0;
        }
      } catch (error) {
        console.error(error);
      }
    }

    listen() {
      this.bookmarkElement.addEventListener("click", () =>
        this.#toggleBookmark()
      );
    }
  }

  for (let bookmarkElement of document.querySelectorAll(".bookmark")) {
    let bookmark = new Bookmark(bookmarkElement);
    bookmark.listen();
  }
}
