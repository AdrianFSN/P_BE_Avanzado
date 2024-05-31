class LangController {
  changeLocale(req, res, next) {
    const locale = req.params.locale;

    res.cookie("nodepop-locale", locale, {
      maxAge: 1000 * 60 * 60 * 24 * 15,
    });

    res.redirect("back");
  }
}

module.exports = LangController;
