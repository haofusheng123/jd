import store from "../../store/index.js";
import router from "../../router/main/main.js";


import Animation from "../../components/Animation/Animation.js";
import Utile from "../../common/Utils.js";
import StoreMain from "../../store/s-main.js";
import SlideOpa from "../../components/SlideOpa/slide-outer.js";
import SetHandler from "../../components/SetHandler/SetHandler.js";
import FsEvent from "../../components/fsEvent/fsEvent.js";
import {handerList} from "../../handlerType/handlerType.js";
import cookie from "../../common/Cookie.js";
import {login ,register,getGoods } from "../../network/work/mine.js";

let tabBar:HTMLDivElement,tabList:Array<HTMLLIElement>,tabPrev:HTMLLIElement,showCon:HTMLDivElement,homeSlideshow:HTMLDivElement,slideOpa:SlideOpa;

init();

function init() {
    store(); //使用公有数据
    router(); //开启路由

    getItem();
    setInit();
    setEvent();

    slideOpa = new SlideOpa(homeSlideshow,"roll",true,document.documentElement.clientWidth*0.9);
    slideOpa.removeBtn();
    Animation.instance.addFn(SlideOpa.RunAllSlide);
}




function setInit() {
    setBar();
    setRouter();
    getShopcar();
}

function setBar() {
    let evt = new Event("hashchange");
    window.dispatchEvent(evt);
}

async function getShopcar(){
    let goodResult = await getGoods({
        username:cookie("username") as string,
        password:cookie("password") as string
    });
    if (goodResult.type="succeed") {
        StoreMain.instance.sotreData.shopcar=goodResult.detail.value;
        StoreMain.instance.sotreData.shop_num=StoreMain.instance.sotreData.shopcar.length;
    }
}

function setRouter () {
    let index = StoreMain.instance.sotreData.tabList.indexOf(location.hash.slice(1));
    if (index===2) index=3;
    checkTab(index>-1 ? index : 0);
}

function getItem() {
    tabBar=$(".tab_bar") as HTMLDivElement;
    tabList=$(".tab_bar li") as Array<HTMLLIElement>;
    showCon=$(".show-con") as HTMLDivElement;
    homeSlideshow=$(".s-home-slideshow") as HTMLDivElement;
}

function setEvent() {
    tabBar.addEventListener("click",tabChange);
    showCon.addEventListener("scroll",scrollHandler);
    SetHandler.instance.addEventListener(handerList.GO_TOP,goTop);
    SetHandler.instance.addEventListener(handerList.CHANGE_TAB_BAR,tabAllChange);
}

function goTop(e?:FsEvent) {
    showCon.scrollTop=0;
}

function tabChange (e:Event) {
    if ((e.target as HTMLElement).nodeName!=="IMG") return;
    let index:number = Number((e.target as HTMLElement).getAttribute("tab_index"));
    checkTab(index);
}

function tabAllChange(e?:FsEvent){
    checkTab((e as FsEvent).routeIndex);
}

function checkTab(index:number) {
    // console.log()
    if (tabPrev) Utile.setClassName(tabPrev,"active",true);
    tabPrev=tabList[index];
    Utile.setClassName(tabPrev,"active");
}

// 在多个模块中都要用到这个滚动事件，在触发时向全局观察者抛发，所有模块通过在全局观察者中订阅这个事件，就可以实时获取观察者给的滚动时间

function scrollHandler (e:Event) {
    let evt = new FsEvent(handerList.DOM_SCROLL);
    evt.fsScrollTop=(e.target as HTMLDivElement).scrollTop;
    SetHandler.instance.dispatchEvent(evt);
}
