import {Box, Card, IconButton, ListItem, Tooltip} from '@mui/material';
import * as React from 'react';
import {Issue} from '@/api/models';
import {useSession} from 'next-auth/react';
import CloseIcon from '@mui/icons-material/Close';
import {ErrorOutline} from '@mui/icons-material';
import {Api, deleteDetail, patchDetail} from '@/api/api';

function approveIssue(issue: number, user: number, token: string) {
    return patchDetail<Issue>(Api.IssueDetail, issue, {approval_user: user}, token);
}

function resolveIssue(issue: number, token: string) {
    return deleteDetail<Issue>(Api.IssueDetail, issue, token);
}

function BuildingIssueListItemSymbols(props: { issue: Issue }): JSX.Element {
    const {issue} = props;
    const approved = !!issue.approval_user;
    const {data: session} = useSession();
    // @ts-ignore
    const token = session ? session.accessToken : '';
    // @ts-ignore
    const user = session!.userid;
    if (!approved) {
        return (
            <form action={'?'} method={'PATCH'} onSubmit={async () => {
                await approveIssue(issue.id, user, token);
            }}>
                <IconButton type={'submit'}>
                    <Tooltip title={'Issue has not yet been approved. Press to approve issue.'}>
                        <CloseIcon sx={{color: 'red'}}/>
                    </Tooltip>
                </IconButton>
            </form>
        );
    } else {
        return (
            <form action={'?'} method={'DELETE'} onSubmit={async () => {
                await resolveIssue(issue.id, token);
            }}>
                <IconButton type={'submit'}>
                    <Tooltip title={'Issue has been approved but not resolved. Press to resolve issue.'}>
                        <ErrorOutline sx={{color: '#ffaa00'}}/>
                    </Tooltip>
                </IconButton>
            </form>
        );
    }
}

export default function BuildingIssueListItem(props: { issue: Issue }): JSX.Element {
    const {issue} = props;

    return (
        <ListItem key={issue.id}>
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
                    {issue.message}
                </Box>
                <Box sx={{
                    display: 'flex',
                    float: 'right',
                    flexGrow: 1,
                    justifyContent: 'flex-end',
                }}>
                    <BuildingIssueListItemSymbols issue={issue}/>
                </Box>
            </Card>
        </ListItem>
    );
}
