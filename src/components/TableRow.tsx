import React, {FC, useState} from 'react';
import {People} from "../models/People";
import peopleStore from "../store/PeopleStore";
import styles from './TableRow.module.css';
import sizeStore from "../store/Size";

interface TableRowProps {
    people: People;
    dragStart: (e: React.DragEvent<HTMLTableRowElement>, people: People) => void;
    dragEnd: (e: React.DragEvent<HTMLTableRowElement>) => void;
    drop: (e: React.DragEvent<HTMLTableRowElement>, people: People) => void;
}

interface resizeData {
    rowHeight: number;
    initialPosition: number;
}

const TableRow: FC<TableRowProps> = ({people, dragStart, drop, dragEnd}) => {

    const [resizeHeight, setResizeHeight] = useState<resizeData | null>(null)


    function dragOverHandler(e: React.DragEvent<HTMLTableRowElement>) {
        e.preventDefault();
        (e.target as HTMLElement).parentElement!.style.backgroundColor = 'gray';
    }


    const dragEndHandler = (e: React.DragEvent<HTMLTableRowElement>) => {
        (e.target as HTMLElement).parentElement!.style.backgroundColor = '';
    }

    function resizeStartHandler(e: React.DragEvent<HTMLDivElement>) {
        const rowHeight = (e.target as HTMLDivElement).parentElement!.offsetHeight;
        const initialPosition = e.clientY;
        setResizeHeight({rowHeight, initialPosition});
    }

// TODO: Add flag for drag state. Toggle flag on resize;
    function resizeMoveHandler(e: React.DragEvent<HTMLDivElement>) {
        const change = e.clientY - resizeHeight!.initialPosition;
        if (resizeHeight) {
            (e.target as HTMLDivElement).parentElement!.parentElement!.style.height = `${(resizeHeight.rowHeight + change).toString()}px`;
        }
    }

    function resizeEndHandler(e: React.DragEvent<HTMLDivElement>) {
        setResizeHeight(null);
        const rows = [...document.querySelectorAll(`.${styles.table__row}`)];
        const rowIndex = rows.indexOf((e.target as HTMLDivElement).parentElement!.parentElement!);
        const height = (e.target as HTMLDivElement).parentElement!.clientHeight;
        sizeStore.setResizedItem('row', rowIndex, height);
    }

    function deleteButtonHandler(name: string, url: string) {
        if (confirm(`Do you want to delete ${name}?`)) {
            peopleStore.deletePeople(url)
        }
    }


    return (
        <tr className={styles.table__row}
            onDragStart={e => {
                dragStart(e, people)
            }}
            onDragEnd={e => {
                dragEnd(e)
            }}
            onDragLeave={e => {
                dragEndHandler(e)
            }}
            onDragOver={e => {
                dragOverHandler(e)
            }}
            onDrop={e => {
                drop(e, people)
            }}
            draggable={"true"}
        >
            <td>{people.name}
                <div
                    className={styles.resizer}
                    draggable={'true'}
                    onDragStart={e => resizeStartHandler(e)}
                    onDrag={e => resizeMoveHandler(e)}
                    onDragEnd={e => resizeEndHandler(e)}
                ></div>
            </td>
            <td>{people.birth_year}</td>
            <td>{people.mass}</td>
            <td>{people.height}</td>
            <td>{people.skin_color}</td>
            <td onClick={() => deleteButtonHandler(people.name, people.url)}>Delete</td>
        </tr>
    );
};


export default TableRow;
