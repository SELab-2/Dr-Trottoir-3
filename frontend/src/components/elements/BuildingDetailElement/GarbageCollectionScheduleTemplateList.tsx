import {Box, IconButton, Typography} from '@mui/material';
import {Add, Clear, Edit} from '@mui/icons-material';
import React, {useEffect, useState} from 'react';
import {
    deleteGarbageCollectionScheduleTemplate,
    getBuildingDetailGarbageCollectionScheduleTemplates,
    useAuthenticatedApi,
} from '@/api/api';
import {useSession} from 'next-auth/react';
import {GarbageCollectionScheduleTemplate} from '@/api/models';
import EditTemplatePopup from '@/components/elements/BuildingDetailElement/EditTemplatePopup';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';
import styles from '@/components/elements/BuildingDetailElement/buildingEditLists.module.css';

export default function GarbageCollectionScheduleTemplateList({buildingId}: { buildingId: number }) {
    const {data: session} = useSession();
    const [templateList, setTemplateList] = useAuthenticatedApi<GarbageCollectionScheduleTemplate[]>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<GarbageCollectionScheduleTemplate | null>(null);

    function onDialogClose(update = false) {
        setSelectedTemplate(null);
        setDialogOpen(false);
        if (update) updateTemplates();
    }

    function updateTemplates() {
        setTemplateList(undefined);
        getBuildingDetailGarbageCollectionScheduleTemplates(session, setTemplateList, buildingId);
    }

    useEffect(updateTemplates, [buildingId]);

    return (
        <Box className={styles.full_container}>
            <Typography variant='h5'>Templates</Typography>
            {templateList?.data ?
                <div className={styles.scrollable_container}>
                    {templateList.data.map((template, index) =>
                        <Box paddingBottom={1} key={index}>
                            <Box
                                bgcolor={'var(--secondary-light)'}
                                borderRadius={'var(--small_corner)'}
                                paddingY={0.2} paddingX={'3%'} alignItems={'center'} display={'flex'}
                            >
                                <Typography flexGrow={5} noWrap>{template.name}</Typography>
                                <IconButton size={'small'} onClick={() => {
                                    setSelectedTemplate(template);
                                    setDialogOpen(true);
                                }}>
                                    <Edit style={{flexGrow: 1}}/>
                                </IconButton>
                                <IconButton size={'small'} onClick={() => {
                                    deleteGarbageCollectionScheduleTemplate(
                                        session,
                                        template.id,
                                        (_) => updateTemplates());
                                }}>
                                    <Clear style={{flexGrow: 1}}/>
                                </IconButton>
                            </Box>
                        </Box>
                    )}
                    <Box paddingBottom={1}>
                        <Box bgcolor={'var(--secondary-light)'} borderRadius={'var(--small_corner)'}
                            paddingY={0.2} paddingX={'3%'} display={'flex'} alignItems={'center'}>
                            <Box flexGrow={1}/>
                            <IconButton onClick={() => {
                                setSelectedTemplate(null);
                                setDialogOpen(true);
                            }} size={'small'}>
                                <Add/>
                            </IconButton>
                            <Box flexGrow={1}/>
                        </Box>
                    </Box>
                    <EditTemplatePopup
                        open={dialogOpen} templates={templateList.data || []}
                        selectedTemplate={selectedTemplate} buildingId={buildingId}
                        setSelectedTemplate={setSelectedTemplate} onClose={onDialogClose} updateList={updateTemplates}
                    />
                </div> :
                <LoadingElement/>
            }
        </Box>);
}
