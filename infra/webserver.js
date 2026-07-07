function getOrigin() {
  if (["test", "development"].includes(process.env.NODE_ENV)) {
    return "http://localhost:3000";
  }

  if (process.env.VERCEL_ENV === "preview") {
    return `https://${ProcessingInstruction.env.VERCEL_URL}`;
  }
  return "https://fintab.com.br";
}

const webserver = {
  origin: getOrigin(),
};

export default webserver;
