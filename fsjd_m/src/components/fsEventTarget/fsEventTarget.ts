import {fsEventType,fsEventTargetType} from "../../InterfaceList/components.js";

export default class FsEventTargetType implements fsEventTargetType{
    private handerList:{[type:string]:Array<Function|null>}={};

    constructor() {

    }

    public addEventListener(type:string,fn:(event?:fsEventType) => void) {
        this.handerList[type] || (this.handerList[type]=[]);

        if (this.handerList[type].indexOf(fn)>-1) return;
        this.handerList[type].push(fn);
    }
    public removeEventListener(type:string,fn:(event?:fsEventType) => void){
        if (!this.handerList[type]) return;
        let index=this.handerList[type].indexOf(fn);

        if (index===-1) return;
        this.handerList[type][index]=null;
        this.handerList[type].splice(index,1);
    }
    public dispatchEvent(event:fsEventType) {
        event.target=this;
        event.currentTarget=this;
        
        let eventList=this.handerList[event.type];
        if (!eventList ||eventList.length===0) return;
        for (let i=0;i<eventList.length;i++) {
            eventList[i]?.call(this,event);
        }

    }
}