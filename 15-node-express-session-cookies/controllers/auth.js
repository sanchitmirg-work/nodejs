exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn)
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  // res.setHeaders('Set-Cookie', 'isLoggedIn=true')
  req.session.isLoggedIn = true;
  res.redirect('/')
};
