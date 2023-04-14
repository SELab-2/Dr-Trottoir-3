import React, {useState} from 'react';
import styles from './listView.module.css';
import {ApiData} from '@/api/api';
import {LocationGroup} from '@/api/models';


type ListViewComponentProps = {
    listData: ApiData<any[]> | undefined,
    setListData: (e: any) => void,
    locationGroups: ApiData<any[]> | undefined,
    selectedRegions: LocationGroup[],
    setSelectedRegions: (e: any) => void,
    current: number|null,
    setCurrent: (e: number|null) => void,
    ListItem: any,
    TopBar: any,
    children: any,
}


export default function ListViewComponent(props: ListViewComponentProps) {
    if (props.listData&&props.locationGroups) {
        if (props.listData.success&&props.locationGroups.success) {
            return (

                <div className={styles.full}>
                    <div className={styles.row_flex_container}>
                        <div className={styles.left_flex_container}>
                            <div className={styles.side_bar_top}>
                                <div className={styles.title}>
                                    <h1>Gebouwen</h1>
                                    <p>{props.listData.data.length} gevonden resultaten</p>
                                </div>
                            </div>
                            <div className={styles.scrollable}>
                                <div className={styles.side_bar_list}>
                                    {
                                        props.listData.data.map((x) => {
                                            const location = props.locationGroups?.data
                                                .filter((e) => x.location_group == e.id ).at(0);
                                                return ( <div className={styles.button_wrapper} key={x.id}>
                                                    <props.ListItem
                                                        current={props.current}
                                                        data={x}
                                                        location={location.name}
                                                        onClick={props.setCurrent}/>
                                                </div> );
                                            }
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={styles.right_flex_container}>
                            <div className={styles.top_bar}>
                                {props.TopBar}
                            </div>
                            <div className={styles.content_space}>
                                {props.children}
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <>
                    TODO: ERROR SCREEN
                </>
            );
        }
    } else {
        return (
            <>
                TODO: LOADING SCREEN
            </>
        );
    }
}
