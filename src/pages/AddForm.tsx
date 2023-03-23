import React, {FC} from 'react';
import styles from './AddForm.module.css';
import {useValidation} from "../hooks/use-validation";
import Input from "../components/Input";
import {emptyPeople, People} from "../models/People";
import peopleStore from "../store/PeopleStore";
import {useNavigate} from "react-router-dom";

const AddForm: FC = () => {

    function validation(v: string | number): boolean {
        return v.toString().trim().length > 0
    }

    const navigate = useNavigate();
    const navigateToTablePage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        navigate('/')
    }
    const {
        enteredValueHandler: nameValueHandler,
        inputTouchedHandler: nameTouchedHandler,
        resetInput: nameReset,
        enteredValue: name,
        enteredValueIsValid: nameIsValid,
        inputHasError: nameHasError
    } = useValidation(validation)

    const {
        enteredValueHandler: birthValueHandler,
        inputTouchedHandler: birthTouchedHandler,
        resetInput: birthReset,
        enteredValue: birth,
        enteredValueIsValid: birthIsValid,
        inputHasError: birthHasError
    } = useValidation(validation)

    const {
        enteredValueHandler: massValueHandler,
        inputTouchedHandler: massTouchedHandler,
        resetInput: massReset,
        enteredValue: mass,
        enteredValueIsValid: massIsValid,
        inputHasError: massHasError
    } = useValidation(validation)

    const {
        enteredValueHandler: heightValueHandler,
        inputTouchedHandler: heightTouchedHandler,
        resetInput: heightReset,
        enteredValue: height,
        enteredValueIsValid: heightIsValid,
        inputHasError: heightHasError
    } = useValidation(validation)

    const {
        enteredValueHandler: skinValueHandler,
        inputTouchedHandler: skinTouchedHandler,
        resetInput: skinReset,
        enteredValue: skin,
        enteredValueIsValid: skinIsValid,
        inputHasError: skinHasError
    } = useValidation(validation)

    const resetForm = () => {
        nameReset();
        birthReset();
        massReset();
        heightReset();
        skinReset();
    }

    const checkErrors = () => {
        nameTouchedHandler();
        birthTouchedHandler();
        massTouchedHandler();
        heightTouchedHandler();
        skinTouchedHandler();
    }

    const errorMessageBuilder = (): string => {
        const errors: string[] = [];
        if (nameHasError) errors.push('Name');
        if (birthHasError) errors.push('Birth year');
        if (massHasError) errors.push('Mass');
        if (heightHasError) errors.push('Height');
        if (skinHasError) errors.push('Skin color');
        return errors.join(', ')
    }

    const formHasErrors = nameHasError || birthHasError || massHasError || heightHasError || skinHasError;
    const formIsValid = nameIsValid && birthIsValid && massIsValid && heightIsValid && skinIsValid


    function addFormSubmitHandler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form as HTMLFormElement);
        const formObj = Object.fromEntries(formData.entries());
        const moddedData: People = Object.assign({}, emptyPeople, formObj);
        moddedData.url = Math.random().toString();
        checkErrors();

        if (formIsValid) {
            peopleStore.pushPeople(moddedData);
            resetForm();
            alert('Character has been added successfully');
            navigate('/');
        }
    }

    return (
        <div>
            <form className={styles.form} onSubmit={addFormSubmitHandler}>
                <Input
                    name={'name'}
                    label={'Name'}
                    type={'text'}
                    enteredValueHandler={nameValueHandler}
                    inputTouchedHandler={nameTouchedHandler}
                    enteredValue={name}
                    inputHasError={nameHasError}/>
                <Input
                    name={'birth_year'}
                    label={'Birth year'}
                    type={'text'}
                    enteredValueHandler={birthValueHandler}
                    inputTouchedHandler={birthTouchedHandler}
                    enteredValue={birth}
                    inputHasError={birthHasError}/>
                <Input
                    name={'mass'}
                    label={'Mass'}
                    type={'text'}
                    enteredValueHandler={massValueHandler}
                    inputTouchedHandler={massTouchedHandler}
                    enteredValue={mass}
                    inputHasError={massHasError}/>
                <Input
                    name={'height'}
                    label={'Height'}
                    type={'text'}
                    enteredValueHandler={heightValueHandler}
                    inputTouchedHandler={heightTouchedHandler}
                    enteredValue={height}
                    inputHasError={heightHasError}/>
                <Input
                    name={'skin_color'}
                    label={'Skin color'}
                    type={'text'}
                    enteredValueHandler={skinValueHandler}
                    inputTouchedHandler={skinTouchedHandler}
                    enteredValue={skin}
                    inputHasError={skinHasError}/>
                <div className={styles.form_buttons}>
                    <button type="submit"
                            disabled={formHasErrors}
                    >Submit
                    </button>
                    <button onClick={(e) => navigateToTablePage(e)}>Back</button>
                </div>

            </form>
            {formHasErrors && <p>Check fields: {errorMessageBuilder()}</p>}
        </div>
    );
};

export default AddForm;
