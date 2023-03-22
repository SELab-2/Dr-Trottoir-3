import {useRef, useState} from 'react';
import { useRouter } from 'next/router'
import { useSession, signIn } from 'next-auth/react';
import {Button, Form, FormInstance, Input} from "antd";
import styles from "./LoginPage.module.css"

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

    const formRef = useRef<FormInstance>(null);

    const onFinish = (values: any) => {
        console.log(values);
    };

    return (
        <div className={styles.loginpage}>
            <div className={styles.loginpageformwrapper}>
                <img src={"/media/logo_drtrottoir.svg"} className={styles.drtrottoirlogo}/>

                <Form
                    ref={formRef}
                    name="control-ref"
                    onFinish={onFinish}
                    layout="vertical"
                    className={styles.loginpageform}
                >
                    <Form.Item name="email" label={"Email"} rules={[{ required: true }]} className={styles.hideinputlabel}>
                        <Input size="large" placeholder="john.smith@gmail.com" />
                    </Form.Item>
                    <Form.Item name="password" label={"Password"} rules={[{ required: true }]}>
                        <Input size="large" type="password" />
                    </Form.Item>
                    <Form.Item className={styles.centerformbuttonwrapper}>
                        <Button size="large" type="primary" htmlType="submit" className={styles.centerformbutton}>
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}