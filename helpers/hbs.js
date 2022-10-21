module.exports = {
  profileEditIcon: function (loggedUserId, browsedUserId) {
    if (loggedUserId === browsedUserId.toString()) {
      return `<div class="media-right">
      <a href="/profile/settings/${loggedUserId}">
        <span class="icon has-text-dark">
          <i class="fa-solid fa-gears fa-xl"></i>
        </span>
      </a>
    </div>`;
    }
  },

  postDeleteButton: function (loggedUserId, browsedUserId) {
    if (loggedUserId === browsedUserId.toString()) {
      return `<div class="is-top-left-position">
      <button class="button is-white">
        <span class="icon">
          <i class="fa-regular fa-trash-can"></i>
        </span>
      </button>
    </div>`;
    }
  },

  postEditButton: function (loggedUserId, browsedUserId, postId) {
    console.log("🚀 ~ file: hbs.js ~ line 28 ~ browsedUserId", browsedUserId)
    if (loggedUserId === browsedUserId.toString()) {
      console.log('icon edit')
      return `<div class="is-top-right-position">
      <a class="button is-white" href="/post/edit/${postId.toString()}">
        <span class="icon">
        <i class="fa-regular fa-pen-to-square"></i>
        </span>
      </a>
    </div>`;
    }
  },
};
