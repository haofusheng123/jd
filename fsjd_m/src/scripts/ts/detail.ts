import StoreMain from "../../store/s-main.js";
import {getDetail , addGoods} from "../../network/work/detail.js";
import cookie from "../../network/common/Cookie.js";
import SlideOpa from "../../components/SlideOpa/slide-outer.js";
import SetHandler from "../../components/SetHandler/SetHandler.js";
import { handerList } from "../../handlerType/handlerType.js";
import FsEvent from "../../components/fsEvent/fsEvent.js";
import Utils from "../../common/Utils.js";
import Animation from "../../components/Animation/Animation.js";
import {goodsType,carType,sendType} from "../../InterfaceList/network.js";
import AjaxSend from "../../network/common/AjaxSend.js";



let detailSlide:HTMLDivElement,slideItem:SlideOpa|null,sNav2:HTMLDivElement,sNav1:HTMLDivElement,dPositionList:NodeList,changeNav:Function,loadImgShow:Function|null,navPrev:HTMLLIElement,navList:Array<HTMLLIElement>,skipBool:boolean,skipIndex:number,skipDirection:"top"|"bottom",skipSpend:number,showCon:HTMLDivElement,clickIndex:number,tabPrev:HTMLLIElement,slideCon:HTMLUListElement,detailData:goodsType,detailTitle:HTMLHeadElement,infoItem:HTMLSpanElement,detailCity:HTMLSpanElement,detailShop:HTMLDivElement,detailLike:HTMLOListElement,conIntr:HTMLUListElement,goCarBtn:HTMLAnchorElement,loadBool:Boolean;


function init(){
    getItem();
    getInitData();
    setInit();
    setEvent();
    getPosition();
    setSelfEvent();
}

function getItem() {
    detailSlide=document.querySelector(".s-detail-slide") as HTMLDivElement;
    sNav1=document.querySelector(".s-detail .s-detail-nav .s-d-nav-1") as HTMLDivElement;
    sNav2=document.querySelector(".s-detail .s-detail-nav .s-d-nav-2") as HTMLDivElement;
    dPositionList=document.querySelectorAll(".d-decration") as NodeList;
    // loginControl=document.querySelectorAll(".s-mine input") as NodeList;
    showCon=document.querySelector(".show-con") as HTMLDivElement;
    navList=Array.prototype.slice.call(document.querySelectorAll(".s-d-nav-2 li")) as Array<HTMLLIElement>;
    goCarBtn = document.querySelector(".go-car-btn") as HTMLAnchorElement;

    // renderDom

    slideCon=document.querySelector(".s-detail-slide ul") as HTMLUListElement;
    detailTitle=document.querySelector(".s-detail-title-text") as HTMLHeadElement;
    infoItem=document.querySelector(".s-d-e-info-item") as HTMLUListElement;
    detailCity=document.querySelector(".s-d-e-city") as HTMLHeadElement;
    detailShop=document.querySelector(".s-detail-shop") as HTMLDivElement;
    detailLike=document.querySelector(".s-detail-like ul li ol") as HTMLOListElement;
    conIntr=document.querySelector(".s-o-con-intr ul") as HTMLUListElement;
}

function setInit() {
    skipBool=false;
    skipIndex=0;
    skipSpend=10;
}

function getPosition () {
    for (let i=0;i<dPositionList.length;i++) {
        if (i===0) StoreMain.instance.sotreData.detailOption[i]=0;
        else StoreMain.instance.sotreData.detailOption[i]=Utils.getAbsDec(dPositionList[i] as HTMLElement).y-44;
    }
}

function setEvent() {
    SetHandler.instance.addEventListener(handerList.DOM_SCROLL,scrollHandler);
    SetHandler.instance.addEventListener(handerList.DETAIL_CHANGE_TAB,changeTab);
    SetHandler.instance.addEventListener(handerList.DETAIL_RENDER,getInitData);
    SetHandler.instance.addEventListener(handerList.DETAIL_RENDER,getInitData);
    Animation.instance.addFn(runSkip);
    sNav2.addEventListener("click",skipShow);
    goCarBtn.addEventListener("click",addCar);
}

function setSelfEvent () {
    
}

async function addCar (e:Event) {
    addGoods(detailData);
}

function changeTab (e?:FsEvent) {
    if (tabPrev) tabPrev.className="";
    tabPrev=document.querySelector(`[d-tab-show="${(e as FsEvent).detailTab}"]`) as HTMLLIElement;
    tabPrev.className="active";
    
}

function skipShow (e:Event) {
    if ((e.target as HTMLLIElement).nodeName!=="LI") return;
    let index = navList.indexOf(e.target as HTMLLIElement);
    if (index===skipIndex) return;
    skipDirection = skipIndex<index ? "bottom" : "top";
    skipIndex=index;
    skipSpend=Math.abs(StoreMain.instance.sotreData.detailOption[skipIndex]-showCon.scrollTop)/20;
    skipBool=true;
}

function runSkip () {
    if (!skipBool) return;
    if (skipDirection==="bottom") {
        showCon.scrollTop+=skipSpend;

        if (showCon.scrollTop>StoreMain.instance.sotreData.detailOption[skipIndex]-skipSpend) {
            showCon.scrollTop=StoreMain.instance.sotreData.detailOption[skipIndex];
            skipBool=false;
        }
    }else {
        showCon.scrollTop-=skipSpend;
        if (showCon.scrollTop<StoreMain.instance.sotreData.detailOption[skipIndex]+skipSpend) {
            showCon.scrollTop=StoreMain.instance.sotreData.detailOption[skipIndex];
            skipBool=false;
        }
    }
}

function setSlide(){
    if (slideItem) {
        (slideItem as SlideOpa).removeSlide();
        slideItem=null;
    }
    slideItem = new SlideOpa(detailSlide,"roll",true,document.documentElement.clientWidth);
    slideItem.removeBtn();
}


// 惰性操作减少了节流函数加载,在调用到的时候在进行执行将返回值的懒加载闭包函数放在

function scrollHandler (e?:FsEvent) {
    let top =(e as FsEvent).fsScrollTop;
    shadowNav(top);
    changeNav(e?.fsScrollTop);
    loadImgShow && loadImgShow(e?.fsScrollTop);
};

function shadowNav(top:number) {
    let num=top/200;
    sNav1.style.display=num>0.4 ? "none" : "flex";
    sNav2.style.display=num>0.2 ? "flex" : "none";
    sNav2.style.opacity=num+"";
    sNav1.style.opacity=(1-num*2)+"";
}

changeNav = function() {
    changeNav = Utils.throttle(function (top:number) {
        if (skipBool) return;
        for (let i=0;i<StoreMain.instance.sotreData.detailOption.length+1;i++) {
            if (top>=StoreMain.instance.sotreData.detailOption[i]) {
                continue;
            };
            navPrev && Utils.setClassName(navPrev,"active",true);
            navPrev=navList[skipIndex] as HTMLLIElement;
            navPrev && Utils.setClassName(navPrev,"active");
            skipIndex=i-1;
            return;
        }
    },0);
}

/*

    在滚动到指定位置将存储在标签的图片地址放在img的src中，在放入完成后将这个函数删除不再执行

*/

loadImgShow =function (top:number) {
    if (!loadBool) return;
    if (top < StoreMain.instance.sotreData.detailOption[StoreMain.instance.sotreData.detailOption.length-1]-showCon.clientHeight) return;
    let imgList:NodeList = document.querySelectorAll(".s-o-con-intr ul li img");
    for (let i=0;i<imgList.length;i++) {
        (imgList[i] as HTMLImageElement).src=(imgList[i] as HTMLImageElement).getAttribute("lazy-img") as string;
        (imgList[i] as HTMLImageElement).removeAttribute("lazy-img");
    }
    loadBool=false;
}

async function getInitData() {
    let pid:number=Number(StoreMain.instance.sotreData.detailId) || Number(cookie("fspid"));
    detailData =await getDetail(pid) as goodsType;
    console.log(detailData);
    renderHTML();
    setSlide();
}


function renderHTML(e?:FsEvent) {
    detailTitle.textContent=detailData.title;
    renderSlide();
    renderInfo();
    renderShop();
    renderLike();
    renderIntr();
}

function renderSlide() {
    let getSlideImg:Array<string>=detailData.detail.imgList.map(item => {
        return item.replace(/\/n5\//g,"/n1/");
    });
    slideCon.innerHTML=`
        ${(function (imgList) {
            return imgList.reduce((value,item) => {
                return value+`
                    <li>
                        <a href="javascript:void(0)">
                            <img
                                src="${item}">
                        </a>
                    </li>
                `
            },"")
        })(getSlideImg)}
    `;
}

function renderInfo () {
    if (detailData.detail.choose.cList[0]) {
        infoItem.textContent=detailData.detail.choose.cList[0].info;
    }

}

function renderCity () {
    // detailCity.textContent
}

function renderShop() {
    detailShop.innerHTML=`
        <a href="javascript:void(0)">
            <div class="s-d-shop-nav clear-float">
                <div class="shop-nav-head">
                    <img
                        src="//img10.360buyimg.com/cms/jfs/t1/127584/30/19006/119279/5fb61bb4E57ae231b/5d85b16072829fbe.jpg!q70.dpg.webp">
                </div>
                <div class="shop-nav-name">
                    <h4>${detailData.detail.shop.name}</h4>
                    <p>店铺星级: <span class="${(function (num) {
                        let starList:{[prop:string]:number}={tall:4,middle:3.5,low:0};
                        for (var prop in starList) {
                            if (Number(num) > starList[prop]) return prop;
                        }
                    })(detailData.detail.shop.star)}">${detailData.detail.shop.star}</span></p>
                </div>
            </div>
            <div class="s-d-shop-con flex-box flex-right">
                <div class="shop-con-opa clear-float">
                    <div>
                        <b>${detailData.detail.appraise}</b>
                        <p>粉丝人数</p>
                    </div>
                    <div>
                        <b>${detailData.detail.hotList.length+detailData.detail.lookList.length+detailData.detail.newList.length}</b>
                        <p>全部商品</p>
                    </div>
                </div>
                <div class="shop-star">
                    <ul>
                        ${(function (list:Array<{desc:string,num:number}>) {
                            return list.reduce((value:string,item:{desc:string,num:number},index:number) => {
                                return value+`
                                    <li><i>${item.desc.slice(2)}</i><span class="${(function (num) {
                                        let starList:{[prop:string]:number}={tall:9.5,middle:9,low:0};
                                        for (var prop in starList) {
                                            if (Number(num) > starList[prop]) {
                                            
                                                return prop;
                                            }
                                        }
                                    })(detailData.detail.shop.grade[index].num)}">${item.num} | ${(function (num) {
                                        let starList:{[prop:string]:{num:number,text:string}}={tall:{num:9.5,text:"高"},middle:{num:9,text:"中"},low:{num:0,text:"低"}};
                                        for (var prop in starList) {
                                            if (Number(num) > starList[prop].num) {
                                                return starList[prop].text;
                                            }
                                        }
                                    })(detailData.detail.shop.grade[index].num)}</span></li>
                                `
                            },"")
                        })(detailData.detail.shop.grade)}
                    </ul>
                </div>
            </div>
        </a>
        <div class="s-d-shop-btn flex-box flex-right">
            <a href="javascript:void(0)" shop-name="${detailData.detail.shop.name}" class="collect-shop">
                <span class="iconfont icon-shoucang1"></span>关注店铺
            </a>
            <a href="javascript:void(0)" shop-name="${detailData.detail.shop.name}" class="go-shop">
                <span class="iconfont icon-dianpu"></span>进入店铺
            </a>
        </div>
    `;
}

function renderLike() {
    detailLike.innerHTML=`
        ${(function (list:Array<{price:string,name:string,img:string}>) {
            return list.reduce((value:string,item:{price:string,name:string,img:string}) => {
                return value+`
                    <li>
                        <a href="javascript:void(0)">
                            <div class="c-d-like-img">
                                <img src="${item.img}">
                            </div>
                            <p>${item.name}</p>
                            <strong><i>￥</i>${item.price}</strong>
                        </a>
                    </li>
                `
            },"")
        })((detailData.detail.hotList as Array<{price:string,name:string,img:string}>).concat(detailData.detail.newList as  Array<{price:string,name:string,img:string}>).slice(0,6))}
    `;
}

function renderIntr () {
    if (!detailData.detail.moreList || detailData.detail.moreList.length===0) return;
    conIntr.innerHTML=`
        ${(function (imgList:Array<string>) {
            return imgList.reduce((value:string,item:string) => {
                return value+`
                    <li>
                        <img lazy-img="${item}">
                    </li>
                `
            },"")
        })(detailData.detail.moreList)}
    `;
    loadBool=true;
}




export default init;