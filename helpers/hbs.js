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
                            <article class="media is-align-items-stretch">
                              <figure class="media-left">
                                <p class="image is-128x128 is-96x96-mobile">
                                  <a href="/post/${post._id}"><img src="${post.image}"></a>
                                </p>
                              </figure>
                              <div class="media-content is-cropped is-flex is-flex-direction-column is-justify-content-space-between">
                              <div class="content">
                                <h4 class="title is-5 is-cropped">${post.title}</h4>
                                <p class="subtitle is-6 is-cropped">${post.caption}</p>
                              </div>
                              <footer class="is-flex is-justify-content-space-between">
                              <div>
                              <span class="icon has-text-grey">
                                <i class="fa-regular fa-eye fa-lg"></i>
                              </span>
                              </div>
                              <div>
                              <span class="icon has-text-dark">
                                <i class="fa-solid fa-comment fa-lg"></i>
                              </span>
                              </div>
                              <div>
                                <a class="pr-1" href="">
                                  <span class="icon has-text-dark">
                                    <i class="fa-solid fa-share-nodes fa-lg"></i>
                                  </span>
                                </a>
                                <a class="pr-1" href="">
                                  <span class="icon has-text-dark">
                                    <i class="fa-regular fa-bookmark fa-lg"></i>
                                  </span>
                                </a>
                                <a href="">
                                  <span class="icon has-text-dark">
                                    <i class="fa-regular fa-star fa-lg"></i>
                                  </span>
                                </a>
                              </div>
                              </footer>
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
