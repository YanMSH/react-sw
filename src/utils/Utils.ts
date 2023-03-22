export default class Utils {

    static convertStringToNumber(str: string): number | string {
        const convertedString = parseInt(str);
        return isNaN(convertedString) ? str : convertedString
    }

    static swapArrayElements<T>(arr: T[], el1: T, el2: T) {
        const swapArr = [...arr];
        const indexOfEl1 = swapArr.indexOf(el1);
        const indexOfEl2 = swapArr.indexOf(el2);
        const tmp = swapArr[indexOfEl2];
        swapArr[indexOfEl2] = swapArr[indexOfEl1];
        swapArr[indexOfEl1] = tmp;
        return swapArr;
    }

    static swapArrayElementsByIndex<T>(arr: T[] | (null | T)[], index1: number, index2: number) {
        const swapArr = [...arr];
        const tmp = swapArr[index2];
        swapArr[index2] = swapArr[index1];
        swapArr[index1] = tmp;
        return swapArr;
    }
}
