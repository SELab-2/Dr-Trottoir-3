import {useSession} from 'next-auth/react';

export default function BuildingsPage() {
    const {data: session} = useSession();
    console.log(session);


    return (
        <>
            <h1 style={{color: 'black'}}>BUILDINGS</h1>
        </>
    );
}
