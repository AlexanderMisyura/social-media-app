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

  friendRequestButton: function (loggedUserId, browsedUserId, isFriend, hasRequest, hasOppositeRequest) {
    if (loggedUserId !== browsedUserId.toString()) {
      if (isFriend) {
        return `<div class="is-top-right-position is-toggle-hidden">
        <form action="/friends/remove/${browsedUserId}?_method=PUT" method="POST">
          <button class="button is-danger is-small is-rounded" type="submit">
            <span class="icon has-text-dark">
              <i class="fa-solid fa-user-slash fa-xl"></i>
            </span>
          </button>
        </form>
      </div>`
      }

      if (hasOppositeRequest) {
        return `<div class="is-top-right-position is-toggle-hidden">
        <form action="/friends/confirm/${browsedUserId}?_method=PUT" method="POST">
          <button class="button is-success is-light is-small is-rounded" type="submit">
            <span class="icon has-text-dark">
              <i class="fa-solid fa-user-check fa-xl"></i>
            </span>
          </button>
        </form>
      </div>
      <div class="is-top-left-position is-toggle-hidden">
        <form action="/friends/reject/${browsedUserId}?_method=PUT" method="POST">
          <button class="button is-danger is-light is-small is-rounded" type="submit">
            <span class="icon has-text-dark">
              <i class="fa-solid fa-user-xmark fa-xl"></i>
            </span>
          </button>
        </form>
      </div>`;
      }

      if (hasRequest) {
        return `<div class="is-top-right-position is-toggle-hidden">
        <form action="/friends/${browsedUserId}?_method=DELETE" method="POST">
          <button class="button is-warning is-light is-small is-rounded" type="submit">
            <span class="icon has-text-dark">
              <i class="fa-solid fa-user-minus fa-xl"></i>
            </span>
          </button>
        </form>
      </div>`;
      }

      if (!hasRequest) {
        return `<div class="is-top-right-position is-toggle-hidden">
        <form action="/friends/${browsedUserId}" method="POST">
          <button class="button is-link is-light is-small is-rounded" type="submit">
            <span class="icon has-text-dark">
              <i class="fa-solid fa-user-plus fa-xl"></i>
            </span>
          </button>
        </form>
      </div>`;
      }

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

  commentDeleteButton: function (loggedUserId, commentUserId, commentId) {
    if (loggedUserId === commentUserId.toString()) {
      return `<div class="is-top-right-position is-toggle-hidden">
      <form action="/comment/${commentId}?_method=PUT" method="post">
        <button class="button is-danger is-small" type="submit">
          <span class="icon">
            <i class="fa-regular fa-trash-can"></i>
          </span>
        </button>
      </form>
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
  <span class="icon has-text-grey-light">
    <i class="fa-regular fa-star fa-lg"></i>
  </span>
  <span class="likeCounter has-text-grey">${postLikes}</span>
</span>`;
    } else {
      return `<span class="icon-text">
  <span
    class="like icon is-clickable has-text-${hasLike ? "warning" : "dark"}"
    data-post-id="${postId}">
    <i class="fa-regular fa-star fa-lg"></i>
  </span>
  <span class="likeCounter has-text-grey">${postLikes}</span>
</span>`;
    }
  },
};
