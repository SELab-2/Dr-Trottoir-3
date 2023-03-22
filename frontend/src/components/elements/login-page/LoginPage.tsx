import {useRef, useState} from 'react';
import { useRouter } from 'next/router'
import { useSession, signIn } from 'next-auth/react';
import styles from "./LoginPage.module.css"
import {Box, Button, TextField} from "@mui/material";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const { data: session } = useSession()
    if (session && session.user) {
        router.push("/");
    }

    //@ts-ignore
    const handleChangeEmail = (event) => {
        setEmail(event.target.value);
    }

    //@ts-ignore
    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    }

    async function handleLogin() {
        // await setLoading(true);
        await signIn('credentials', {redirect: false, email: email, password: password });
    }

    const onFinish = (values: any) => {
        console.log(values);
    };

    return (
        <div className={styles.loginpage}>
            <div className={styles.loginpageformwrapper}>
                <img src={"/media/logo_drtrottoir.svg"} className={styles.drtrottoirlogo}/>

                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { color: "#fff", backgroundColor: "#272A2F" },
                        '& .MuiInputLabel-root': {color: "#B3B3B3"},
                        '& .MuiButton-root': {backgroundColor: "var(--primary-yellow)", color: "black", width: "min(250px, 100%)"},
                        '& .MuiInputBase-input': {color: "#fff"}
                    }}
                    noValidate
                    autoComplete="off"
                    className={styles.form}
                >
                    <div className={styles.formfields}>
                        <TextField
                            fullWidth
                            label={"Email"}
                        />
                        <TextField fullWidth label={"Password"} type={"password"}/>
                    </div>
                    <div className={styles.formfields}>
                        <Button variant="contained">Log in</Button>
                    </div>
                </Box>
            </div>
        </div>
    );
}