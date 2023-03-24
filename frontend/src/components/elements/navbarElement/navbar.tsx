import styles from './navbar.module.css';
import Button from '@mui/material/Button';
import React, {useEffect, useState} from 'react';
import Router, {NextRouter} from 'next/router';
import {useRouter} from 'next/router';
import DateRangeIcon from '@mui/icons-material/DateRange';
import RouteIcon from '@mui/icons-material/Route';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import SensorsRoundedIcon from '@mui/icons-material/SensorsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const topButtons = [
    {id: '0', text: 'Planner', href: '/scheduler', icon: <DateRangeIcon className={styles.icon}/>},
    {id: '1', text: 'Live Routes', href: '/live_routes', icon: <SensorsRoundedIcon className={styles.icon}/>},
    {id: '2', text: 'Gebruikers', href: '/users', icon: <PeopleAltRoundedIcon className={styles.icon}/>},
    {id: '3', text: 'Routes', href: '/routes', icon: <RouteIcon className={styles.icon}/>},
    {id: '4', text: 'Gebouwen', href: '/buildings', icon: <ApartmentRoundedIcon className={styles.icon}/>},
];

const ignoreRoute = [
    '/auth/signin',
];

export default function NavBar(props: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [nextPath, setNextPath] = useState<string | null>(null);

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

    const hideNavBar = ignoreRoute.includes(router.asPath);

    return (
        <>
            <div className={styles.full} style={hideNavBar ? {display: 'none'}: {display: 'initial'}}>
                <div className={styles.row_flex_container}>
                    <div className={styles.left_flex_container} style={{backgroundColor: 'green'}}>
                        <div className={styles.side_bar_top}></div>
                        <div className={styles.side_bar_mid}>
                            { topButtons.map((term, index) =>
                                <NavButton router={router} nextPath={nextPath} setNextPath={setNextPath}
                                    href={term.href} text={term.text} icon={term.icon} />
                            )}
                        </div>
                        <div className={styles.side_bar_bot}>
                            <NavButton router={router} nextPath={nextPath} setNextPath={setNextPath} href={'/users'}
                                text={'Account'} icon={<PersonRoundedIcon className={styles.icon}/>}/>
                            <NavButton router={router} nextPath={nextPath} setNextPath={setNextPath} href={'/settings'}
                                text={'Instellingen'} icon={<TuneRoundedIcon className={styles.icon}/>}/>
                            <NavButton router={router} nextPath={nextPath} setNextPath={setNextPath} href={'/login'}
                                text={'Logout'} icon={<LogoutRoundedIcon className={styles.icon}/>}/>
                        </div>
                    </div>
                    <div className={styles.right_flex_container} style={{backgroundColor: 'red'}}>
                        <div className={styles.top_bar}></div>
                        <div className={styles.content_space}>
                            {loading ? props.children : <h1 style={{color: 'black'}}>LOADING</h1>}
                        </div>
                    </div>
                </div>
            </div>
            {hideNavBar ? props.children : null}
        </>
    );
}


type navButtonProps = {
    href: string,
    text: string,
    router: NextRouter,
    icon: JSX.Element,
    nextPath: string | null,
    setNextPath: React.Dispatch<React.SetStateAction<string | null>>
}

const NavButton = ({href, text, router, icon, nextPath, setNextPath}: navButtonProps) => {
    const isActive: boolean = router.asPath === href;
    const isLoading: boolean = href === nextPath;

    return (
        <Button id={styles.button}
            onClick={() => {
                Router.push(href, undefined, {shallow: true}); setNextPath(href);
            }}
            className={((isActive && nextPath === null) || isLoading) ? styles.button_selected : styles.button_default}
        >
            <>
                {icon}
                <p className={styles.text}>{text}</p>
            </>
        </Button>
    );
};
