import React, {FC, useState} from 'react';
import {People} from "../models/People";
import peopleStore from "../store/PeopleStore";
import styles from './TableRow.module.css';
import sizeStore from "../store/Size";

interface TableRowProps {
    people: People;
    dragId: string | null;
    setDragId: (id: string | null) => void;
}

interface resizeData {
    rowHeight: number;
    initialPosition: number;
}

const TableRow: FC<TableRowProps> = ({people, dragId, setDragId}) => {

    const [resizeHeight, setResizeHeight] = useState<resizeData | null>(null)

    function dragStartHandler(e: React.DragEvent<HTMLTableRowElement>) {
        if(resizeHeight){
            return
        }
        const id = (e.target as HTMLTableRowElement).dataset.url;
        if(id){
            setDragId(id);
        }
    }

    function dropHandler(e: React.DragEvent<HTMLTableRowElement>) {
        e.preventDefault();
        if(resizeHeight){
            return
        }
        (e.target as HTMLElement).parentElement!.style.backgroundColor = '';
        let target = e.target;
        if(target instanceof HTMLDivElement){
            target = (e.target as HTMLDivElement).parentElement!;
        }
        const id = (target as HTMLTableCellElement).parentElement!.dataset.url;
        if(dragId){
            peopleStore.swapPeopleByUrl(id!, dragId);
        }
        (e.target as HTMLElement).parentElement!.style.backgroundColor = '';
        setDragId(null);
    }

    const dragOverHandler = (e: React.DragEvent<HTMLTableRowElement>) => {
        e.preventDefault();
        if(resizeHeight){
            return
        }
        (e.target as HTMLElement).parentElement!.style.backgroundColor = 'gray';
    }
    const dragEndHandler = (e: React.DragEvent<HTMLTableRowElement>) =>{
        if(resizeHeight){
            return
        }
        (e.target as HTMLElement).parentElement!.style.backgroundColor = '';
    }

    const dragLeaveHandler = (e: React.DragEvent<HTMLTableRowElement>) => {
        if(resizeHeight){
            return
        }
        (e.target as HTMLElement).parentElement!.style.backgroundColor = '';
    }

    function resizeStartHandler(e: React.DragEvent<HTMLDivElement>) {
        const rowHeight = (e.target as HTMLDivElement).parentElement!.offsetHeight;
        const initialPosition = e.clientY;
        setResizeHeight({rowHeight, initialPosition});
    }

    const resizeMoveHandler = (e: React.DragEvent<HTMLDivElement>) => {
        const change = e.clientY - resizeHeight!.initialPosition;
        if (resizeHeight) {
            (e.target as HTMLDivElement).parentElement!.parentElement!.style.height = `${(resizeHeight.rowHeight + change).toString()}px`;
        }
    }

    const resizeEndHandler = (e: React.DragEvent<HTMLDivElement>) => {
        setResizeHeight(null);
        const rows = [...document.querySelectorAll(`.${styles.table__row}`)];
        const rowIndex = rows.indexOf((e.target as HTMLDivElement).parentElement!.parentElement!);
        const height = (e.target as HTMLDivElement).parentElement!.clientHeight;
        sizeStore.setResizedItem('row', rowIndex, height);
    }

    const deleteButtonHandler = (name: string, url: string) => {
        if (confirm(`Do you want to delete ${name}?`)) {
            peopleStore.deletePeople(url)
        }
    }


    return (
        <tr className={styles.table__row}
            data-url={people.url}
            onDragStart={e => dragStartHandler(e)}
            onDragEnd={e => dragEndHandler(e)}
            onDragLeave={e => dragLeaveHandler(e)}
            onDragOver={e => dragOverHandler(e)}
            onDrop={e => dropHandler(e)}
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
