import {CircularProgress} from '@mui/material';

export default function LoadingElement() {
    return (
        <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <CircularProgress color="inherit" />
        </div>
    );
}
