import React from 'react';
import Router from 'next/router';
import styles from './navbar.desktop.module.css';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Button from '@mui/material/Button';
import {navbarProps, buttonProps} from './NavbarComponentInterface';
import {signOut} from 'next-auth/react';
import LoadingElement from '@/components/elements/LoadingElement/LoadingElement';
import {Tooltip} from '@mui/material';

export default function DesktopNavbar({loading, nextPath, setNextPath, router, children, topButtons}: navbarProps) {
    return (
        <div className={styles.full}>
            <div className={styles.row_flex_container}>
                <div className={styles.left_flex_container}>
                    <div className={styles.side_bar_top}></div>
                    <div className={styles.scrollable}>
                        <div className={styles.side_bar_mid}>
                            { topButtons.map((term) =>
                                <DesktopNavButton key={term.id} router={router} nextPath={nextPath}
                                    setNextPath={setNextPath} href={term.href} text={term.text}
                                    Icon={term.icon} />
                            )}
                        </div>
                        <div className={styles.side_bar_bot}>
                            <DesktopNavButton router={router} nextPath={nextPath} setNextPath={setNextPath}
                                href={'/profile'}
                                text={'Account'} Icon={PersonRoundedIcon}/>
                            <DesktopLogoutButton/>
                        </div>
                    </div>
                </div>
                <div className={styles.right_flex_container}>
                    <div className={styles.top_bar}></div>
                    <div className={styles.content_space}>
                        {loading ? children : <LoadingElement />}
                    </div>
                </div>
            </div>
        </div>
    );
}


const DesktopNavButton = (props: buttonProps) => {
    const isActive: boolean = props.router.asPath === props.href;
    const isLoading: boolean = props.href === props.nextPath;

    return (
        <Tooltip title={props.text} placement="right">
            <Button id={styles.button}
                onClick={() => {
                    Router.push(props.href, undefined, {shallow: true}).then(); props.setNextPath(props.href);
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
        </Tooltip>
    );
};


const DesktopLogoutButton = () => {
    return (
        <Tooltip title={'logout'} placement="right">
            <Button id={styles.button}
                onClick={() => signOut({callbackUrl: '/login'})}
                className={styles.button_default}
            >
                <>
                    <LogoutRoundedIcon className={styles.icon}/>
                    <p className={styles.text}>Logout</p>
                </>
            </Button>
        </Tooltip>
    );
};
