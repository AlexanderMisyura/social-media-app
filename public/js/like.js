if (document.querySelector(".like")) {
  class Like {
    constructor(element) {
      this.likeElement = element;
    }

    async #toggleLike() {
      const route = this.likeElement.dataset.isCommentLike
        ? `/like/comment/${this.likeElement.dataset.commentId}`
        : `/like/post/${this.likeElement.dataset.postId}`;
      try {
        const resPromise = await fetch(route, {
          method: "PUT",
        });
        const res = await resPromise.json();
        if (res) {
          this.likeElement.classList.toggle("has-text-warning");
          this.likeElement.classList.toggle("has-text-dark");
          this.likeElement.parentElement.querySelector(
            ".likeCounter"
          ).textContent = res.likes || 0;
          if (document.querySelector("#userRating")) {
            document.querySelector("#userRating").textContent = res.userRating;
          }
        }
      } catch (error) {
        console.error(error);
      }
    }

    listen() {
      this.likeElement.addEventListener("click", () => this.#toggleLike());
    }
  }

  for (let likeElement of document.querySelectorAll(".like")) {
    let like = new Like(likeElement);
    like.listen();
  }
}
