const axios = require("axios");

exports.login = (req, res) => {
  console.log(req.body.email, req.body.password, req.body.returnSecureToken);
  const data = {
    email: req.body.email,
    password: req.body.password,
    returnSecureToken: "true"
  };
  axios
    .post(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${process.env.API_KEY}`,
      data
    )
    .then(data => {
      console.log(data.data);
      res.status(200).json({
        status: "success",
        idToken: data.data.idToken,
        email: data.data.email,
        id: data.data.localId
      });
    })
    .catch(err => {
      res.status(500).json({
        status: "fail",
        error: "Something went wrong"
      });
    });
};

exports.register = (req, res) => {
  console.log(req.body.email, req.body.password, req.body.returnSecureToken);
  const data = {
    email: req.body.email,
    password: req.body.password,
    returnSecureToken: "true"
  };
  axios
    .post(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${process.env.API_KEY}`,
      data
    )
    .then(data => {
      console.log(data.data);
      res.status(200).json({
        status: "success",
        idToken: data.data.idToken,
        email: data.data.email,
        id: data.data.localId
      });
    })
    .catch(err => {
      res.status(500).json({
        status: "fail",
        error: "Something went wrong"
      });
    });
};
