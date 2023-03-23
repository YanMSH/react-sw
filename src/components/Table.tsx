import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import peopleStore from '../store/PeopleStore'
import TableRow from "./TableRow";
import styles from './Table.module.css';
import headStyles from './TableHeaderCell.module.css';
import rowStyles from './TableRow.module.css';
import {action} from "mobx";
import sizeStore from '../store/Size';
import {useNavigate} from "react-router-dom";
import TableHeaderCell from "./TableHeaderCell";


const Table = observer(() => {
    const isPlaceholderShown = peopleStore.status === 'init';
    const isLoading = peopleStore.status === 'loading';

    const [draggingRowId, setDraggingRowId] = useState<null | string>(null);

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
            {!isPlaceholderShown && !isLoading &&<table className={styles.table}>
                <thead>
                <tr>
                    <TableHeaderCell label={'Name'} sortField={'name'}/>
                    <TableHeaderCell label={'Birth year'} sortField={'birth_year'}/>
                    <TableHeaderCell label={'Weight'} sortField={'mass'}/>
                    <TableHeaderCell label={'Height'} sortField={'height'}/>
                    <TableHeaderCell label={'Skin color'} sortField={'skin_color'}/>
                </tr>
                </thead>
                <tbody>
                {peopleStore.people.map(people => <TableRow
                    people={people}
                    dragId={draggingRowId}
                    setDragId={setDraggingRowId}
                    key={people.url}
                />)}
                </tbody>
            </table>}
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

export default Table;
