import styles from './navbar.module.css';
import Button from '@mui/material/Button';
import React, {useEffect} from 'react';
import Link from 'next/link';
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

  return (
    <div className={styles.full}>
      <div className={styles.row_flex_container}>
        {/* eslint-disable-next-line max-len */}
        <div className={styles.left_flex_container} style={{backgroundColor: 'green'}}>
          <div className={styles.side_bar_top}></div>
          <div className={styles.side_bar_mid}>
            <NavButton href={'/scheduler'} text={'Scheduler'} icon={<DateRangeIcon className={styles.icon}/>} router={router}/>
            <NavButton href={'/live_routes'} text={'Live Routes'} icon={<SensorsRoundedIcon className={styles.icon}/>} router={router}/>
            <NavButton href={'/users'} text={'Users'} icon={<PeopleAltRoundedIcon className={styles.icon}/>} router={router}/>
            <NavButton href={'/routes'} text={'Routes'} icon={<RouteIcon className={styles.icon}/>} router={router}/>
            <NavButton href={'/buildings'} text={'Buildings'} icon={<ApartmentRoundedIcon className={styles.icon}/>} router={router}/>
          </div>
          <div className={styles.side_bar_bot}>
            <NavButton href={'/users/[id]'} text={'Account'} icon={<PersonRoundedIcon className={styles.icon}/>} router={router}/>
            <NavButton href={'/settings'} text={'Instellingen'} icon={<TuneRoundedIcon className={styles.icon}/>} router={router}/>
            <NavButton href={'/login'} text={'Logout'} icon={<LogoutRoundedIcon className={styles.icon}/>} router={router}/>
          </div>
        </div>
        <div className={styles.right_flex_container} style={{backgroundColor: 'red'}}>
          <div className={styles.top_bar}></div>
          <div className={styles.content_space}>
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
}


// eslint-disable-next-line require-jsdoc
function NavButton({href, text, router, icon}) {
  const isActive = router.asPath === (href === '/live_routes' ? '/' : href);

  return (
    <Link href={href === '/' ? '/scheduler' : href} passHref>
      <Button id={styles.button}
              // onClick={router.push(href, undefined, { shallow: true })}
        className={isActive ? styles.button_selected : styles.button_default}
      >
        {icon}
        <p className={styles.text}>{text}</p>
      </Button>
     </Link>
  );
}
