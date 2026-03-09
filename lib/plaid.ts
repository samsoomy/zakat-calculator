import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

let client: PlaidApi | null = null;

export function getPlaidClient(): PlaidApi {
  if (!client) {
    const env = process.env.PLAID_ENV || "sandbox";
    const config = new Configuration({
      basePath:
        PlaidEnvironments[env as keyof typeof PlaidEnvironments] ??
        PlaidEnvironments.sandbox,
      baseOptions: {
        headers: {
          "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID!,
          "PLAID-SECRET": process.env.PLAID_SECRET!,
        },
      },
    });
    client = new PlaidApi(config);
  }
  return client;
}
