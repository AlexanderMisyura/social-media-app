if (document.querySelector("#like")) {
  class Like {
    constructor() {
      this.likeElement = document.querySelector("#like");
    }

    async #toggleLike() {
      const route = `/like/post/${this.dataset.postId}`;
      console.log(route);
      let resPromise = await fetch(route, {
        method: "PUT",
      });
      let res = await resPromise.text();
      console.log(res);

      // if (res.doesUserLike) {
      //   this.classList.add("green");
      // } else {
      //   this.classList.remove("green");
      // }
      // this.querySelector("span").textContent = res.storyLikes;
      // document.querySelector("#userRating").textContent = res.userRating;
    }

    listen() {
      this.likeElement.addEventListener("click", this.#toggleLike);
    }
  }

  let like = new Like();
  like.listen();
}
