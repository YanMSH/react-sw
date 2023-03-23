import React, {FC} from 'react';
import styles from "./HomeControls.module.css";
import {action} from "mobx";
import peopleStore from "../store/PeopleStore";
import {useNavigate} from "react-router-dom";

const HomeControls: FC = () => {
    const navigate = useNavigate();
    const navigateToAddPage = () => {
        navigate('/add')
    }

    return (
        <div className={styles.buttons_wrapper}>
            <button onClick={action(() => peopleStore.fetchPeople())}>Fetch</button>
            <button onClick={action(() => peopleStore.clearPeople())}>Clear</button>
            <button onClick={() => navigateToAddPage()}>Add character</button>
        </div>
    );
};

export default HomeControls;
