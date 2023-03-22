import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import peopleStore from '../store/PeopleStore'
import sortStore from '../store/Sort';
import TableRow from "./TableRow";
import styles from './Table.module.css';
import rowClasses from './TableRow.module.css';
import {action} from "mobx";
import {People, PeopleStringField} from "../models/People";
import sizeStore from '../store/Size';
import {useNavigate} from "react-router-dom";

interface resizeData {
    cellWidth: number;
    initialPosition: number;
}

const Table = observer(() => {
    const isPlaceholderShown = peopleStore.status === 'init';
    const isLoading = peopleStore.status === 'loading';

    const [draggingRow, setDraggingRow] = useState<null | People>(null);

    const [resizeWidth, setResizeWidth] = useState<null | resizeData>(null);

    const navigate = useNavigate();
    const navigateToAddPage = () => {
        navigate('/add')
    }

    useEffect(() => {
        const tableHeadCells = [...document.querySelectorAll(`.${styles.table__header}`)];
        const tableRows = [...document.querySelectorAll(`.${rowClasses.table__row}`)];
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

    const sortHandler = (fieldName: keyof PeopleStringField) => {
        let sortType;
        if (!sortStore.sortType) {
            sortType = 'asc'
        } else {
            if (fieldName === sortStore.sortField) {
                if (sortStore.sortType === 'asc') {
                    sortType = 'desc'
                } else {
                    sortType = 'asc'
                }
            } else {
                sortType = 'asc'
            }
        }
        peopleStore.sortPeople(fieldName, sortType as 'asc' | 'desc');
        sortStore.setSortType(sortType);
        sortStore.setSortField(fieldName);
    }

    function dragStartHandler(e: React.DragEvent<HTMLTableRowElement>, people: People) {
        setDraggingRow(people);

    }

    function dragEndHandler(e: React.DragEvent<HTMLTableRowElement>) {
        (e.target as HTMLElement).parentElement!.style.backgroundColor = '';

    }

    function dropHandler(e: React.DragEvent<HTMLTableRowElement>, people: People) {
        e.preventDefault();
        (e.target as HTMLElement).parentElement!.style.backgroundColor = '';
        if (draggingRow) {
            peopleStore.swapPeople(people, draggingRow);
        }
    }


    function resizeStartHandler(e: React.DragEvent<HTMLDivElement>) {
        const cellWidth = (e.target as HTMLDivElement).parentElement!.offsetWidth;
        const initialPosition = e.clientX;
        setResizeWidth({cellWidth, initialPosition});
    }

    function resizeMoveHandler(e: React.DragEvent<HTMLDivElement>) {
        if (e.clientX > 0) {
            const change = e.clientX - resizeWidth!.initialPosition;
            if (resizeWidth) {
                (e.target as HTMLDivElement).parentElement!.style.width = `${(resizeWidth.cellWidth + change).toString()}px`;
            }
        }
    }

    function resizeEndHandler(e: React.DragEvent<HTMLDivElement>) {
        setResizeWidth(null);
        const columns = [...document.querySelectorAll(`.${styles.table__header}`)];
        const columnIndex = columns.indexOf((e.target as HTMLDivElement).parentElement!);
        const width = (e.target as HTMLDivElement).parentElement!.clientWidth;
        sizeStore.setResizedItem('col', columnIndex, width);
    }

// TODO: Add separate component for table header cell
    return (
        <div>
            <div className={styles.buttons_wrapper}>
                <button onClick={action(() => peopleStore.fetchPeople())}>Fetch</button>
                <button onClick={action(() => peopleStore.clearPeople())}>Clear</button>
                <button onClick={() => navigateToAddPage()}>Add character</button>
            </div>
            {isPlaceholderShown && <p>No data. Fetch from server or add characters manually.</p>}
            {isLoading && <p>Loading...</p>}
            {!isPlaceholderShown && !isLoading && <table className={styles.table}>
                <thead>
                <tr>
                    <th className={styles.table__header} onClick={action(() => {
                        sortHandler('name')
                    })}>
                        <div
                            className={[styles.resizer, styles.resizer_first].join(' ')}
                            draggable={'true'}
                            onDragStart={e => resizeStartHandler(e)}
                            onDrag={e => resizeMoveHandler(e)}
                            onDragEnd={e => resizeEndHandler(e)}
                        ></div>
                        Name
                        <div
                            className={styles.resizer}
                            draggable={'true'}
                            onDragStart={e => resizeStartHandler(e)}
                            onDrag={e => resizeMoveHandler(e)}
                            onDragEnd={e => resizeEndHandler(e)}
                        >
                        </div>
                    </th>
                    <th className={styles.table__header} onClick={action(() => {
                        sortHandler('birth_year')
                    })}>Birth year
                        <div
                            className={styles.resizer}
                            draggable={'true'}
                            onDragStart={e => resizeStartHandler(e)}
                            onDrag={e => resizeMoveHandler(e)}
                            onDragEnd={e => resizeEndHandler(e)}
                        ></div>
                    </th>
                    <th className={styles.table__header} onClick={action(() => {
                        sortHandler('mass')
                    })}>Weight
                        <div
                            className={styles.resizer}
                            draggable={'true'}
                            onDragStart={e => resizeStartHandler(e)}
                            onDrag={e => resizeMoveHandler(e)}
                            onDragEnd={e => resizeEndHandler(e)}
                        ></div>
                    </th>
                    <th className={styles.table__header} onClick={action(() => {
                        sortHandler('height')
                    })}>Height
                        <div
                            className={styles.resizer}
                            draggable={'true'}
                            onDragStart={e => resizeStartHandler(e)}
                            onDrag={e => resizeMoveHandler(e)}
                            onDragEnd={e => resizeEndHandler(e)}
                        ></div>
                    </th>
                    <th className={styles.table__header} onClick={action(() => {
                        sortHandler('skin_color')
                    })}>Skin Color
                        <div
                            className={styles.resizer}
                            draggable={'true'}
                            onDragStart={e => resizeStartHandler(e)}
                            onDrag={e => resizeMoveHandler(e)}
                            onDragEnd={e => resizeEndHandler(e)}
                        ></div>
                    </th>
                    <th className={styles.table__header}>
                        <div
                            className={styles.resizer}
                            draggable={'true'}
                            onDragStart={e => resizeStartHandler(e)}
                            onDrag={e => resizeMoveHandler(e)}
                            onDragEnd={e => resizeEndHandler(e)}
                        ></div>
                    </th>
                </tr>
                </thead>
                <tbody>
                {peopleStore.people.map(people => <TableRow
                    people={people}
                    key={people.url}
                    dragStart={dragStartHandler}
                    dragEnd={dragEndHandler}
                    drop={dropHandler}
                />)}
                </tbody>
            </table>}
        </div>
    );
});

export default Table;
