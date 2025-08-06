import { InfisicalSDK, Secret } from "@infisical/sdk";

const client = new InfisicalSDK({});
let secrets: Secret[] = [];

const setup = async () => {
  if (secrets.length > 0) return;
  await client.auth().universalAuth.login({
    clientId: "a195f1b9-8e21-4561-859e-40e17bca1b68",
    clientSecret: process.env.SECRET!,
  });

  const allSecrets = await client.secrets().listSecrets({
    environment: "dev", // stg, dev, prod, or custom environment slugs
    projectId: "361b99f7-3c65-4ba7-aa24-e730be5a1f5f",
  });

  secrets = allSecrets.secrets;
};

export const getSecret = async (key: string) => {
  await setup();
  const secret = secrets.find((s) => s.secretKey === key);
  return secret?.secretValue;
};
