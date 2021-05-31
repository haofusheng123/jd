//自建事件对象类型

export interface fsEventType{
    type:string;
    target:fsEventTargetType;
    currentTarget:fsEventTargetType;
    [prop:string]:any;
}

//自建事件目标对象类型

export interface fsEventTargetType{
    addEventListener:(type:string,fn:(event?:fsEventType) => void) => void;
    removeEventListener:(type:string,fn:(event?:fsEventType) => void) => void;
    dispatchEvent:(event:fsEventType) => void;
}


export interface backTopBtnTop{
    elem:HTMLDivElement;
}