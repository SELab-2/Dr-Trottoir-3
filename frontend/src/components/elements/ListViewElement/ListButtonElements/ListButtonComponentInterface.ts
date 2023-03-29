import React from 'react';

export interface ListItemProps {
    current: number | null,
    onClick: React.Dispatch<React.SetStateAction<number|null>>,
    props: any,
}
