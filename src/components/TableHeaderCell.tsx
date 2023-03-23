import React, {FC, useState} from 'react';
import styles from './TableHeaderCell.module.css';
import {action} from "mobx";
import sizeStore from "../store/Size";
import {PeopleStringField} from "../models/People";
import sortStore from "../store/Sort";
import peopleStore from "../store/PeopleStore";

interface TableHeaderCellProps {
    label: string;
    sortField: keyof PeopleStringField;
}

interface resizeData {
    cellWidth: number;
    initialPosition: number;
}

const TableHeaderCell: FC<TableHeaderCellProps> = ({label, sortField}) => {

    const [resizeWidth, setResizeWidth] = useState<null | resizeData>(null);

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


    return (
        <th
            className={styles.table__header}
            onClick={action(() => {sortHandler(sortField)})}>
            <div
                className={[styles.resizer, styles.resizer_first].join(' ')}
                draggable={'true'}
                onDragStart={e => resizeStartHandler(e)}
                onDrag={e => resizeMoveHandler(e)}
                onDragEnd={e => resizeEndHandler(e)}
            ></div>
            {label}
            <div
                className={styles.resizer}
                draggable={'true'}
                onDragStart={e => resizeStartHandler(e)}
                onDrag={e => resizeMoveHandler(e)}
                onDragEnd={e => resizeEndHandler(e)}
            >
            </div>
        </th>
    );
};

export default TableHeaderCell;
