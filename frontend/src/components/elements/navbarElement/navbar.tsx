import styles from './navbar.module.css';
import Button from '@mui/material/Button';
import React from 'react';

// eslint-disable-next-line require-jsdoc
// @ts-ignore
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
            <Button className={styles.button}
              color={selectedBtn === 0 ? 'secondary' : 'primary'}
              onClick={()=>setSelectedBtn(0)}
            >
              A
            </Button>
            <Button className={styles.button}
              color={selectedBtn === 1 ? 'secondary' : 'primary'}
              onClick={()=>setSelectedBtn(1)}
            >
              A
            </Button>
            <Button className={styles.button}
              color={selectedBtn === 2 ? 'secondary' : 'primary'}
              onClick={()=>setSelectedBtn(2)}
            >
              A
            </Button>
            <Button className={styles.button}
              color={selectedBtn === 3 ? 'secondary' : 'primary'}
              onClick={()=>setSelectedBtn(3)}
            >
              A
            </Button>
            <Button className={styles.button}
              color={selectedBtn === 4 ? 'secondary' : 'primary'}
              onClick={()=>setSelectedBtn(4)}
            >
              A
            </Button>
          </div>
          <div className={styles.side_bar_bot}>
            <Button className={styles.button}
                    color={selectedBtn === 5 ? 'secondary' : 'primary'}
                    onClick={()=>setSelectedBtn(5)}
            >
              A
            </Button>
            <Button className={styles.button}
                    color={selectedBtn === 6 ? 'secondary' : 'primary'}
                    onClick={()=>setSelectedBtn(6)}
            >
              A
            </Button>
            <Button className={styles.button}
                    color={selectedBtn === 7 ? 'secondary' : 'primary'}
                    onClick={()=>setSelectedBtn(7)}
            >
              A
            </Button>
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