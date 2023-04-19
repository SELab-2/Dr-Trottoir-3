import {Box, Card, IconButton, ListItem, Tooltip} from '@mui/material';
import {Issue} from '@/api/models';
import {useSession} from 'next-auth/react';
import CloseIcon from '@mui/icons-material/Close';
import {ErrorOutline} from '@mui/icons-material';
import {deleteIssue, getIssueDetail, patchIssueDetail, useAuthenticatedApi} from '@/api/api';
import React, {useEffect, useState} from 'react';

export default function BuildingIssueListItem(props: { issue: number }): JSX.Element {
    const {issue: id} = props;
    const {data: session} = useSession();

    const [issue, setIssue] = useAuthenticatedApi<Issue>();
    const [approved, setApproved]= useState(false);
    const [resolved, setResolved]= useState(false);
    useEffect(() => {
        getIssueDetail(session, setIssue, id);
    });

    useEffect(() => {
        if (issue) {
            setApproved(issue.data.approval_user !=== null);
            setResolved(issue.data.resolved);
        }
    }, [issue]);

    if (!issue) {
        return <></>;
    }
    // If issue already resolved, don't render it
    if (resolved) {
        return <></>;
    }

    // @ts-ignore
    const user = session.userid;

    const handleApproval = () => {
        patchIssueDetail(session, id, {approval_user: user});
        setApproved(true);
    };

    const handleResolve = () => {
        deleteIssue(session, id);
        setResolved(true);
    };

    return (
        <ListItem key={issue.data.id}>
            <Card
                sx={{
                    width: '100%', height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--secondary-light)',
                    paddingRight: '10px',
                    paddingLeft: '10px',
                }}>
                <Box sx={{
                    display: 'flex',
                    float: 'left',
                    flexGrow: 1,
                    justifyContent: 'flex-start',
                }}>
                    {issue.data.message}
                </Box>
                <Box sx={{
                    display: 'flex',
                    float: 'right',
                    flexGrow: 1,
                    justifyContent: 'flex-end',
                }}>
                    { approved ?
                        <IconButton onClick={handleApproval}>
                            <Tooltip title={'Issue has not yet been approved. Press to approve issue.'}>
                                <CloseIcon sx={{color: 'red'}}/>
                            </Tooltip>
                        </IconButton> :
                        <IconButton onClick={handleResolve}>
                            <Tooltip title={'Issue has been approved but not resolved. Press to resolve issue.'}>
                                <ErrorOutline sx={{color: '#ffaa00'}}/>
                            </Tooltip>
                        </IconButton>
                    }
                </Box>
            </Card>
        </ListItem>
    );
}
