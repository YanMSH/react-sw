import {action, makeAutoObservable} from "mobx";
import {People, PeopleStringField, PeopleStringFieldKeys} from '../models/People'
import sortStore from './Sort';
import sizeStore from './Size';
import Utils from "../utils/Utils";
class PeopleStore{
    people : People[] = [];
    page = 1;
    isFirstPage = true;
    isLastPage = false;
    status: 'init' | 'success' | 'loading' | 'error' = 'init';
    constructor() {
        makeAutoObservable(this);
        this.init();
    }

    init(){
        const peopleString = localStorage.getItem('peopleData');
        const page = localStorage.getItem('currentPage');
        const lastPageString = localStorage.getItem('lastPage');
        const firstPageString = localStorage.getItem('firstPage');
        if(page){
            const numberPage = Number(page);
            if(!isNaN(numberPage)){
                this.page = Number(page);
            }
        } else {
            this.page = 1;
            this.savePage();
        }
        if(lastPageString){
            this.isLastPage = JSON.parse(lastPageString);
        }
        if(firstPageString){
            this.isFirstPage = JSON.parse(firstPageString);
        }
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
        let url = `${import.meta.env.VITE_API_URL + 'people'}`;
        if(this.page){
            url += `/?page=${this.page}`;
        }
        fetch(url)
            .then(resp => resp.json())
            .then(action('fetchSuccess',json => {
                this.setPeople([...this.people, ...json.results]);
                if(sortStore.sortField && sortStore.sortType){
                    this.sortPeople(sortStore.sortField, sortStore.sortType);
                }
                this.status = 'success';
                sizeStore.clearResizeData();
                this.isFirstPage = !json.previous;
                this.isLastPage = !json.next;
                this.savePage();
            }))
    }

    savePage(){
        if(this.page){
            localStorage.setItem('lastPage', this.isLastPage.toString());
            localStorage.setItem('firstPage', this.isFirstPage.toString());
            localStorage.setItem('currentPage', this.page.toString())
        }
    }

    unsavePage(){
        localStorage.removeItem('lastPage')
        localStorage.removeItem('firstPage')
        localStorage.removeItem('currentPage')
        this.page = 1;
    }

    nextPage(){
        this.page += 1;
        this.fetchPeople();
        this.savePage();
    }

    prevPage(){
        this.page -= 1;
        this.fetchPeople();
        this.savePage();
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
        this.unsavePage();
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

    swapPeopleByUrl(url1: string, url2: string){
        const index1 = this.people.findIndex(people => people.url === url1);
        const index2 = this.people.findIndex(people => people.url === url2);
        if(index1 > -1 && index2 > -1){
            this.setPeople(Utils.swapArrayElementsByIndex(this.people, index1, index2));
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
