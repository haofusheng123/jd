let dataName:any=Symbol("key");
export let dataList:any ={
    [dataName]:[],
    set data(value:[]){
        if (value.length>60) return;
        this[dataName].push(...value);
    },
    get data(){
        return this[dataName];
    }
}