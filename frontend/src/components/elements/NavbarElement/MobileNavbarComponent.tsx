import React, {useState} from 'react';
import Router, {NextRouter} from 'next/router';
import styles from './navbar.mobile.module.css';
import Button from '@mui/material/Button';
import {navbarProps} from './NavbarComponentInterface';
import {Backdrop, SvgIcon, Tooltip} from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import SensorsRoundedIcon from '@mui/icons-material/SensorsRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import RouteIcon from '@mui/icons-material/Route';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const topButtons = [
    {id: '0', text: 'Planner', href: '/scheduler', icon: DateRangeIcon},
    {id: '1', text: 'Live Routes', href: '/live_routes', icon: SensorsRoundedIcon},
    {id: '2', text: 'Gebruikers', href: '/users', icon: PeopleAltRoundedIcon},
    {id: '3', text: 'Routes', href: '/routes', icon: RouteIcon},
    {id: '4', text: 'Gebouwen', href: '/buildings', icon: ApartmentRoundedIcon},
    {id: '4', text: 'Logout', href: '/logout', icon: LogoutRoundedIcon},
];

const botButtons = [
    {id: '0', text: 'Planner', href: '/scheduler', icon: DateRangeIcon},
    {id: '1', text: 'Live Routes', href: '/live_routes', icon: SensorsRoundedIcon},
    {id: '2', text: 'Gebruikers', href: '/users', icon: PeopleAltRoundedIcon},
    {id: '3', text: 'Routes', href: '/routes', icon: RouteIcon},
    {id: '4', text: 'Gebouwen', href: '/buildings', icon: ApartmentRoundedIcon},
];

export default function MobileNavbar(props: navbarProps) {
    const [showDrawer, setShowDrawer] = useState<boolean>(false);

    return (
        <div className={styles.full}>
            <div className={styles.top_bar_container}>
                <div className={styles.logo_container}>
                    <div className={styles.logo}/>
                </div>
                <div className={styles.drawer_icon}>
                    <Button id={styles.icon_button}
                        onClick={() => setShowDrawer(true)}
                        className={styles.button_default}
                    >
                        <>
                            <MenuRoundedIcon className={styles.icon}/>
                        </>
                    </Button>
                </div>
            </div>

            <div className={styles.content_container}>
                {props.loading ? props.children : <h1 style={{color: 'black'}}>LOADING</h1>}
            </div>

            <div className={styles.bot_bar_container}>
                { botButtons.map((term) =>
                    <MobileNavIconButton key={term.id} router={props.router} nextPath={props.nextPath}
                        setNextPath={props.setNextPath} href={term.href} text={term.text}
                        Icon={term.icon} />
                )}
            </div>

            <Backdrop
                sx={{color: 'var(--primary-dark)', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={showDrawer}
            >
                <div className={styles.drawer_container}>
                    <div className={styles.top_bar_container}>
                        <div className={styles.logo_container}>
                            <div className={styles.logo}/>
                        </div>
                        <div className={styles.drawer_icon}>
                            <Button id={styles.icon_button}
                                onClick={() => setShowDrawer(false)}
                                className={styles.button_default}
                            >
                                <>
                                    <CloseRoundedIcon className={styles.icon}/>
                                </>
                            </Button>
                        </div>
                    </div>

                    <div className={styles.drawer_list_container}>
                        { topButtons.map((term) =>
                            <MobileNavButton key={term.id} router={props.router} nextPath={props.nextPath}
                                setNextPath={props.setNextPath} href={term.href} text={term.text}
                                Icon={term.icon} openDrawer={setShowDrawer}/>
                        )}
                    </div>
                </div>
            </Backdrop>

        </div>
    );
}


type iconButtonProps = {
    href: string,
    text: string,
    router: NextRouter,
    Icon: typeof SvgIcon,
    nextPath: string | null,
    setNextPath: React.Dispatch<React.SetStateAction<string | null>>,
    buttonAction?: () => (void)
}


const MobileNavIconButton = (props: iconButtonProps) => {
    const isActive: boolean = props.router.asPath === props.href;
    const isLoading: boolean = props.href === props.nextPath;

    return (
        <Tooltip title={props.text}>
            <Button id={styles.icon_button}
                onClick={() => {
                    Router.push(props.href, undefined, {shallow: true}).then(); props.setNextPath(props.href);
                }}
                className={((isActive && props.nextPath === null) || isLoading) ?
                    styles.button_selected : styles.button_default
                }
            >
                <>
                    <props.Icon className={styles.icon}/>
                </>
            </Button>
        </Tooltip>
    );
};


type fullButtonProps = {
    href: string,
    text: string,
    router: NextRouter,
    Icon: typeof SvgIcon,
    nextPath: string | null,
    setNextPath: React.Dispatch<React.SetStateAction<string | null>>,
    buttonAction?: () => (void),
    openDrawer: (e: boolean) => (void)
}


const MobileNavButton = (props: fullButtonProps) => {
    const isActive: boolean = props.router.asPath === props.href;
    const isLoading: boolean = props.href === props.nextPath;

    return (
        <Button
            id={styles.full_button}
            onClick={() => {
                Router.push(props.href, undefined, {shallow: true}).then();
                props.setNextPath(props.href);
                props.openDrawer(false);
            }}
            className={((isActive && props.nextPath === null) || isLoading) ?
                styles.button_selected : styles.button_default
            }
        >
            <>
                <props.Icon className={styles.icon}/>
                <p className={styles.text}>{props.text}</p>
            </>
        </Button>
    );
};
