import nextAuth from 'next-auth';
import credentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

// @ts-ignore
// async function refreshAccessToken(tokenObject) {
//     const csrfToken = await getCsrfToken();
//     try {
//     // TODO
//         const url = process.env.NEXT_INTERNAL_API_URL;
//
//         return {
//             ...tokenObject,
//             accessToken: '',
//             accessTokenExpires: Date.now() + 100 * 1000,
//             refreshToken: tokenObject.refreshToken,
//         };
//     } catch (error) {
//         return {
//             ...tokenObject,
//             error: 'RefreshAccessTokenError',
//         };
//     }
// }


// A list of providers to sign in with
const providers = [

    credentialsProvider({
        name: 'Credentials',
        credentials: {
            username: {label: 'Username', type: 'text', placeholder: 'jsmith'},
            password: {label: 'Password', type: 'password'},
        },
        authorize: async (credentials) => {
            try {
                const user = await axios.post(
                    'http://localhost:8000/auth/token/', {
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
        signIn: '/auth/signin',
    },
};

// @ts-ignore
const Auth = (req, res) => nextAuth(req, res, options);
export default Auth;
