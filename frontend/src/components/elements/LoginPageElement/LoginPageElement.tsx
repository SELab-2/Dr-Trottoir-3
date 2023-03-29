import {useState} from 'react';
import {useRouter} from 'next/router';
import {signIn} from 'next-auth/react';
import styles from './LoginPageElement.module.css';
import {Box, Button, TextField} from '@mui/material';

export default function LoginPageElement() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    // const {data: session} = useSession();
    // if (session && session.user) {
    //     router.push("/");
    // }

    async function handleLogin() {
        signIn('credentials', {'redirect': false, 'password': password, 'username': email});
        await router.push('/');
    }

    return (
        <div className={styles.loginpage}>
            <div className={styles.loginpageformwrapper}>
                <img src={'/media/logo_drtrottoir.svg'} className={styles.drtrottoirlogo}/>

                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': {color: '#fff', backgroundColor: '#272A2F'},
                        '& .MuiInputLabel-root': {color: '#B3B3B3'},
                        '& .MuiButton-root': {
                            backgroundColor: 'var(--primary-yellow)',
                            color: 'black',
                            width: 'min(250px, 100%)'},
                        '& .MuiInputBase-input': {color: '#fff'},
                    }}
                    noValidate
                    autoComplete="off"
                    className={styles.form}
                >
                    <div className={styles.formfields}>
                        <TextField
                            fullWidth
                            label={'Email'}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label={'Password'}
                            type={'password'}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className={styles.formfields}>
                        <Button variant="contained" onClick={handleLogin}>Log in</Button>
                    </div>
                </Box>
            </div>
        </div>
    );
}
