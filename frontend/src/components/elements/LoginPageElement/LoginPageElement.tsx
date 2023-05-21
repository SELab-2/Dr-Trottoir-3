import {useState} from 'react';
import {signIn} from 'next-auth/react';
import styles from './loginPageElement.module.css';
import {Box, Button, TextField} from '@mui/material';
import {useRouter} from 'next/router';

export default function LoginPageElement() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    async function handleLogin() {
        signIn('credentials', {callbackUrl: '/', password: password, username: email});
    }

    async function handleResetPassword() {
        router.push('/reset-password');
    }

    return (
        <div className={styles.full_login_page}>
            <div className={styles.login_page_image_container}>
                <img src={'/media/logo_drtrottoir.svg'} className={styles.drtrottoirlogo}/>
            </div>
            <div className={styles.login_page_form_container}>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': {backgroundColor: 'var(--secondary-dark)'},
                        '& .MuiInputLabel-root': {color: 'var(--secondary-light)'},
                        '& .MuiButton-root': {
                            backgroundColor: 'var(--primary-yellow)',
                            color: 'black',
                            width: 'min(250px, 100%)'},
                        '& .MuiInputBase-input': {color: 'var(--secondary-light)'},
                        '.MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
                            backgroundColor: '#red',
                        },
                    }}
                    noValidate
                    autoComplete="on"
                    className={styles.form}
                >
                    <div className={styles.formfields}>
                        <TextField
                            sx={{
                                '& .MuiInputLabel-root': {
                                    padding: '2px',
                                },
                                '& label.Mui-focused': {
                                    color: 'var(--primary-yellow)',
                                    borderRadius: '8px',
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottomColor: 'var(--primary-dark)',
                                    borderRadius: '8px',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'var(--primary-dark)',
                                        borderRadius: '8px',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'var(--primary-dark)',
                                        borderRadius: '8px',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'var(--primary-dark)',
                                        borderRadius: '8px',
                                    },
                                },
                            }}
                            size="small"
                            InputProps={{
                                style: {height: '45px'},
                            }}
                            className={styles.input}
                            fullWidth
                            label={'Email'}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            sx={{
                                '& .MuiInputLabel-root': {
                                    padding: '2px',
                                },
                                '& label.Mui-focused': {
                                    color: 'var(--primary-yellow)',
                                    borderRadius: '8px',
                                },
                                '& .MuiInput-underline:after': {
                                    borderBottomColor: 'var(--primary-dark)',
                                    borderRadius: '8px',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'var(--primary-dark)',
                                        borderRadius: '8px',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'var(--primary-dark)',
                                        borderRadius: '8px',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'var(--primary-dark)',
                                        borderRadius: '8px',
                                    },
                                },
                            }}
                            size="small"
                            InputProps={{
                                style: {height: '45px'},
                            }}
                            className={styles.input}
                            fullWidth
                            label={'Password'}
                            type={'password'}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className={styles.buttonsWrapper}>
                            <Button className={styles.login_button} onClick={handleLogin}>
                                <p>Login</p>
                            </Button>
                            <Button className={styles.reset_button} onClick={handleResetPassword}>
                                <p>Forgot password?</p>
                            </Button>
                        </div>
                    </div>
                </Box>
            </div>
        </div>
    );
}
