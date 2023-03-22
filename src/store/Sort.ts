import {makeAutoObservable} from "mobx";
import {PeopleStringField} from "../models/People";

class SortStore {
    sortField: string | null = null;
    sortType: 'asc' | 'desc' | null = null;

    constructor() {
        makeAutoObservable(this);
        const sortFieldFromStorage = localStorage.getItem('sortField');
        const sortTypeFromStorage = localStorage.getItem('sortType');
        if (sortFieldFromStorage) {
            this.sortField = sortFieldFromStorage
        }
        if (sortTypeFromStorage) {
            this.setSortType(sortTypeFromStorage)
        }
    }

    setSortField(field: keyof PeopleStringField) {
        this.sortField = field;
        localStorage.setItem('sortField', field);
    }

    setSortType(type: string) {
        if (type === 'asc' || type === 'desc') {
            this.sortType = type;
            localStorage.setItem('sortType', type);
        }
    }
}


export default new SortStore();
