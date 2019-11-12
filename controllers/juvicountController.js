exports.login = (req, res) => {
  res.status(200).json({
    status: "success",
    results: 4,
    data: ["some", "stuff", "I", "wanted"]
  });
};
