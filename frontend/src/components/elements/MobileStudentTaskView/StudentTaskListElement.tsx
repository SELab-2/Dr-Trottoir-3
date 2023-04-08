import styles from "./StudentTaskListElement.module.css"

export default function StudentTaskList() {
    return (
        <div className={styles.outerDiv}>
            <h1 className={styles.title}>Toegekende Routes</h1>

        </div>
    );
}

type Route = {
    name: string,
    totalBuildings: number,
    buildingsDone: number,
};

type RoutesForDay = {
    date: Date,
    routes: [Route],
}

const Day = ({date, routes}: RoutesForDay) => {

}

const RouteEntry = ({name, totalBuildings, buildingsDone}: Route) => {

}
