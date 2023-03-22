import React, {useState} from "react";

export const useValidation = (validationFunc: (v: string | number) => boolean) => {
    const [enteredValue, setEnteredValue] = useState("");
    const [inputTouched, setInputTouched] = useState(false);
    const enteredValueHandler = (event: React.FormEvent) => {
        const target = event.target as HTMLInputElement;
        setEnteredValue(target.value);
    };

    const inputTouchedHandler = () => {
        setInputTouched(true);
    };

    const resetInput = () => {
        setEnteredValue("");
        setInputTouched(false);
    };

    const enteredValueIsValid = validationFunc(enteredValue);
    const inputHasError = !enteredValueIsValid && inputTouched;
    return {
        enteredValueHandler,
        inputTouchedHandler,
        resetInput,
        enteredValue,
        enteredValueIsValid,
        inputHasError,
    };
};
