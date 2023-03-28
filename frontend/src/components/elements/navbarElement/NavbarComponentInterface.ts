import React from 'react';
import {NextRouter} from 'next/router';
import {SvgIcon} from '@mui/material';

export interface navbarProps {
    loading: boolean,
    nextPath: string|null,
    setNextPath: React.Dispatch<React.SetStateAction<string | null>>,
    router: NextRouter,
    children: any,
    topButtons: {id: string, text: string, href: string, icon: typeof SvgIcon}[]
}

export interface buttonProps {
    href: string,
    text: string,
    router: NextRouter,
    Icon: typeof SvgIcon,
    nextPath: string | null,
    setNextPath: React.Dispatch<React.SetStateAction<string | null>>
}
