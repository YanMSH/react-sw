import {action, makeAutoObservable} from "mobx";
import {People, PeopleStringField, PeopleStringFieldKeys} from '../models/People'
import sortStore from './Sort';
import sizeStore from './Size';
import Utils from "../utils/Utils";
class PeopleStore{
    people : People[] = [];
    status: 'init' | 'success' | 'loading' | 'error' = 'init';
    constructor() {
        makeAutoObservable(this);
        const peopleString = localStorage.getItem('peopleData');
        if(peopleString){
            this.people = JSON.parse(peopleString);
        }
        if(this.people.length > 0){
            this.status = 'success'
        }
    }

    fetchPeople(): void {
        this.people = [];
        this.status = 'loading';
        fetch(import.meta.env.VITE_API_URL + 'people')
            .then(resp => resp.json())
            .then(action('fetchSuccess',json => {
                this.setPeople([...this.people, ...json.results]);
                if(sortStore.sortField && sortStore.sortType){
                    this.sortPeople(sortStore.sortField, sortStore.sortType);
                }
                this.status = 'success';
                sizeStore.clearResizeData();
            }))
    }

    deletePeople(url: string): void{
        const deletedPeople = this.people.find(people => people.url === url);
        const index = this.people.indexOf(deletedPeople!);
        this.setPeople(this.people.filter(people => people.url !== url));
        sizeStore.deleteSizeItem(index);
        if(this.people.length === 0){
            sizeStore.clearResizeData();
            this.status = 'init'
        }
    }

    clearPeople(): void{
        this.people = [];
        this.unsavePeople();
        this.status = 'init';
    }

    savePeople(){
        if(this.people){
            localStorage.setItem('peopleData', JSON.stringify(this.people));
            this.status = 'success';
        }
    }

    setPeople(people: People[]){
        this.people = people;
        this.savePeople();
    }

    unsavePeople(){
        localStorage.removeItem('peopleData')
    }

    swapPeople(people1: People, people2: People){
        const index1 = this.people.indexOf(people1);
        const index2 = this.people.indexOf(people2);
        this.setPeople(Utils.swapArrayElements(this.people, people1, people2));
        if(index1 > -1 && index2 > -1){
            sizeStore.swapSizes(index1, index2);
        }
    }
    pushPeople(people: People){
        this.people = [...this.people, people];
        this.savePeople();
        sizeStore.pushSizeItem()
    }

    sortPeople(fieldName: string, sortType: 'asc' | 'desc'): void {
        if(!PeopleStringFieldKeys.includes(fieldName)){
            return
        }
        this.setPeople(this.people.sort((a, b) => {
            const convertedA = Utils.convertStringToNumber(a[fieldName as keyof PeopleStringField]);
            const convertedB = Utils.convertStringToNumber(b[fieldName as keyof PeopleStringField]);
            if (convertedA > convertedB) return sortType === 'asc' ? 1 : -1;
            if (convertedB > convertedA) return sortType === 'asc' ? -1 : 1;
            return 0;
        }))
    }
}

export default new PeopleStore();
