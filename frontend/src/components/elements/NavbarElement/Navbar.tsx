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
import {getMe, useAuthenticatedApi} from '@/api/api';
import {User} from '@/api/models';

const topButtonsStudent = [
    {id: '0', text: 'Mijn Planning', href: '/my-schedule', icon: DateRangeIcon},
];

const topButtonsSyndicus = [
    {id: '0', text: 'Mijn Gebouwen', href: '/my-buildings', icon: DateRangeIcon},
];

const topButtonsAdmin = [
    {id: '0', text: 'Planner', href: '/scheduler', icon: DateRangeIcon},
    {id: '1', text: 'Live Routes', href: '/live_routes', icon: SensorsRoundedIcon},
    {id: '2', text: 'Gebruikers', href: '/users', icon: PeopleAltRoundedIcon},
    {id: '3', text: 'Routes', href: '/routes', icon: RouteIcon},
    {id: '4', text: 'Gebouwen', href: '/buildings', icon: ApartmentRoundedIcon},
];

const includeRoutes = [
    '/scheduler',
    '/live_routes',
    '/users',
    '/buildings',
    '/routes',
    '/my-schedule',
    '/my-buildings',
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

    const [userData, setUserData] = useAuthenticatedApi<User>();

    useEffect(() => {
        if (session) {
            // @ts-ignore
            getMe(session, setUserData);
        }
    }, [session]);

    const showNavBar = includeRoutes.includes(router.asPath);

    const [topButtonsForUser, setTopButtonsForUser] =
        useState<Array<{id: string, text: string, href: string, icon: any}>>([]);

    useEffect(() => {
        if (userData && userData.data) {
            if (userData.data.student && !userData.data.student.is_super_student) {
                setTopButtonsForUser(topButtonsStudent);
            } else if (userData.data.syndicus) {
                setTopButtonsForUser(topButtonsSyndicus);
            } else {
                setTopButtonsForUser(topButtonsAdmin);
            }
        }
    }, [userData]);

    if (showNavBar && session) {
        if (mobileView) {
            return (
                <MobileNavbarComponent loading={loading} nextPath={nextPath} setNextPath={setNextPath}
                    router={router} children={props.children} topButtons={topButtonsForUser}/>
            );
        } else {
            return (
                <DesktopNavbarComponent loading={loading} nextPath={nextPath} setNextPath={setNextPath}
                    router={router} children={props.children} topButtons={topButtonsForUser}/>
            );
        }
    } else {
        return props.children;
    }
}
