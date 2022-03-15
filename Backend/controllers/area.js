module.exports.hello = (req, res) => {
  req.session = null;
  res.status(200).json({ message: "Hello World !" });
};