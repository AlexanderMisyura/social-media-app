module.exports = {
  dateToLocale: function (date, locale) {
    return new Date(date).toLocaleString(locale, {
      // weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  },
};
