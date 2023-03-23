import React from 'react';
import styles from "./Pagination.module.css";
import peopleStore from "../store/PeopleStore";
import {observer} from "mobx-react-lite";

const Pagination = observer(() => {

    function nextButtonHandler(){
        peopleStore.nextPage();
    }
    function prevButtonHandler(){
        peopleStore.prevPage();
    }

    return (
        <div className={styles.pagination}>
            <button onClick={prevButtonHandler} disabled={peopleStore.isFirstPage}>Previous page</button>
            {peopleStore.page}
            <button onClick={nextButtonHandler} disabled={peopleStore.isLastPage}>Next page</button>
        </div>
    );
});

export default Pagination;
