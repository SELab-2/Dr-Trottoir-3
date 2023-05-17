import {Issue} from '@/api/models';
import {Box, IconButton, Tooltip, Typography} from '@mui/material';
import {Done, ErrorOutline, FilterAlt, FilterAltOff} from '@mui/icons-material';
import {deleteIssue, getBuildingDetailIssues, patchIssueDetail, useAuthenticatedApi} from '@/api/api';
import React, {useEffect, useState} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {useSession} from 'next-auth/react';
import styles from "@/components/elements/BuildingDetailElement/buildingEditLists.module.css";

export default function IssueList({buildingId}: { buildingId: number }) {
    const {data: session} = useSession();
    const [filter, setFilter] = useState(true);
    const [issues, setIssues] = useAuthenticatedApi<Issue[]>();


    function updateIssues() {
        getBuildingDetailIssues(session, setIssues, buildingId);
    }

    useEffect(updateIssues, [buildingId]);

    // @ts-ignore
    const user = session.userid;

    function approve(id: number) {
        patchIssueDetail(session, id, {approval_user: user}, updateIssues);
    }

    function resolve(id: number) {
        deleteIssue(session, id, updateIssues);
    }

    const issuesFiltered = () => issues?.data ? filter ? issues.data.filter(({resolved}) => !resolved) : issues.data : [];

    return (<Box className={styles.full_container}>
        <Box display={'flex'} alignItems={'center'}>
            <Typography variant='h5'>Problemen</Typography>
            <Box marginY={-2}>
                <Tooltip title={filter ? 'Toon opgeloste problemen' : 'Verberg opgeloste problemen'}>
                    <IconButton onClick={() => setFilter(!filter)}>
                        {filter ? <FilterAlt/> : <FilterAltOff/>}
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
        {issuesFiltered().length ?
            (<Box className={styles.scrollable_container}>
                {issuesFiltered().map((issue, index) =>
                <Box paddingBottom={1} key={index}>
                    <Box
                        bgcolor={'var(--secondary-light)'}
                        borderRadius={'var(--small_corner)'}
                        paddingY={0.2} paddingX={'3%'} alignItems={'center'} display={'flex'}
                    >
                        <Typography flexGrow={5} noWrap>{issue.message}</Typography>
                        {issue.resolved ?
                            <IconButton size={'small'}>
                                <Tooltip title={'Probleem is opgelost.'}>
                                    <Done sx={{color: 'green'}}/>
                                </Tooltip>
                            </IconButton> :
                            issue.approval_user !== null ?
                                <IconButton onClick={() => approve(issue.id)} size={'small'}>
                                    <Tooltip title={'Probleem is nog niet goedgekeurd. Klik om goed te keuren.'}>
                                        <CloseIcon sx={{color: 'red'}}/>
                                    </Tooltip>
                                </IconButton> :
                                <IconButton onClick={() => resolve(issue.id)} size={'small'}>
                                    <Tooltip
                                        title={'Probleem is goedgekeurd maar niet opgelost. Klik om op te lossen.'}>
                                        <ErrorOutline sx={{color: 'orange'}}/>
                                    </Tooltip>
                                </IconButton>
                        }
                    </Box>
                </Box>)}
            </Box>) :
            (<Box paddingBottom={1}>
                <Box bgcolor={'var(--secondary-light)'} borderRadius={'var(--small_corner)'}
                    paddingY={0.2} paddingX={'3%'} textAlign={'center'}>
                    <Done/>
                    <Typography>Geen problemen</Typography>
                </Box>
            </Box>
            )}
    </Box>);
}
