if (document.querySelector("#commentSection")) {
  class RootComment {
    constructor(rootCommentForm) {
      this.form = rootCommentForm;
    }

    // async #toggleLike() {
    //   const route = `/like/post/${this.dataset.postId}`;
    //   let resPromise = await fetch(route, {
    //     method: "PUT",
    //   });
    //   let res = await resPromise.json();
    //   if (res) {
    //     this.classList.toggle("has-text-warning");
    //     this.classList.toggle("has-text-dark");
    //     this.parentElement.querySelector("#likeCounter").textContent =
    //       res.storyLikes || 0;
    //     if (document.querySelector("#userRating")) {
    //       document.querySelector("#userRating").textContent = res.userRating;
    //     }
    //   }
    // }

    async #sendComment(e) {
      e.preventDefault();
      const content = this.querySelector("textarea").value;
      console.log(content);
      console.log("hello from form");
      let resPromise = await fetch(this.action, {
        method: "POST",
        body: content,
      });
      let res = await resPromise.json();
      console.log(res);
    }

    listen() {
      this.form.addEventListener("submit", this.#sendComment);
    }
  }

  let rootCommentForm = new RootComment(
    document.querySelector("#rootCommentForm")
  );
  rootCommentForm.listen();
}
