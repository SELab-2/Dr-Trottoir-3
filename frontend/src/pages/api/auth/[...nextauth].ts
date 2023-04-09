import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const refreshAccessToken = async (refreshToken: any) => {
    try {
        const response = await axios.post('/api/refresh_token', {refreshToken});
        const {access, refresh} = response.data;
        // eslint-disable-next-line no-undef
        const decodedJwt = JSON.parse(Buffer.from(access.split('.')[1], 'base64').toString());

        return {
            accessToken: access,
            refreshToken: refresh,
            userid: decodedJwt['user_id'],
            accessTokenExpires: parseInt(decodedJwt['exp']) * 1000,
        };
    } catch (error) {
        console.error(error);
        return null;
    }
};

const cookie = {
    // eslint-disable-next-line no-undef
    secure: process.env.NODE_ENV && process.env.NODE_ENV === 'production',
};
const session = {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60,
};

const providers = [
    // eslint-disable-next-line new-cap
    CredentialsProvider({
        name: 'Credentials',
        credentials: {
            username: {label: 'Username', type: 'text'},
            password: {label: 'Password', type: 'password'},
        },
        authorize: async (credentials) => {
            try {
                if (credentials) {
                    const user = await axios.post(
                        // eslint-disable-next-line no-undef
                        `${process.env.NEXT_API_URL}auth/token/`,
                        {
                            username: credentials.username,
                            password: credentials.password,
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    if (user.data.access) {
                        return user.data;
                    }
                    return null;
                }
            } catch (e) {
                throw new Error(e);
            }
        },
    }),
];

const callbacks = {
    jwt: async ({token, user}) => {
        if (user) {
            const decodedJwt = JSON.parse(
                // eslint-disable-next-line no-undef
                Buffer.from(user.access.split('.')[1], 'base64').toString()
            );

            token.accessToken = user.access;
            token.refreshToken = user.refresh;
            token.userid = decodedJwt.user_id;
            token.accessTokenExpires = parseInt(decodedJwt.exp) * 1000;
        }

        if (Date.now() < token.accessTokenExpires) {
            return Promise.resolve(token);
        }

        const newToken = await refreshAccessToken(token.refreshToken);
        if (newToken) {
            token.accessToken = newToken.accessToken;
            token.refreshToken = newToken.refreshToken;
            token.accessTokenExpires = newToken.accessTokenExpires;
            token.userid = newToken.userid;
        } else {
            token.error = 'RefreshTokenError';
        }

        return Promise.resolve(token);
    },

    session: async ({session, token}) => {
        session.accessToken = token.accessToken;
        session.accessTokenExpires = token.accessTokenExpires;
        session.error = token.error;
        session.userid = token.userid;
        session.refreshToken = token.refreshToken;

        return Promise.resolve(session);
    },

    redirect: async ({url, baseUrl}) => {
        return url;
    },
};

const configuration = {
    cookie,
    session,
    providers,
    callbacks,
    pages: {
        signIn: '/login',
    },
};

// eslint-disable-next-line new-cap
const Auth = (req, res) => NextAuth(req, res, configuration);
export default Auth;
