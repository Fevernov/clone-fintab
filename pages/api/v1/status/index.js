function status(request, response) {
  response.status(200).json({ mensagem: "to mexendo na internet" });
}

export default status;
