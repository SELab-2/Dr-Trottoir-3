import {useState} from 'react';
import styles from './loginPageElement.module.css';
import {Box, Button, TextField} from '@mui/material';
import {postUserCreateResetPassword} from '@/api/api';

export default function ResetPasswordFormPageElement() {
    const [email, setEmail] = useState('');

    async function handleResetPassword() {
        postUserCreateResetPassword(null, {'email': email}, undefined);
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
                            label={'email'}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button className={styles.login_button} onClick={handleResetPassword}>
                            <p>Send reset password link</p>
                        </Button>
                    </div>
                </Box>
            </div>
        </div>
    );
}
