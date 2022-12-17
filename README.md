# Socister
A full stack social media website.
<br>

## Features:
 - user login/registration
 - user profile dashboard
 - manageable categories:
   - posts (can be public, private, visible only to friends. Users can add new, edit or delete existing own posts.)
   - comments (when deleting a comment, it is marked as *Comment was deleted* if it has non-deleted replies, otherwise it is completely deleted )
   - bookmarks (save/delete posts to a separate list)
   - friends (send/cancel own friend request, accept/reject someone else's request, remove a user from friends list)
 - post and comment likes (increase user rating)

**Link to project:** https://socister.onrender.com

![Socister gif](https://i.ibb.co/ySkxSJG/socister3.gif)

## How It's Made:

**Tech used:**
 - HTML, CSS, Bulma CSS framework, Handlebars templating engine
 - JavaScript, Node.js
 - MVC paradigm
 - Express web framework
 - MongoDB
 - Cloudinary Node.js SDK

## Optimizations
- Add UI error messages
- Add google auth
- Search
- Add email confirmation
- Should separate the client part and use front end library/framework.

## Lessons Learned:
 - improved skills of interaction with a DB
 - learned more about authorization methods