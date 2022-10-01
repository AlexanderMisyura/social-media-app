module.exports = {
  getIndex: (req, res) => {
    res.render("loginSection", { layout: "login" });
  },
};
