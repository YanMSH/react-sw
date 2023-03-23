import React, {FC} from 'react';
import styles from './Home.module.css';
import peopleStore from "../store/PeopleStore";
import {observer} from "mobx-react-lite";
import Table, {colsData} from "../components/Table";
import HomeControls from "../components/HomeControls";
import Pagination from "../components/Pagination";

const Home: FC = observer(() => {
    const isPlaceholderShown = peopleStore.status === 'init';
    const isLoading = peopleStore.status === 'loading';

    const tableHeaders: colsData [] = [
        {label: 'Name', sortField: 'name'},
        {label: 'Birth year', sortField: 'birth_year'},
        {label: 'Weight', sortField:'mass'},
        {label: 'Height', sortField:'height'},
        {label: 'Skin color', sortField:'skin_color'}
    ]

    return (
        <div className={styles.wrapper}>
            <HomeControls />
            {isPlaceholderShown && <p className={styles.placeholder}>No data. Fetch from server or add characters manually.</p>}
            {isLoading && <p className={styles.placeholder}>Loading...</p>}
            {!isPlaceholderShown && !isLoading &&<Table rowsData={peopleStore.people} colsData={tableHeaders}/>}
            {!isPlaceholderShown && <Pagination/>}
        </div>
    );
});

export default Home;
