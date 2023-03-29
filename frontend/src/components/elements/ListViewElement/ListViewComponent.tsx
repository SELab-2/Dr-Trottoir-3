import React, {useState} from 'react';
import styles from './listView.module.css';


type ListViewComponentProps = {
    buttons: any[],
    ListItem: any,
}

export default function ListViewComponent({buttons, ListItem}: ListViewComponentProps) {

    const [current, setCurrent] = useState<number | null>(null);

    return (
        <div className={styles.full}>
            <div className={styles.row_flex_container}>
                <div className={styles.left_flex_container}>
                    <div className={styles.side_bar_top}/>
                    <div className={styles.scrollable}>
                        <div className={styles.side_bar_list}>
                            { buttons.map((i) =>
                                <ListItem current={current} onClick={setCurrent} props={i}></ListItem>
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.right_flex_container}>
                    <div className={styles.top_bar}></div>
                    <div className={styles.content_space}>
                        <h1 style={{color: 'black'}}>CONTENT</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
