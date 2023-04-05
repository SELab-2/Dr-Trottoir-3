import React, {useEffect} from 'react';
import styles from './listView.module.css';


type ListViewComponentProps = {
    listData: any[],
    regionData: any[],
    current: number|null,
    setCurrent: React.Dispatch<React.SetStateAction<number|null>>,
    ListItem: any,
    TopBar: any,
    props: any,
}

export default function ListViewComponent({listData, regionData, current, setCurrent, ListItem, TopBar, ...props}:
    ListViewComponentProps) {
    const [sorttype, setSorttype] = React.useState('naam');
    const [region, setRegion] = React.useState<string[]>(regionData);

    useEffect(() => {
        const element = document.getElementById(styles.scroll_style);
        if (element != null) {
            element.scrollTo({top: 0, behavior: 'smooth'});
        }
    }, [sorttype, region]);

    return (
        <div className={styles.full}>
            <div className={styles.row_flex_container}>
                <div className={styles.left_flex_container}>
                    <div className={styles.side_bar_top}>
                        <div className={styles.title}>
                            <h1>Gebouwen</h1>
                            <p>{listData.length} gevonden resultaten</p>
                        </div>
                    </div>
                    <div className={styles.scrollable}>
                        <div className={styles.side_bar_list}>
                            { listData.map((i) =>
                                <ListItem current={current} onClick={setCurrent} props={i}></ListItem>
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.right_flex_container}>
                    <div className={styles.top_bar}>
                        <TopBar sorttype={sorttype} setSorttype={setSorttype} region={region} setRegion={setRegion}
                            regions={regionData}/>;
                    </div>
                    <div className={styles.content_space}>
                        {props.children}
                    </div>
                </div>
            </div>
        </div>
    );
}
