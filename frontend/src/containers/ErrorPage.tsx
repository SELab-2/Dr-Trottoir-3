import Button from '@mui/material/Button';
import Router from 'next/router';
import Head from 'next/head';
import React from 'react';


type errorPageProps = {
    status: number,
};

export default function ErrorPage(props: errorPageProps) {
    return (
        <>
            <Head>
                <title>Error</title>
            </Head>
            <div style={{backgroundColor: 'white', height: 'min(100%, 100vh)', width: 'min(100%, 100vw)'}}>
                <h1>{props.status}</h1>
                <Button
                    onClick={() => Router.push('/login', undefined, {shallow: true}).then()}>
                    <h2>terug naar login</h2>
                </Button>
            </div>
        </>
    );
}
