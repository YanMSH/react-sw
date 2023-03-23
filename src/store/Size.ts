import {makeAutoObservable} from "mobx";
import Utils from "../utils/Utils";
import {COLUMNS_AMOUNT, ROWS_AMOUNT} from "../utils/Constants";

interface resizeLoadData {
    columns: (number | null)[];
    rows: (number | null)[];
}

class SizeStore {

    resizeData: resizeLoadData | null = null;

    constructor() {
        makeAutoObservable(this);
        this.init();
    }

    init(): void {
        const dataString = localStorage.getItem('resizeData');
        if (dataString) {
            const peopleDataExists = !!localStorage.getItem('peopleData');
            if (peopleDataExists) {
                const resizeDataLS = JSON.parse(dataString);
                if (resizeDataLS.hasOwnProperty('columns') && resizeDataLS.hasOwnProperty('rows')) {
                    this.resizeData = resizeDataLS;
                }
            } else {
                this.clearResizeData()
            }
        } else {
            this.clearResizeData()
        }
    }

    saveResizeData(): void {
        if (this.resizeData) {
            localStorage.setItem('resizeData', JSON.stringify(this.resizeData));
        }
    }

    clearResizeData(): void {
        this.resizeData = {
            columns: Array(COLUMNS_AMOUNT).fill(null),
            rows: Array(ROWS_AMOUNT).fill(null)
        }
        this.saveResizeData();
    }

    setResizedItem(type: 'col' | 'row', index: number, data: number): void {
        if (!this.resizeData) {
            this.clearResizeData();
        }
        if (type === 'col') {
            const currentColumns = this.resizeData!.columns;
            currentColumns[index] = data;
            this.resizeData = {...this.resizeData!, columns: currentColumns}
        }
        if (type === 'row') {
            const currentRows = this.resizeData!.rows;
            currentRows[index] = data;
            this.resizeData = {...this.resizeData!, rows: currentRows}
        }
        this.saveResizeData();
    }

    pushSizeItem() {
        if (this.resizeData) {
            this.resizeData.rows = [...this.resizeData.rows, null]
        }
        this.saveResizeData();
    }

    swapSizes(size1: number, size2: number){
        if(this.resizeData){
            this.resizeData.rows = Utils.swapArrayElementsByIndex(this.resizeData.rows, size1, size2)
        }
        this.saveResizeData();
    }

    applySizes(type: 'rows' | 'cols', elems: Element[]){
        if(this.resizeData){
            if(type === 'cols'){
                this.resizeData.columns.forEach((columnWidth, index) => {
                    if (columnWidth) {
                        (elems[index] as HTMLElement).style.width = `${columnWidth}px`;
                    }
                })
            }
            if(type === 'rows'){
                this.resizeData.rows.forEach((rowHeight, index) => {
                    if (rowHeight) {
                        (elems[index] as HTMLElement).style.height = `${rowHeight}px`
                    }
                })
            }
        }
    }

    deleteSizeItem(index: number){
        if(this.resizeData) {
            const temp = [...this.resizeData.rows];
            temp.splice(index, 1);
            this.resizeData.rows = temp;
            this.saveResizeData();
        }
    }

}

export default new SizeStore()
