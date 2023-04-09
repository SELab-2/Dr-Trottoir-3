import {AddRounded, CreateRounded, ErrorOutline} from '@mui/icons-material';
import {Box, Button, Card, Dialog, DialogActions, DialogTitle, IconButton, ListItem, TextField, Tooltip} from '@mui/material';
import * as React from 'react';
import {useSession} from 'next-auth/react';

async function sendRequest(url: string, {arg}: { arg: { note: string | null, token: string }}) {
    console.log(`token ${arg.token}`);
    return fetch(url, {
        method: 'PATCH',
        body: JSON.stringify({note: arg.note}),
        headers: {
            'Authorization': `Bearer ${arg.token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json());
}


// eslint-disable-next-line require-jsdoc
function createScheduleWarningSymbol(id: number, text: string | null, date: string, garbage: string, token: string): JSX.Element {
    const noteExists = text && text.length > 0;
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    //                         <IconButton onClick={() => createScheduleEntryNote(id, text)}>

    return (
        <>
            {
                noteExists ?
                    <>
                        <Tooltip title={text} arrow>
                            <ErrorOutline fontSize="small"/>
                        </Tooltip>
                        <IconButton onClick={handleClickOpen}>
                            <CreateRounded fontSize="small"/>
                        </IconButton>
                    </> :
                    <IconButton onClick={handleClickOpen}>
                        <AddRounded fontSize="small"/>
                    </IconButton>
            }
            <Dialog open={open} onClose={handleClose} fullWidth={true}>
                <DialogTitle>Update note for {garbage} on {date}</DialogTitle>
                <form action={'?'} method={'PATCH'} onSubmit={async (event) => {
                    // @ts-ignore
                    const textField = event.target[`schedule-${id}-note-form-text-field`];
                    if (textField) {
                        const formText = textField.value;
                        if (text !== formText) {
                            const url = `${process.env.NEXT_API_URL}garbage_collection_schedules/${id}/`;
                            // @ts-ignore
                            const result = await sendRequest(url, {arg: {note: formText ? formText : null, token: token}});
                            console.log(result);
                        }
                    }
                }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id={`schedule-${id}-note-form-text-field`}
                        fullWidth
                        variant="standard"
                        defaultValue={text}
                    />
                    <DialogActions>
                        <Button key={`schedule-${id}-note-form-cancel-button`} onClick={handleClose}>Cancel</Button>
                        <Button key={`schedule-${id}-note-form-submit-button`} type={'submit'}>Submit</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}

export default function ScheduleGarbageListItem(props: {id: number, type: string, date: string, note: string}): JSX.Element {
    const {id, type, date, note} =props;
    const {data: session} = useSession();

    const token = session ? session.accessToken : '';

    // @ts-ignore
    return (
        <ListItem
            key={id}
            sx={
                {
                    display: 'flex',
                    flexGrow: 1,
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    justifyContent: 'space-between',
                    verticalAlign: 'middle',
                }}>
            <Card sx={{
                width: '100%', height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <Box sx={{
                    display: 'flex', width: '100%', height: '100%',
                    background: 'var(--secondary-light)', alignItems: 'center',
                }}>
                    {/* Schedule type */}
                    <Box sx={{
                        display: 'flex', width: '33%', height: '100%',
                        flexGrow: 1, fontWeight: 'bold',
                        paddingLeft: '10px', alignItems: 'center',
                    }}>
                        {type}
                    </Box>
                    {/* Schedule date */}
                    <Box sx={{
                        display: 'flex', width: '33%', height: '100%',
                        flexGrow: 1, justifyContent: 'center',
                        alignItems: 'center', fontSize: '14px',
                    }}>
                        {date}
                    </Box>
                    {/* Schedule note icons */}
                    <Box sx={{
                        display: 'flex', width: '33%', height: '100%',
                        flexGrow: 1, justifyContent: 'flex-end',
                        alignItems: 'center',
                    }}>
                        {createScheduleWarningSymbol(id, note, date, type, token)}
                    </Box>
                </Box>
            </Card>
        </ListItem>
    );
}
