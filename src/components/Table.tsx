import React, {FC, useEffect, useState} from 'react';
import styles from './Table.module.css';
import {observer} from "mobx-react-lite";
import TableRow from "./TableRow";
import TableHeaderCell from "./TableHeaderCell";
import {People, PeopleStringField} from "../models/People";
import headStyles from "./TableHeaderCell.module.css";
import rowStyles from "./TableRow.module.css";
import sizeStore from "../store/Size";

export interface colsData {
    label: string,
    sortField: keyof PeopleStringField
}

const Table: FC<{ rowsData: People[], colsData: colsData[] }> = observer(({rowsData, colsData}) => {

    const [draggingRowId, setDraggingRowId] = useState<null | string>(null);

    const init = () => {
        const tableHeadCells = [...document.querySelectorAll(`.${headStyles.table__header}`)];
        const tableRows = [...document.querySelectorAll(`.${rowStyles.table__row}`)];
        sizeStore.applySizes('cols', tableHeadCells);
        sizeStore.applySizes('rows', tableRows);
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <table className={styles.table}>
            <thead>
            <tr>
                {colsData.map(column =>
                    <TableHeaderCell
                        label={column.label}
                        sortField={column.sortField}
                        key={column.sortField}
                    />)}
            </tr>
            </thead>
            <tbody>
            {rowsData.map(people => <TableRow
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
