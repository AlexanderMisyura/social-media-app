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

    listen() {
      this.form.addEventListener("submit", this.#sendComment);
    }
  }

  const rootCommentForm = new PostComment(document.forms.rootCommentForm);
  rootCommentForm.listen();

  function toggleReplyForm(e) {
    const targetFormContainer = document.getElementById(
      e.currentTarget.dataset.commentId
    );
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
  </article>`;
      targetFormContainer.innerHTML = formHtml;
      const replyFormElement =
        document.forms[e.currentTarget.dataset.commentId];
      const replyForm = new PostComment(replyFormElement);
      replyForm.listen();
    }
  }

  if (document.querySelector(".reply")) {
    const btnReplyCol = document.querySelectorAll(".reply");
    btnReplyCol.forEach((btnReply) =>
      btnReply.addEventListener("click", toggleReplyForm)
    );
  }

  if (document.querySelector(".comment-branch-btn")) {
    class CommentBranch {
      constructor(toggler, container) {
        this.toggler = toggler;
        this.container = container;
        this.isEmpty = true;
        this.isExpanded = false;
      }

      #expandOrCollapseBranch(isExpanded, toggler, container) {
        const icon = toggler.querySelector("i");
        if (isExpanded) {
          icon.classList.remove("fa-angles-down");
          icon.classList.add("fa-angles-up");
          container.classList.remove("is-height-0");
          container.classList.add("is-height-100");
        } else {
          icon.classList.remove("fa-angles-up");
          icon.classList.add("fa-angles-down");
          container.classList.remove("is-height-100");
          container.classList.add("is-height-0");
        }
      }

      async #getComments(commentId, postId) {
        try {
          const comments = await fetch(`/comment/${postId}/${commentId}`, {
            method: "GET",
          });
          await comments.text().then((commentsHtml) => {
            this.container.innerHTML = commentsHtml;
            const btnReplyCol = this.container.querySelectorAll(".reply");
            btnReplyCol.forEach((btnReply) =>
              btnReply.addEventListener("click", toggleReplyForm)
            );
          });
          this.isEmpty = false;
        } catch (error) {
          console.log(error);
          const hui = document.createElement("p");
          hui.innerText = "Huische na vorotnik";
          this.container.appendChild(hui);
        }
      }

      toggle() {
        if (this.isEmpty) {
          const parentCommentId = this.toggler.dataset.parentId;
          const postId = this.toggler.dataset.postId;
          this.#getComments(parentCommentId, postId);
        }

        this.isExpanded = !this.isExpanded;
        this.#expandOrCollapseBranch(
          this.isExpanded,
          this.toggler,
          this.container
        );
      }
    }

    const btnCommentBranchCol = document.querySelectorAll(
      ".comment-branch-btn"
    );
    btnCommentBranchCol.forEach((btnCommentBranch) => {
      const container = btnCommentBranch.parentElement.querySelector(
        ".comment-branch-container"
      );
      const commentBranch = new CommentBranch(btnCommentBranch, container);
      btnCommentBranch.addEventListener("click", () => commentBranch.toggle());
    });
  }
}
