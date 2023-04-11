import Button from '@mui/material/Button';
import Router from 'next/router';


type errorPageProps = {
    status: number,
};

export default function ErrorPage(props: errorPageProps) {
    return (
        <div>
            {props.status}
            <Button
                onClick={() => Router.push('/login', undefined, {shallow: true}).then()}>
                terug naar login
            </Button>
        </div>
    );
}
