import FsEvent from "../fsEvent/fsEvent.js";
import FsEventTargetType from "../fsEventTarget/fsEventTarget.js";
import {handerList} from "../../handlerType/handlerType.js";



// 全局样式改变

export default class SetHandler extends FsEventTargetType {
    public navBar!:HTMLDivElement;
    public tabBar!:HTMLDivElement;
    public showCon!:HTMLDivElement;

    private static _instance:SetHandler;
    constructor () {
        super();
        this.getItem();
        this.addEventListener(handerList.DOM_SET_BAR,(e?:FsEvent) => this.setBar(e));

        this.addEventListener(handerList.GO_TOP,(e) => this.goTop(e));

        this.addEventListener(handerList.ADD_GOODS,(e) => this.addGoods(e));

    }

    private getItem () {
        this.navBar=document.querySelector(".nav-bar") as HTMLDivElement;
        this.tabBar=document.querySelector(".tab_bar") as HTMLDivElement;
        this.showCon=document.querySelector(".show-con") as HTMLDivElement;
    }

    static get instance () {
        if (!SetHandler._instance) {
            Object.defineProperty(SetHandler,"_instance",{
                value:Object.freeze(new SetHandler())
            })
        }
        return SetHandler._instance;
    }
    
    private setBar(e?:FsEvent) {
        let shownav:boolean=(e as FsEvent).shownav;
        let showtab:boolean=(e as FsEvent).showtab;
        
        this.navBar.style.display=shownav ? "block" : "none";
        this.tabBar.style.display=showtab ? "block" : "none";
        this.showCon.style.top=shownav ? "3.75rem" : "0";
        this.showCon.style.bottom=showtab ? "3.9375rem" : "0";
    }

    private goTop (e?:FsEvent) {
        if ((e as FsEvent).elem) {
            (e as FsEvent).elem.scrollTop=0;
        }
    }

    private addGoods (e?:FsEvent) {
        console.log(e);
    }

}