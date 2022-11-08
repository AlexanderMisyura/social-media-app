module.exports = {
  profileEditButton: function (loggedUserId, browsedUserId) {
    if (loggedUserId === browsedUserId.toString()) {
      return `<div class="is-top-right-position is-toggle-hidden">
      <a class="button is-white is-small is-rounded" href="/profile/settings/${loggedUserId}">
        <span class="icon has-text-dark">
          <i class="fa-solid fa-gears fa-xl"></i>
        </span>
      </a>
    </div>`;
    }
  },

  postDeleteButton: function (loggedUserId, browsedUserId) {
    if (loggedUserId === browsedUserId.toString()) {
      return `<div class="is-top-left-position is-toggle-hidden">
      <button class="button is-danger js-modal-trigger" data-target-name="modal-delete-message">
        <span class="icon">
          <i class="fa-regular fa-trash-can"></i>
        </span>
      </button>
    </div>`;
    }
  },

  commentDeleteButton: function (loggedUserId, commentUserId) {
    if (loggedUserId === commentUserId.toString()) {
      return `<div class="is-top-right-position is-toggle-hidden">
      <button class="button is-danger is-small">
        <span class="icon">
          <i class="fa-regular fa-trash-can"></i>
        </span>
      </button>
    </div>`
    }
  },

  postEditButton: function (loggedUserId, browsedUserId, postId) {
    if (loggedUserId === browsedUserId.toString()) {
      return `<div class="is-top-right-position is-toggle-hidden">
      <a class="button is-white" href="/post/edit/${postId.toString()}">
        <span class="icon">
        <i class="fa-regular fa-pen-to-square"></i>
        </span>
      </a>
    </div>`;
    }
  },

  likeIcon: function ( loggedUserId, postAuthorId, hasLike, postId, postLikes) {
    if (loggedUserId === postAuthorId.toString()) {
      return `<span class="icon-text">
  <span class="icon has-text-grey">
    <i class="fa-regular p-1 fa-star fa-lg"></i>
  </span>
  <span class="likeCounter">${postLikes}</span>
</span>`;
    } else {
      return `<span class="icon-text">
  <span
    class="like icon is-clickable has-text-${hasLike ? "warning" : "dark"}"
    data-post-id="${postId}">
    <i class="fa-regular p-1 fa-star fa-lg"></i>
  </span>
  <span class="likeCounter">${postLikes}</span>
</span>`;
    }
  },
};
