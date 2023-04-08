import React from 'react';
import Router from 'next/router';
import styles from './navbar.mobile.module.css';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Button from '@mui/material/Button';
import {navbarProps, buttonProps} from './NavbarComponentInterface';

export default function MobileNavbar({loading, nextPath, setNextPath, router, children, topButtons}: navbarProps) {
    return (
        <div className={styles.full}>
            <div className={styles.row_flex_container}>
                <div className={styles.left_flex_container}>
                    <div className={styles.side_bar_top}></div>
                    <div className={styles.scrollable}>
                        <div className={styles.side_bar_mid}>
                            { topButtons.map((term) =>
                                <MobileNavButton key={term.id} router={router} nextPath={nextPath}
                                    setNextPath={setNextPath} href={term.href} text={term.text}
                                    Icon={term.icon} />
                            )}
                        </div>
                        <div className={styles.side_bar_bot}>
                            <MobileNavButton router={router} nextPath={nextPath} setNextPath={setNextPath}
                                href={'/users'}
                                text={'Account'} Icon={PersonRoundedIcon}/>
                            <MobileNavButton router={router} nextPath={nextPath} setNextPath={setNextPath}
                                href={'/settings'} text={'Instellingen'}
                                Icon={TuneRoundedIcon}/>
                            <MobileNavButton router={router} nextPath={nextPath} setNextPath={setNextPath}
                                href={'/logout'} text={'Logout'}
                                Icon={LogoutRoundedIcon}/>
                        </div>
                    </div>
                </div>
                <div className={styles.right_flex_container} style={{backgroundColor: 'red'}}>
                    <div className={styles.top_bar}></div>
                    <div className={styles.content_space}>
                        {loading ? children : <h1 style={{color: 'black'}}>LOADING</h1>}
                    </div>
                </div>
            </div>
        </div>
    );
}


const MobileNavButton = ({href, text, router, Icon, nextPath, setNextPath}: buttonProps) => {
    const isActive: boolean = router.asPath === href;
    const isLoading: boolean = href === nextPath;

    return (
        <Button id={styles.button}
            onClick={() => {
                Router.push(href, undefined, {shallow: true}).then(); setNextPath(href);
            }}
            className={((isActive && nextPath === null) || isLoading) ?
                styles.button_selected : styles.button_default
            }
        >
            <>
                <Icon className={styles.icon}/>
                <p className={styles.text}>{text}</p>
            </>
        </Button>
    );
};
