import React, {FC, useState} from 'react';
import styles from './Table.module.css';
import {observer} from "mobx-react-lite";
import TableRow from "./TableRow";
import TableHeaderCell from "./TableHeaderCell";
import {People} from "../models/People";


const Table: FC<{people: People[]}> = observer(({people}) => {

    const [draggingRowId, setDraggingRowId] = useState<null | string>(null);


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
