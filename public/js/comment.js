if (document.querySelector("#commentSection")) {
  class PostComment {
    constructor(form) {
      this.form = form;
    }

    async #sendComment(e) {
      e.preventDefault();
      try {
        let resPromise = await fetch("/comment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: this.content.value,
            post: this.post.value,
            replyTo: this.replyTo?.value || null,
          }),
        });
        let res = await resPromise.json();
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    }

    #expandBranch(e) {}

    listen() {
      this.form.addEventListener("submit", this.#sendComment);
    }
  }

  const rootCommentForm = new PostComment(document.forms.rootCommentForm);
  rootCommentForm.listen();

  if (document.querySelector(".reply")) {
    function toggleReplyForm(e) {
      const targetFormContainer = document.getElementById(e.currentTarget.dataset.commentId);
      if (targetFormContainer.hasChildNodes()) {
        targetFormContainer.innerHTML = "";
      } else {
        const formHtml = `<article class="media">
      <figure class="media-left mr-2">
        <p class="image is-24x24">
          <a class="has-text-dark" href="/profile/${e.currentTarget.dataset.loggedUserId}">
            <img
              class="is-rounded"
              src="${e.currentTarget.dataset.loggedUserImage}"
              alt="${e.currentTarget.dataset.loggedUserName}'s avatar"
            />
          </a>
        </p>
      </figure>
      <div class="media-content">
        <a class="has-text-dark" href="/profile/${e.currentTarget.dataset.loggedUserId}">
          <p class="title is-6 is-clipped is-inline-block">${e.currentTarget.dataset.loggedUserName}</p>
        </a>
        <form name="${e.currentTarget.dataset.commentId}" class="is-flex">
          <input type="hidden" name="post" value="${e.currentTarget.dataset.postId}">
          <input type="hidden" name="replyTo" value="${e.currentTarget.dataset.commentId}">

          <div class="field is-flex-grow-1 mb-0">
            <p class="control">
              <textarea
                class="textarea"
                placeholder="Add a comment..."
                rows="1"
                required
                name="content"
              ></textarea>
            </p>
          </div>
          <div class="field is-align-self-flex-end">
            <p class="control">
              <button class="button is-small ml-1" type="submit">Post</button>
            </p>
          </div>
        </form>
      </div>
    </article>`
        targetFormContainer.innerHTML = formHtml;
        const replyFormElement = document.forms[e.currentTarget.dataset.commentId];
        const replyForm = new PostComment(replyFormElement);
        replyForm.listen();
      }
    }

    const btnReplyCol = document.querySelectorAll(".reply");
    btnReplyCol.forEach((btnReply) =>
    btnReply.addEventListener("click", toggleReplyForm)
    );
  }
}
