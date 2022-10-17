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

  populateProfilePosts: function (posts) {
    let result = "";
    for (let i = 0, j = 0; i < posts.length; i++, j++) {
      let post = posts[i];
      let parentTile = `<div class="tile is-parent is-6">
                          <div class="tile box is-child is-max-width-100">
                            <article class="media">
                              <figure class="media-left">
                                <p class="image is-128x128">
                                  <img src="${post.image}">
                                </p>
                              </figure>
                              <div class="media-content is-cropped">
                              <div class="">
                                <h4 class="title is-5 is-cropped">${post.title}</h4>
                                <p class="subtitle is-6 is-cropped">${post.caption}</p>
                              </div>
                              </div>
                            </article>
                          </div>
                        </div>`
      if (j % 2 === 0) {
        result += `<div class="tile is-ancestor"> ${parentTile}`;
      } else {
        result += `${parentTile} </div>`;
      }
    }
    if (posts.length % 2 === 1) {
      result += "</div>";
    }
    return result;
  },
};
