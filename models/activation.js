import database from "infra/database";
import email from "infra/email";
import webserver from "infra/webserver";

const EXPIRATION_IN_MILLISECONDS = 60 * 15 * 1000; // 15 minutos

async function create(userID) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);

  const newToken = await runInsertQuery(userID, expiresAt);
  return newToken;

  async function runInsertQuery(userID, expiresAt) {
    const results = await database.query({
      text: `
      INSERT INTO
        user_activation_tokens (user_id, expires_at)
      VALUES
        ($1, $2)
      RETURNING
        *
      ;`,
      values: [userID, expiresAt],
    });

    return results.rows[0];
  }
}

async function findOneByUserID(userID) {
  const newToken = await runSelectQuery(userID);
  return newToken;

  async function runSelectQuery(userID) {
    const results = await database.query({
      text: `
      SELECT
        *
      FROM
       user_activation_tokens
      WHERE
        user_id = $1
      LIMIT
        1
      ;`,
      values: [userID],
    });

    return results.rows[0];
  }
}

async function sendEmailToUser(user, activationToken) {
  await email.send({
    from: "FinTab <contato@fintab.com.br>",
    to: user.email,
    subject: "Ative seu cadastro no FinTab!",
    text: `${user.username}, clique no link abaixo para ativar sua conta no FinTab:
        
${webserver.origin}/cadastro/ativar/${activationToken.id}

Atenciosamente,
Equipe FinTab`,
  });
}

const activation = {
  sendEmailToUser,
  create,
  findOneByUserID,
};

export default activation;
