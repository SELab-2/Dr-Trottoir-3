import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
// import {getCsrfToken} from 'next-auth/react';
import axios from 'axios';

// TODO
// async function refreshAccessToken(tokenObject) {
//     const csrfToken = await getCsrfToken();
//     try {
//         // eslint-disable-next-line no-undef
//         const url = process.env.NEXT_INTERNAL_API_URL;
//
//         return {
//             ...tokenObject,
//             accessToken: "",
//             accessTokenExpires: Date.now() + 100 * 1000,
//             refreshToken: tokenObject.refreshToken
//         }
//     } catch (error) {
//         return {
//             ...tokenObject,
//             error: "RefreshAccessTokenError",
//         }
//     }
// }


// A list of providers to sign in with
const providers = [

    // eslint-disable-next-line new-cap
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
            username: {label: 'Username', type: 'text', placeholder: 'jsmith'},
            password: {label: 'Password', type: 'password'},
        },
        authorize: async (credentials) => {
            try {
                if (credentials) {
                    const user = await axios.post(
                        // eslint-disable-next-line no-undef
                        `${process.env.NEXT_API_URL}auth/token/`, {
                            username: credentials.username,
                            password: credentials.password,
                        }, {
                            'headers': {
                                'Content-Type': 'application/json',
                            },
                        });

                    // @ts-ignore
                    if (user.data.access) {
                        // @ts-ignore
                        return user.data;
                    }
                    return null;
                }
            } catch (e) {
                // @ts-ignore
                throw new Error(e);
            }
        },
    }),
];

// these callbacks are run when new access token is received
const callbacks = {
    // // @ts-ignore
    // async signIn({ user, account, profile, email, credentials }) {
    //     return true
    // },
    // @ts-ignore
    jwt: async ({token, user}) => {
        if (user) {
            // Only at login
            // eslint-disable-next-line no-undef
            const decodedJwt = JSON.parse(Buffer.from(user.access.split('.')[1], 'base64').toString());

            token.accessToken = user['access'];
            token.refreshToken = user['refresh'];
            token.userid = decodedJwt['user_id'];
            token.accessTokenExpires = parseInt(decodedJwt['exp']) * 1000;
        }


        // If the token is still valid, just return it.
        if (Date.now() < token.accessTokenExpires) {
            return Promise.resolve(token);
        }

        // TODO
        // token = refreshAccessToken(token);
        return Promise.resolve(token);
    },
    // @ts-ignore
    session: async ({session, token}) => {
        session.accessToken = token.accessToken;
        session.accessTokenExpires = token.accessTokenExpires;
        session.error = token.error;
        session.userid = token.userid;
        session.refreshToken = token.refreshToken;

        // TODO - Should retrieve the permission roles, username, email, ... here and add it to the session.

        return Promise.resolve(session);
    },
    // @ts-ignore
    redirect: async ({url, baseUrl}) => {
        return url;
    },
};

export const options = {
    providers,
    callbacks,
    pages: {
        signIn: '/login',
    },
};

// @ts-ignore
// eslint-disable-next-line new-cap
const Auth = (req, res) => NextAuth(req, res, options);
export default Auth;
