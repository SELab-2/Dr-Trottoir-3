import styles from './navbar.module.css';
import Button from '@mui/material/Button';
import React, {useEffect, useState} from 'react';
import Router from 'next/router';
import {useRouter} from 'next/router';
import DateRangeIcon from '@mui/icons-material/DateRange';
import RouteIcon from '@mui/icons-material/Route';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import SensorsRoundedIcon from '@mui/icons-material/SensorsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';


// eslint-disable max-len
// eslint-disable-next-line require-jsdoc
export default function NavBar(props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [nextPath, setNextPath] = useState(null);

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

  return (
    <div className={styles.full}>
      <div className={styles.row_flex_container}>
        <div className={styles.left_flex_container} style={{backgroundColor: 'green'}}>
          <div className={styles.side_bar_top}></div>
          <div className={styles.side_bar_mid}>
            <NavButton router={router} nextPath={nextPath} setNextPath={setNextPath} href={'/scheduler'} text={'Scheduler'} icon={<DateRangeIcon className={styles.icon}/>}/>
            <NavButton router={router} nextPath={nextPath} setNextPath={setNextPath} href={'/live_routes'} text={'Live Routes'} icon={<SensorsRoundedIcon className={styles.icon}/>}/>
            <NavButton router={router} nextPath={nextPath} setNextPath={setNextPath} href={'/users'} text={'Users'} icon={<PeopleAltRoundedIcon className={styles.icon}/>}/>
            <NavButton router={router} nextPath={nextPath} setNextPath={setNextPath} href={'/routes'} text={'Routes'} icon={<RouteIcon className={styles.icon}/>}/>
            <NavButton router={router} nextPath={nextPath} setNextPath={setNextPath} href={'/buildings'} text={'Buildings'} icon={<ApartmentRoundedIcon className={styles.icon}/>}/>
          </div>
          <div className={styles.side_bar_bot}>
            <NavButton router={router} nextPath={nextPath} setNextPath={setNextPath} href={'/users/[id]'} text={'Account'} icon={<PersonRoundedIcon className={styles.icon}/>}/>
            <NavButton router={router} nextPath={nextPath} setNextPath={setNextPath} href={'/settings'} text={'Instellingen'} icon={<TuneRoundedIcon className={styles.icon}/>}/>
            <NavButton router={router} nextPath={nextPath} setNextPath={setNextPath} href={'/login'} text={'Logout'} icon={<LogoutRoundedIcon className={styles.icon}/>}/>
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
  );
}

// eslint-disable-next-line require-jsdoc
function NavButton({href, text, router, icon, nextPath, setNextPath}) {
  const isActive = router.asPath === href;
  const isLoading = href === nextPath;

  return (
    <Button id={styles.button}
      onClick={() => {Router.push(href, undefined, {shallow: true}); setNextPath(href)}}
      className={((isActive & nextPath === null) | isLoading) ? styles.button_selected : styles.button_default}
    >
      {icon}
      <p className={styles.text}>{text}</p>
    </Button>
  );
}
