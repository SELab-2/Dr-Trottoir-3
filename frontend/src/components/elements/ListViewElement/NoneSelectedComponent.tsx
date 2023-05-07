import {Box, Typography} from '@mui/material';

type NoneSelectedProps = {
    ElementName: string,
}

function NoneSelected({ElementName}: NoneSelectedProps) {
    return (<Box padding={1} width={'100%'} display={'flex'} flexDirection={'column'}>
        <Box padding={1} marginBottom={2} bgcolor={'var(--secondary-light)'}
            borderRadius={'var(--small_corner)'}
            display={'flex'}>
            <Box>
                <Typography variant={'h4'}>Geen {ElementName} geselecteerd</Typography>
                <Typography variant={'subtitle1'}>Selecteer een {ElementName} om details weer te geven</Typography>
            </Box>
        </Box>
    </Box>);
}

export default NoneSelected;
