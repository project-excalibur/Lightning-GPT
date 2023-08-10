export const authOptions = {
    // Configure one or more authentication providers
    providers: [
      {
          id: "alby",
          name: "Alby",
          type: "oauth",
          authorization: `https://getalby.com/oauth?client_id=${process.env.NEXT_PUBLIC_ALBY_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000&scope=account:read%20invoices:create%20invoices:read%20transactions:read%20balance:read%20payments:send`,
          clientId: process.env.NEXT_PUBLIC_ALBY_CLIENT_ID,
          clientSecret: process.env.NEXT_PUBLIC_ALBY_SECRET,
          checks: ["pkce"],
          profile(profile: any) {
            return {
              profile
            }
          },
        }
    ],
  }