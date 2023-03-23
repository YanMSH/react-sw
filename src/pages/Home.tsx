import React from 'react';
import styles from './Home.module.css';
import peopleStore from "../store/PeopleStore";
import {observer} from "mobx-react-lite";
import Table from "../components/Table";
import HomeControls from "../components/HomeControls";
import Pagination from "../components/Pagination";

const Home = observer(() => {
    const isPlaceholderShown = peopleStore.status === 'init';
    const isLoading = peopleStore.status === 'loading';

    return (
        <div className={styles.wrapper}>
            <HomeControls />
            {isPlaceholderShown && <p className={styles.placeholder}>No data. Fetch from server or add characters manually.</p>}
            {isLoading && <p className={styles.placeholder}>Loading...</p>}
            {!isPlaceholderShown && !isLoading &&<Table people={peopleStore.people} />}
            {!isPlaceholderShown && <Pagination/>}
        </div>
    );
});

export default Home;
