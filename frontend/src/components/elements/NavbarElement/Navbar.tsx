import React, {useEffect, useState} from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useRouter} from 'next/router';
import DateRangeIcon from '@mui/icons-material/DateRange';
import RouteIcon from '@mui/icons-material/Route';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import SensorsRoundedIcon from '@mui/icons-material/SensorsRounded';
import DesktopNavbarComponent from './DesktopNavbarComponent';
import MobileNavbarComponent from './MobileNavbarComponent';
import {useSession} from 'next-auth/react';

const topButtons = [
    {id: '0', text: 'Planner', href: '/scheduler', icon: DateRangeIcon},
    {id: '1', text: 'Live Routes', href: '/live_routes', icon: SensorsRoundedIcon},
    {id: '2', text: 'Gebruikers', href: '/users', icon: PeopleAltRoundedIcon},
    {id: '3', text: 'Routes', href: '/routes', icon: RouteIcon},
    {id: '4', text: 'Gebouwen', href: '/buildings', icon: ApartmentRoundedIcon},
    {id: '5', text: 'Actieve route', href: '/active_route', icon: SensorsRoundedIcon},
];

const includeRoutes = [
    '/scheduler',
    '/live_routes',
    '/users',
    '/buildings',
    '/routes',
];

export default function Navbar(props: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [nextPath, setNextPath] = useState<string | null>(null);
    const mobileView = useMediaQuery('(max-width:450px)');
    const {data: session} = useSession();

    useEffect(() => {
        router.events.on('routeChangeError', (e) => setLoading(false));
        router.events.on('routeChangeStart', (e) => setLoading(false));
        router.events.on('routeChangeComplete', (e) => setLoading(true));

        return () => {
            router.events.off('routeChangeError', (e) => setLoading(false));
            router.events.off('routeChangeStart', (e) => setLoading(false));
            router.events.off('routeChangeComplete', (e) => setLoading(true));
        };
    }, [router.events]);


    const showNavBar = includeRoutes.includes(router.asPath);

    if (showNavBar && session) {
        if (mobileView) {
            return (
                <MobileNavbarComponent loading={loading} nextPath={nextPath} setNextPath={setNextPath}
                    router={router} children={props.children} topButtons={topButtons}/>
            );
        } else {
            return (
                <DesktopNavbarComponent loading={loading} nextPath={nextPath} setNextPath={setNextPath}
                    router={router} children={props.children} topButtons={topButtons}/>
            );
        }
    } else {
        return props.children;
    }
}
