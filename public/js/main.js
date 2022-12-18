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

if (document.querySelector("#commentSection")) {
  // Add show/hide reply form to each comment
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
      <form action="/comment" method="POST" name="${e.currentTarget.dataset.commentId}" class="is-flex">
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
    }
  }

  if (document.querySelector(".reply")) {
    const btnReplyCol = document.querySelectorAll(".reply");
    btnReplyCol.forEach((btnReply) =>
      btnReply.addEventListener("click", toggleReplyForm)
    );
  }

  if (document.querySelector(".comment-branch-btn")) {
    // Class is for expand/collapse child comment branches
    // and receive comment data for branch formation
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
            const likeElements = this.container.querySelectorAll(".like");
            likeElements.forEach((likeElement) => {
              const like = new Like(likeElement);
              like.listen();
            });
            const btnReplyCol = this.container.querySelectorAll(".reply");
            btnReplyCol.forEach((btnReply) =>
              btnReply.addEventListener("click", toggleReplyForm)
            );

            // Add listeners to toggle appeared child comment branches
            const btnCommentBranchCol = this.container.querySelectorAll(
              ".comment-branch-btn"
            );
            btnCommentBranchCol.forEach((btnCommentBranch) => {
              const container = btnCommentBranch.parentElement.querySelector(
                ".comment-branch-container"
              );
              const commentBranch = new CommentBranch(
                btnCommentBranch,
                container
              );
              btnCommentBranch.addEventListener("click", () =>
                commentBranch.toggle()
              );
            });
          });
          this.isEmpty = false;
        } catch (error) {
          console.log(error);
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

    // Add listeners to toggle existing child comment branches
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

if (document.getElementById("preview")) {
  const imageInput = document.querySelector(".file-input");
  imageInput.addEventListener("change", previewImage);
  function previewImage(e) {
    const preview = document.getElementById("preview");
    preview.src = URL.createObjectURL(e.target.files[0]);
    preview.addEventListener("load", () => URL.revokeObjectURL(preview.src));
  }
}

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

// Functions to open and close a modal
function openModal(modalElement) {
  modalElement.classList.add("is-active");
}

function closeModal(modalElement) {
  modalElement.classList.remove("is-active");
}

function closeAllModals() {
  (document.querySelectorAll(".modal") || []).forEach((modalElement) => {
    closeModal(modalElement);
  });
}

// Add a click event on buttons to open a specific modal
(document.querySelectorAll(".js-modal-trigger") || []).forEach(
  (modalTriggerOpen) => {
    const targetName = modalTriggerOpen.dataset.targetName;
    const modalElement = document.getElementById(targetName);

    modalTriggerOpen.addEventListener("click", () => {
      openModal(modalElement);
    });
  }
);

// Add a click event on various child elements to close the parent modal
(
  document.querySelectorAll(
    ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
  ) || []
).forEach((modalTriggerClose) => {
  const modalElement = modalTriggerClose.closest(".modal");

  modalTriggerClose.addEventListener("click", () => {
    closeModal(modalElement);
  });
});

// Add a keyboard event to close all modals
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Escape key
    closeAllModals();
  }
});

const navbarBurger = document.querySelector(".navbar-burger");
navbarBurger.addEventListener("click", (e) => {
  const targetName = e.currentTarget.dataset.targetName;
  const navbarMenu = document.getElementById(targetName);

  navbarBurger.classList.toggle("is-active");
  navbarMenu.classList.toggle("is-active");
});

if (document.querySelector(".js-tab-trigger")) {
  const tabTriggers = document.querySelectorAll(".js-tab-trigger");
  const tabContentBlocks = document.querySelectorAll(".tab");

  const updateTabs = (newActiveTabTrigger) => {
    tabTriggers.forEach((tabTrigger) =>
      tabTrigger.classList.remove("is-active")
    );
    newActiveTabTrigger.classList.add("is-active");
  };

  const updateContent = (activeTrigger) => {
    const activeContentBlock = document.getElementById(
      activeTrigger.dataset.tab
    );
    tabContentBlocks.forEach((block) => {
      block.classList.add("is-hidden");
    });
    activeContentBlock.classList.remove("is-hidden");
  };

  tabTriggers.forEach((tabTrigger) => {
    tabTrigger.addEventListener("click", (e) => {
      updateTabs(e.currentTarget);
      updateContent(e.currentTarget);
    });
  });
}
