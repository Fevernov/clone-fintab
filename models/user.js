import database from "infra/database.js";
import { ValidationError } from "infra/errors.js";

async function create(userInputValues) {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueuUsername(userInputValues.username);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueEmail(email) {
    const result = await database.query({
      text: "SELECT email FROM users WHERE LOWER(email) = LOWER($1);",
      values: [email],
    });

    if (result.rowsCount > 0) {
      throw new ValidationError({
        message: "O email informado já está sendo utilizado.",
        action: "Utilize um email diferente.",
      });
    }
  }

  async function validateUniqueuUsername(username) {
    const result = await database.query({
      text: "SELECT username FROM users WHERE LOWER(username) = LOWER($1);",
      values: [username],
    });

    if (result.rowsCount > 0) {
      throw new ValidationError({
        message: "O username informado já está sendo utilizado.",
        action: "Utilize um username diferente.",
      });
    }
  }

  async function runInsertQuery(userInputValues) {
    const result = await database.query({
      text: "INSERT INTO users (username, email, passaword) VALUES ($1, $2, $3) RETURNING *;",
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.passaword,
      ],
    });

    return result.rows[0];
  }
}

const user = {
  create,
};

export default user;
