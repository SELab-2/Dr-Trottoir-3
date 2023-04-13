import {AddRounded, CreateRounded, ErrorOutline} from '@mui/icons-material';
import {Box, Button, Card, Dialog, DialogActions, DialogTitle, IconButton, ListItem, TextField, Tooltip}
    from '@mui/material';
import * as React from 'react';
import {useSession} from 'next-auth/react';
import {getGarbageCollectionScheduleDetail, getGarbageTypeDetail,
    patchGarbageCollectionScheduleDetail, useAuthenticatedApi} from '@/api/api';
import {GarbageCollectionSchedule, GarbageType} from '@/api/models';
import {useEffect} from 'react';


export default function ScheduleGarbageListItem(props: {id: number}): JSX.Element {
    const {id} =props;

    const {data: session} = useSession();
    const [schedule, setSchedule] = useAuthenticatedApi<GarbageCollectionSchedule>();
    const [garbage, setGarbage] = useAuthenticatedApi<GarbageType>();

    const [open, setOpen] = React.useState(false);
    const [note, setNote] = React.useState<string | null>(null);
    const [textContent, setTextContent] = React.useState('');

    useEffect(()=> {
        getGarbageCollectionScheduleDetail(session, setSchedule, id);
    }, [id, session, setSchedule]);

    useEffect(() => {
        if (schedule) {
            getGarbageTypeDetail(session, setGarbage, schedule.data.garbage_type);
        }
    }, [schedule, session, setGarbage]);

    useEffect(() => {
        if (schedule) {
            setNote(schedule.data.note);
            setTextContent(schedule.data.note);
        }
    }, [schedule, session, setNote, setTextContent]);

    if (!schedule || !garbage) {
        return <></>;
    }

    const handleSubmit = () => {
        const text = textContent ? textContent : null;
        patchGarbageCollectionScheduleDetail(
            session, id,
            {note: text}
        );
        setNote(text);
        handleClose();
    };

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
                        {garbage.data.name}
                    </Box>
                    {/* Schedule date */}
                    <Box sx={{
                        display: 'flex', width: '33%', height: '100%',
                        flexGrow: 1, justifyContent: 'center',
                        alignItems: 'center', fontSize: '14px',
                    }}>
                        {schedule.data.for_day}
                    </Box>
                    {/* Schedule note icons */}
                    <Box sx={{
                        display: 'flex', width: '33%', height: '100%',
                        flexGrow: 1, justifyContent: 'flex-end',
                        alignItems: 'center',
                    }}>
                        {
                            note ?
                                <>
                                    <Tooltip title={note} arrow>
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
                            <DialogTitle>Update note for {garbage.data.name} on {schedule.data.for_day}</DialogTitle>
                            {/* Although the field is method={'POST'}, this will be seen as a PATCH request.
                    method={'PATCH'} is not a valid option, and POST maintains the current URL,
                    otherwise a question mark will be added at the end (which breaks the navbar)*/}
                            <TextField
                                autoFocus
                                id={`schedule-${id}-note-form-text-field`}
                                fullWidth
                                variant="standard"
                                defaultValue={textContent}
                                onChange={(e)=>setTextContent(e.target.value)}
                                onSubmit={handleSubmit}
                            />
                            <DialogActions>
                                <Button
                                    key={`schedule-${id}-note-form-cancel-button`}
                                    onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button
                                    key={`schedule-${id}-note-form-submit-button`}
                                    onClick={handleSubmit}>
                                    Submit
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Box>
            </Card>
        </ListItem>
    );
}
