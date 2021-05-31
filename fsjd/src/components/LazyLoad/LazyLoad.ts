import Utils from "../../common/Utils.js";

interface lazyType {
    elem:HTMLElement;
    start:number;
    addData:(data:object[]) => void;
}

/*
    lazyLoad
    实时监听滚动到达指定位置后抛发事件，处理交给外面


    方法 : addData
    添加到容器元素中，添加完成重置位置，再次侦听
*/

export default class lazyLoad extends EventTarget implements lazyType {
    static LOAD_DATA:string="load_data";
    public elem!:HTMLElement;
    public start!:number;
    private clientHeight!:number;
    private top!:number;
    private nextBool:boolean=true;

    static ListenList:any[]=[];
    static ListenAll() {
        lazyLoad.ListenList.forEach(item => {
            item.listenTop();
        })
    }

    constructor (elem:HTMLElement,start:number) {
        super();
        this.setInit(elem,start);
        window.addEventListener("resize",(e) => this.resizeHandler(e));
        this.dispatch();
        lazyLoad.ListenList.push(this);
    }

    setInit(elem:HTMLElement,start:number) {
        this.clientHeight=document.documentElement.clientHeight;
        this.elem=elem;
        this.top=start;
    }

    resizeHandler(e:Event) {
        this.resizeHandler=Utils.throttle((e:Event) => {
            this.clientHeight=document.documentElement.clientHeight;
        },200,false);
    }

    listenTop() {
        this.listenTop=Utils.throttle((e:Event) => {
            if (document.documentElement.scrollTop > this.top-(this.clientHeight*1.3)) {
                this.dispatch();
                this.nextBool=false;
            }
        },200,false);
    }

    dispatch() {
        if (!this.nextBool) return;
        let evt=new Event(lazyLoad.LOAD_DATA);
        (this as any).dispatchEvent(evt);
    }

    addData(htmls:any) {
        this.elem.innerHTML+=htmls;
        this.top=document.body.clientHeight;
        this.nextBool=true;
    }
}