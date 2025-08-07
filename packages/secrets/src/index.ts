/* eslint-disable no-console -- no need */
/* eslint-disable prefer-destructuring -- no need */
import { InfisicalSDK } from "@infisical/sdk";
import { config } from "dotenv";
import { writeFileSync } from "fs";
import path from "path";

config({
  path: [path.resolve(__dirname, "../../../.env"), "./.env", "../.env"],
});

const client = new InfisicalSDK({});

const setup = async () => {
  const SECRET = process.env.SECRET;
  if (!SECRET) {
    throw new Error(
      "Please set the SECRET environment variable in your root .env file.",
    );
  }
  await client.auth().universalAuth.login({
    clientId: "c7795b2e-52cc-4771-8560-d3a9fbb502f5",
    clientSecret: SECRET,
  });

  const allSecrets = await client.secrets().listSecrets({
    environment: "dev", // stg, dev, prod, or custom environment slugs
    projectId: "361b99f7-3c65-4ba7-aa24-e730be5a1f5f",
  });

  const secrets =
    allSecrets.secrets?.map(({ secretKey, secretValue }) => ({
      secretKey,
      secretValue,
    })) ?? [];

  return { secrets, secretKey: SECRET };
};

const main = async () => {
  try {
    const { secretKey, secrets } = await setup();
    console.log("Infisical secrets initialized successfully.");

    // write all secrets to .env at root
    const envFilePath = path.resolve(__dirname, "../../../.env");
    writeFileSync(envFilePath, `SECRET=${secretKey}\n`, {
      encoding: "utf8",
      flag: "w", // overwrite the file
    });
    secrets.forEach(({ secretKey, secretValue }) => {
      writeFileSync(envFilePath, `${secretKey}=${secretValue}\n`, {
        encoding: "utf8",
        flag: "a", // append to the file
      });
    });
  } catch (err: any) {
    console.error(err);
    process.exit(1);
  }
};

void main();
