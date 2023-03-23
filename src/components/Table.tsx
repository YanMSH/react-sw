import React, {FC, useEffect, useState} from 'react';
import styles from './Table.module.css';
import {observer} from "mobx-react-lite";
import TableRow from "./TableRow";
import TableHeaderCell from "./TableHeaderCell";
import {People} from "../models/People";
import headStyles from "./TableHeaderCell.module.css";
import rowStyles from "./TableRow.module.css";
import sizeStore from "../store/Size";


const Table: FC<{people: People[]}> = observer(({people}) => {

    const [draggingRowId, setDraggingRowId] = useState<null | string>(null);

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

    return (
                <table className={styles.table}>
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
                {people.map(people => <TableRow
                    people={people}
                    dragId={draggingRowId}
                    setDragId={setDraggingRowId}
                    key={people.url}
                />)}
                </tbody>
            </table>
    );
});

export default Table;
