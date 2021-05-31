import RouterSet from "../obServer/main.js";
import { handerList } from "../../handlerType/handlerType.js";
import SotreMain from "../../store/s-main.js";
import SetHandler from "../../components/SetHandler/SetHandler.js";
import FsEvent from "../../components/fsEvent/fsEvent.js";
import token from "../../common/token.js";

// 冻结防止路由处理事件在外部被修改
// 三重锁定
export default class MainWork{
    private static _instance:MainWork;
    constructor () {
        
    }
    static get instance () {
        if (!MainWork._instance) {
            Object.defineProperty(MainWork,"_instance",{
                value:Object.freeze(new MainWork())
            });
        }
        return MainWork._instance;
    }

    public homeWork () {
        this.changeTab("home");
        this.changeNav("home");
        this.changeBar(true,true);
        this.goTop();
    } 
    public classifyWork () {
        this.changeTab("classify");
        this.changeNav("classify");
        this.changeBar(true,true);
        this.goTop();
    } 
    public shopcarWork () {
        this.changeTab("shopcar");
        this.changeNav("shopcar");
        this.changeBar(false,true);
        this.goTop();
    } 
    public mineWork () {
        this.changeTab("mine");
        this.changeNav("mine");
        this.changeBar(false,true);
        this.goTop();
        this.durgeLogin();
    } 

    public register () {
        this.changeTab("mine");
        this.changeBar(false,true);
        this.changeMineTab("register");
    }

    public mymine () {
        this.changeTab("mine");
        this.changeBar(false,true);
        this.changeMineTab("mymine");
    }

    public login () {
        this.changeTab("mine");
        this.changeBar(false,true);
        this.changeMineTab("login");
    }


    public detailWork () {
        this.changeTab("detail");
        this.changeBar(false,false);
        this.dIntr();
        this.goTop();

        let evt = new FsEvent(handerList.DETAIL_RENDER);
        SetHandler.instance.dispatchEvent(evt);
    } 

    public dIntr () {
        this.changeTab("detail/intr");
        this.changeDetailTab("intr");
    }

    public dParam () {
        this.changeTab("detail/param");
        this.changeDetailTab("param");
    }

    public dAftersale () {
        this.changeTab("detail/aftersale");
        this.changeDetailTab("aftersale");
    }

    private changeBar(shownav:boolean,showtab:boolean) { //是否隐藏上下导航栏
        let evt = new FsEvent(handerList.DOM_SET_BAR);
        evt.shownav=shownav;
        evt.showtab=showtab;
        SetHandler.instance.dispatchEvent(evt);
    }
    private changeTab(route:string) { //改变路由页面
        let evt = new FsEvent(handerList.ROUTER_CHANGE);
        evt.router=route;
        RouterSet.instance.dispatchEvent(evt);
    }

    private changeNav(value:string){ //改变导航栏的内容
        SotreMain.instance.sotreData.navName=SotreMain.instance.sotreData.navNameList[value];
    }

    private changeDetailTab (value:string) {
        let evt=new FsEvent(handerList.DETAIL_CHANGE_TAB);
        evt.detailTab=value;
        SetHandler.instance.dispatchEvent(evt);
    }

    private changeMineTab (value:string) {
        let evt=new FsEvent(handerList.Mine_CHANGE_TAB);
        evt.mineTab=value;
        SetHandler.instance.dispatchEvent(evt);
    }

    private goTop () {
        let evt=new FsEvent(handerList.GO_TOP);
        SetHandler.instance.dispatchEvent(evt);
    }

    private durgeLogin () {
        token(function () {
            (document.querySelector(".s-m-head-center") as HTMLDivElement).textContent="我的主页";
        },function () {
            location.href="http://localhost:8080/dist/#mine/login";
            (document.querySelector(".s-m-head-center") as HTMLDivElement).textContent="京东登录注册";
        })
    }
}

MainWork.instance;