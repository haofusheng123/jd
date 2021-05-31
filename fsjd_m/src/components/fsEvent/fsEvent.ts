import {fsEventType,fsEventTargetType} from "../../InterfaceList/components.js";

export default class FsEvent implements fsEventType{

    public type:string;
    public target!:fsEventTargetType;
    public currentTarget!:fsEventTargetType;
    [prop:string]:any;

    constructor(type:string) {
        this.type=type;
    }
}