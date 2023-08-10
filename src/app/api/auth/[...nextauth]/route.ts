import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';

export interface AlbyProfile {
    identifier: string;
    email: string;
    name: string;
    avatar: string;
    keysend_custom_key: string;
    keysend_custom_value: string;
    keysend_pubkey: string;
    lightning_address: string;
    nostr_pubkey: string;
}

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers
    providers: [
        {
            id: "alby",
            name: "Alby",
            type: "oauth",
            authorization: {
                url: 'https://getalby.com/oauth',
                params: {
                    scope: 'account:read invoices:create invoices:read transactions:read balance:read payments:send',
                }
            },
            // authorization: `https://getalby.com/oauth?client_id=${process.env.NEXT_PUBLIC_ALBY_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000&scope=account:read%20invoices:create%20invoices:read%20transactions:read%20balance:read%20payments:send`,
            // authorization: `https://getalby.com/oauth`,
            token: `https://api.getalby.com/oauth/token`,
            // requestTokenUrl: `https://api.getalby.com/oauth/token`,
            // accessTokenUrl: `https://api.getalby.com/oauth/token`,
            userinfo: `https://api.getalby.com/user/me`,
            clientId: process.env.NEXT_PUBLIC_ALBY_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_ALBY_SECRET,
            version: "2.0",
            // checks: ["pkce"],
            profile(profile: AlbyProfile) {
                // Return the required user properties based on the raw profile object
                return {
                    id: profile.identifier,
                    image: profile.avatar,
                    ...profile,
                }
            },
        }
    ],
    debug: true,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
