export interface fsEventType{
    type:string;
    target:fsEventTargetType;
    currentTarget:fsEventTargetType;
    [prop:string]:any;
}

export interface fsEventTargetType{
    addEventListener:(type:string,fn:(event?:fsEventType) => void) => void;
    removeEventListener:(type:string,fn:(event?:fsEventType) => void) => void;
    dispatchEvent:(event:fsEventType) => void;
}

export interface AddTextType{
    forms:HTMLFormElement;
    inputs:HTMLInputElement;
    canvas:HTMLCanvasElement;
    video:HTMLVideoElement;
}
export interface RenderType{
    canvas:HTMLCanvasElement;
    ctx:CanvasRenderingContext2D;
}