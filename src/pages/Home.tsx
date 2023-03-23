import React, {useEffect} from 'react';
import styles from './Home.module.css';
import peopleStore from "../store/PeopleStore";
import {useNavigate} from "react-router-dom";
import headStyles from "../components/TableHeaderCell.module.css";
import rowStyles from "../components/TableRow.module.css";
import sizeStore from "../store/Size";
import {action} from "mobx";

import {observer} from "mobx-react-lite";
import Table from "../components/Table";

const Home = observer(() => {
    const isPlaceholderShown = peopleStore.status === 'init';
    const isLoading = peopleStore.status === 'loading';

    const navigate = useNavigate();
    const navigateToAddPage = () => {
        navigate('/add')
    }

    useEffect(() => {
        const tableHeadCells = [...document.querySelectorAll(`.${headStyles.table__header}`)];
        const tableRows = [...document.querySelectorAll(`.${rowStyles.table__row}`)];
        if (sizeStore.resizeData) {
            sizeStore.resizeData.columns.forEach((columnWidth, index) => {
                if (columnWidth) {
                    (tableHeadCells[index] as HTMLElement).style.width = `${columnWidth}px`;
                }
            })
            sizeStore.resizeData.rows.forEach((rowHeight, index) => {
                if (rowHeight) {
                    (tableRows[index] as HTMLElement).style.height = `${rowHeight}px`
                }
            })
        }
    }, [])

    function nextButtonHandler(){
        peopleStore.nextPage();
    }
    function prevButtonHandler(){
        peopleStore.prevPage();
    }

    return (
        <div>
            <div className={styles.buttons_wrapper}>
                <button onClick={action(() => peopleStore.fetchPeople())}>Fetch</button>
                <button onClick={action(() => peopleStore.clearPeople())}>Clear</button>
                <button onClick={() => navigateToAddPage()}>Add character</button>
            </div>
            {isPlaceholderShown && <p>No data. Fetch from server or add characters manually.</p>}
            {isLoading && <p>Loading...</p>}
            {!isPlaceholderShown && !isLoading &&<Table people={peopleStore.people} />}
            {!isPlaceholderShown &&
                <div className={styles.pagination}>
                    <button onClick={prevButtonHandler} disabled={peopleStore.isFirstPage}>Previous page</button>
                    {peopleStore.page}
                    <button onClick={nextButtonHandler} disabled={peopleStore.isLastPage}>Next page</button>
                </div>
            }
        </div>
    );
});

export default Home;
