import Router, {useRouter} from 'next/router';
import styles from './LogoutPageElement.module.css';
import {Box, Button, TextField} from '@mui/material';
import React from "react";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';


export default function LogoutPageElement() {
    return (

            <div className={styles.full}>
                uitloggen
                <div className={styles.button_holder}>

                    <Button id={styles.button}
                        onClick={() => {
                            Router.push("/login", undefined, {shallow: true}).then();
                        }}
                        className={styles.button_default}
                    >
                        <CheckIcon className={styles.icon}/>
                    </Button>
                    <Button id={styles.button}
                        onClick={() => {
                            Router.push("/", undefined, {shallow: true}).then();
                        }}
                        className={styles.button_default}
                    >
                        <CloseIcon className={styles.icon}/>
                    </Button>
                </div>
            </div>

    );
}
