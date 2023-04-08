import { AddRounded, CreateRounded, ErrorOutline } from '@mui/icons-material';
import {Box, Card, IconButton, ListItem, Tooltip} from '@mui/material';
import * as React from 'react';


export interface IScheduleGarbageListItem {
  id: number,
  type: string,
  date: string,
  issue: string,
}

// eslint-disable-next-line require-jsdoc
function createScheduleEntryNote(id: number) {
    // TODO make this a proper function once API is available,
    //  see https://mui.com/material-ui/react-dialog#form-dialogs
    // eslint-disable-next-line no-undef
    alert(`Changing note for entry ${id}`);
}


// eslint-disable-next-line require-jsdoc
function createScheduleWarningSymbol(id: number, text: string) {
    const issueExists = text.length > 0;

    return (
        <>
            {
                issueExists ?
                    <>
                        <Tooltip title={text} arrow>
                            <ErrorOutline fontSize="small"/>
                        </Tooltip>
                        <IconButton onClick={() => createScheduleEntryNote(id)}>
                            <CreateRounded fontSize="small"/>
                        </IconButton>
                    </> :
                    <IconButton onClick={() => createScheduleEntryNote(id)}>
                        <AddRounded fontSize="small"/>
                    </IconButton>
            }
        </>
    );
}

export function ScheduleGarbageListItem(schedule: IScheduleGarbageListItem) {
    // @ts-ignore
    return (
        <ListItem
            key={schedule.id}
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
                        {schedule.type}
                    </Box>
                    {/* Schedule date */}
                    <Box sx={{
                        display: 'flex', width: '33%', height: '100%',
                        flexGrow: 1, justifyContent: 'center',
                        alignItems: 'center', fontSize: '14px',
                    }}>
                        {schedule.date}
                    </Box>
                    {/* Schedule issue icons */}
                    <Box sx={{
                        display: 'flex', width: '33%', height: '100%',
                        flexGrow: 1, justifyContent: 'flex-end',
                        alignItems: 'center',
                    }}>
                        {createScheduleWarningSymbol(schedule.id, schedule.issue)}
                    </Box>
                </Box>
            </Card>
        </ListItem>
    );
}
