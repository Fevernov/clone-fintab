import { createRouter } from "next-connect";
import controller from "infra/controller";
import activation from "models/activation";
import { ForbiddenError } from "infra/errors";
import user from "models/user";

const router = createRouter();

router.use(controller.injectAnonymousOrUser);
router.patch(controller.canRequest("read:activation_token"), patchHandler);

export default router.handler(controller.errorHandlers);

async function patchHandler(request, response) {
  const activationTokenId = request.query.token_id;

  const validActivationToken =
    await activation.findOneValidById(activationTokenId);

  const targetUser = await user.findOneByID(validActivationToken.user_id);

  if (!targetUser.features.includes("read:activation_token")) {
    throw new ForbiddenError({
      message: "Você não pode mais utilizar tokens de ativação.",
      action: "Entre em contato com o suporte.",
    });
  }

  await activation.activateUserByUserId(validActivationToken.user_id);

  const usedActivationToken =
    await activation.markTokenAsUsed(activationTokenId);

  return response.status(200).json(usedActivationToken);
}
