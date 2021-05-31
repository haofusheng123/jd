import home from "../../scripts/ts/home.js";
import detail from "../../scripts/ts/detail.js";
import mine from "../../scripts/ts/mine.js";
import shopcar from "../../scripts/ts/shopcar.js";




import mainWork from "./work.js";
import {runWorkType,routeType} from "../../InterfaceList/main.js";
import {routerOpation} from "./option.js";
import StoreMain from "../../store/s-main.js";
import SetHandler from "../../components/SetHandler/SetHandler.js";
import FsEvent from "../../components/fsEvent/fsEvent.js";
import { handerList } from "../../handlerType/handlerType.js";

let roterList:Array<string>,lazyLoadTab:Function|null;

function init() {
    // console.log("路由");
    setInitRoute();
    window.addEventListener("hashchange",hashChange);
    hashChange();
}

function hashChange () {
    if (location.hash.slice(1)==="") location.href="#home";
    roterList = (location.hash.slice(1) as runWorkType).split("/");
    lazyLoadTab && lazyLoadTab(roterList[0]);
    runWork(routerOpation,0);
    changeTab();
}

lazyLoadTab =function  (route:string) {
    if (StoreMain.instance.sotreData.tabModle.length===0) lazyLoadTab=null;
    let index = StoreMain.instance.sotreData.tabModle.indexOf(route);
    if (index>-1 || route==="") {
        StoreMain.instance.sotreData.tabModle[route]=null;
        StoreMain.instance.sotreData.tabModle.splice(index,1);
        LoadTabItem(route);
    }
}


// 为了尽量的少加载代码，讲模块的入口函数暴露，在跳转到相应路由时候执行模块入口函数

function LoadTabItem(route:string) {
    switch (route) {
        case "home":
            home(); //执行home模块的入口函数
            break;
        case "detail":
            detail(); //执行detail模块的入口函数
            break;
        case "shopcar":
            shopcar(); //执行detail模块的入口函数
            break;
        case "mine":
            mine(); //执行detail模块的入口函数
            break;
    }
}


//运用递归深查找路由配置的与哈希路由匹配的，执行对应的路由切换处理函数，如果发现二级路由，已配置的则执行他的处理函数没有配置的则仍然执行他的父级路由处理函数

function runWork (list:routeType,index:number):Function|routeType {
    if (!list.childRoute || list.childRoute.length===0) return list.run.call(mainWork.instance);
    for(let i=0;i<(list.childRoute as routeType[]).length;i++) {
        if ((list.childRoute as routeType[])[i].path===roterList[index]) {
            return runWork((list.childRoute as routeType[])[i],index+1);
        }
    }
    return list.run.call(mainWork.instance);
}


function setInitRoute () {
    roterList = (location.hash.slice(1) as runWorkType).split("/").slice(0,1);
    runWork(routerOpation,0);
}

function changeTab () {
    let evt = new FsEvent(handerList.CHANGE_TAB_BAR);

    let index:number=-1;

    for (var i=0;i<StoreMain.instance.sotreData.tabList.length;i++) {
        let bool = new RegExp("^"+StoreMain.instance.sotreData.tabList[i]).test(location.hash.slice(1));
        if (bool) {
            index=i;
            return;
        }
    }

    if (index===-1){
        console.log("路由切换失败")
        return;
    }

    evt.routeIndex = index;
    console.log("我要改变",evt.routeIndex);

    SetHandler.instance.dispatchEvent(evt);

}

export default init;