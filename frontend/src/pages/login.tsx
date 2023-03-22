import { useState } from 'react';
import { useRouter } from 'next/router'
import { signIn } from 'next-auth/react';


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

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

    return (
        <div>

        </div>
    )
}