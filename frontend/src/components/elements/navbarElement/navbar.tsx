import styles from './navbar.module.css';
import Button from '@mui/material/Button';
import React from 'react';
import Link from 'next/link';
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
  const [selectedBtn, setSelectedBtn] = React.useState(0);

  return (
    <div className={styles.full}>
      <div className={styles.row_flex_container}>
        {/* eslint-disable-next-line max-len */}
        <div className={styles.left_flex_container} style={{backgroundColor: 'green'}}>
          <div className={styles.side_bar_top}></div>
          <div className={styles.side_bar_mid}>
            <Link href="/scheduler">
              <Button id={styles.button}
                className={selectedBtn === 0 ? styles.button_selected : styles.button_default}
                onClick={()=>setSelectedBtn(0)}
              >
                <DateRangeIcon className={styles.icon}/>
                <p className={styles.text}>Planner</p>
              </Button>
            </Link>
            <Link href="/live_routes">
              <Button id={styles.button}
                className={selectedBtn === 1 ? styles.button_selected : styles.button_default}
                onClick={()=>setSelectedBtn(1)}
              >
                <SensorsRoundedIcon className={styles.icon}/>
                <p className={styles.text}>Actieve&nbsp;Routes</p>
              </Button>
            </Link>
            <Link href="/users">
              <Button id={styles.button}
                className={selectedBtn === 2 ? styles.button_selected : styles.button_default}
                onClick={()=>setSelectedBtn(2)}
              >
                <p className={styles.text}>Gebruikers</p>
                <PeopleAltRoundedIcon className={styles.icon}/>
              </Button>
            </Link>
            <Link href="/routes">
              <Button id={styles.button}
                className={selectedBtn === 3 ? styles.button_selected : styles.button_default}
                onClick={()=>setSelectedBtn(3)}
              >
                <RouteIcon className={styles.icon}/>
                <p className={styles.text}>Routes</p>
              </Button>
            </Link>
            <Link href="/buildings">
              <Button id={styles.button}
                className={selectedBtn === 4 ? styles.button_selected : styles.button_default}
                onClick={()=>setSelectedBtn(4)}
              >
                <ApartmentRoundedIcon className={styles.icon}/>
                <p className={styles.text}>Gebouwen</p>
              </Button>
            </Link>
          </div>
          <div className={styles.side_bar_bot}>
            <Link href="/users/{:id}">
              <Button id={styles.button}
                className={selectedBtn === 5 ? styles.button_selected : styles.button_default}
                onClick={()=>setSelectedBtn(5)}
              >
                <PersonRoundedIcon className={styles.icon}/>
                <p className={styles.text}>Account</p>
              </Button>
            </Link>
            <Link href="/settings">
              <Button id={styles.button}
                className={selectedBtn === 6 ? styles.button_selected : styles.button_default}
                onClick={()=>setSelectedBtn(6)}
              >
                <TuneRoundedIcon className={styles.icon}/>
                <p className={styles.text}>Instellingen</p>
              </Button>
            </Link>
            <Link href="/">
              <Button id={styles.button}
                className={selectedBtn === 7 ? styles.button_selected : styles.button_default}
                onClick={()=>setSelectedBtn(7)}
              >
                <LogoutRoundedIcon className={styles.icon}/>
                <p className={styles.text}>Logout</p>
              </Button>
            </Link>
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
