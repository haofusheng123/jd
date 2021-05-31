import SlideOpa from "../../components/SlideOpa/slide-outer.js";
import Utils from "../../common/Utils.js";
import ajax from "../../common/AjaxSend.js";
import LazyLoad from "../../components/LazyLoad/LazyLoad.js";
import Search from "../../components/Search/Search.js";
import { dataList } from "../../store/index.js";
import Cookie from "../../common/Cookie.js";
import token from "../../common/token.js";

let bannerBig: any, bannerSmall: any, bannerSeckill: any, fsSeEnd: any, fsSeTime: any, tRuntime: Function, dateOld: Date, dateNew: Date, findSlideOuter: any, fsNewSlideOuter: any, backBtn: any, backBtnOuter: any, backtop: any, changeElev: () => void, searchItem: any, dimSearch: (e: any) => void, searchBox: any, search: any, searchBoxF: any, searchItemF: any, searchF: any, searchFixed: any, recomFloat: any, bannerJdText: any, quitBtn: any,carLen:number,shopNum:any,capUser:any;

let topnum: number, topdecri: string, elevatorBool: boolean, elevaSpend: number, prevele: HTMLElement;

let scrollBool: boolean;
let fsRecomLazy: any;
let page: number;

let bigSlide: { runSlide: () => void, [prop: string]: any };
let smallSlide: { runSlide: () => void, [prop: string]: any };
let seckillSlide: { runSlide: () => void, [prop: string]: any };
let findSlide: { runSlide: () => void, [prop: string]: any };
let fsNewSlide: { runSlide: () => void, [prop: string]: any };
let lazy: { addData: (data: object[]) => void }

enum backTopList {
    ".fs-seckill",
    ".fs-so",
    ".fs-square",
    ".fs-recom"
};

function init() {
    judgeFac();
    setElem();

    topdecri = "up";
    topnum = 0;
    elevatorBool = false;
    scrollBool = true;
    elevaSpend = 0;
    page = 0;

    bigSlide = new SlideOpa(bannerBig, "flicker", true);
    smallSlide = new SlideOpa(bannerSmall, "flicker", false);
    seckillSlide = new SlideOpa(bannerSeckill, "roll", false);
    findSlide = new SlideOpa(findSlideOuter, "roll", true, undefined, 1, 1.5);
    fsNewSlide = new SlideOpa(fsNewSlideOuter, "roll", true);
    search = new Search({ searchItem, searchBox });
    searchF = new Search({ searchBox: searchBoxF, searchItem: searchItemF });
    seckillSlide.removeIcon();
    findSlide.removeIcon();
    fsNewSlide.removeIcon();
    findSlide.removeBtn();

    lazy = new LazyLoad(fsRecomLazy, document.body.clientHeight);


    backtop.addEventListener("click", backHandler);
    window.addEventListener("scroll", scrollHandler);
    (lazy as any).addEventListener(LazyLoad.LOAD_DATA, getInitData);
    backBtn.forEach((item: any) => {
        item.addEventListener("click", backHandler);
    })

    tRuntime = Utils.throttle(runTime, 200);

    setSeckill();
    scrollHandler();
    setHead();
    animation();
}

function judgeFac () {
    console.log(navigator.userAgent);
}

function setElem() {
    searchBox = $(".nav-search-box");
    searchItem = $(".nav-search-item");
    bannerBig = $(".banner-big [slide-start]");
    bannerSmall = $(".banner-small [slide-start]");
    bannerSeckill = $(".fs-se-center [slide-start]");
    findSlideOuter = $(".find-right-content [slide-start]");
    fsNewSlideOuter = $(".fs-new-item [slide-start]");
    searchBoxF = $(".nav-search-fixed-box");
    searchItemF = $(".nav-search-fixed-item");
    searchFixed = $(".nav-fixed-outer");
    recomFloat = $(".fs-recom-float");
    fsSeEnd = $(".fs-se-end");
    fsSeTime = $(".fs-se-time");
    bannerJdText = $(".banner-jd-text");
    backBtn = Array.prototype.slice.call($(".back-decrition a"));
    backBtnOuter = $(".fs-elevator");
    backtop = $(".back-top a");
    fsRecomLazy = $(".fs-recom-lazy");
    quitBtn = $(".quit-btn");
    shopNum = $(".shop-num");
    capUser = $(".cap-user");
}

/*
    animation
    动画模块，屏幕刷新时执行一次
    放置一直执行的任务
*/

function animation() {
    requestAnimationFrame(animation);
    SlideOpa.RunAllSlide();
    LazyLoad.ListenAll();
    tRuntime();
    elevator();
}


/*
    setSeckill
    设置秒杀场的过期时间
*/

function setSeckill() {
    dateOld = new Date();
    dateOld.setHours(dateOld.getHours() + 1);
    dateOld.setMinutes(0);
    dateOld.setSeconds(0);
}

function setHead() {
    let name = token(function (result:any) {
        renderHead(result.detail.value.username);
        renderCar(result.detail.value.username,result.detail.value.password);
    },function () {
        renderHead(null);
    });
}

/*
    runTime
    动态设置秒杀倒计时
*/

function runTime() {
    if (dateOld.getDate() < Date.now()) setSeckill();
    dateNew = new Date();
    fsSeEnd.innerHTML = dateNew.getHours() + ":00";

    let t = dateOld.getTime() - dateNew.getTime();
    let h = parseInt(((t / 1000 / 60 / 60) % 60) + "");
    let m = parseInt(((t / 1000 / 60) % 60) + "");
    let s = parseInt((t / 1000 % 60).toFixed(0) + "");

    fsSeTime.innerHTML = `
        <i class="fs-se-time-hours">${h < 10 ? "0" + h : h}</i>
        <i class="fs-se-time-minute">${m < 10 ? "0" + m : m}</i>
        <i class="fs-se-time-second">${s < 10 ? "0" + s : s}</i>
    `
}

/*
    elevator
    电梯流导航
*/

function elevator() {
    if (!elevatorBool) return;
    let clientTop = document.documentElement.scrollTop;
    if (topnum === clientTop) {
        elevatorBool = false;
        return;
    }
    if (topdecri === "up") {
        if (topnum > clientTop - elevaSpend) {
            document.documentElement.scrollTop = topnum;
            scrollBool = true;
            return;
        }
        document.documentElement.scrollTop -= elevaSpend;
    } else {
        if (topnum < clientTop + elevaSpend) {
            document.documentElement.scrollTop = topnum;
            scrollBool = true;
            return;
        }
        document.documentElement.scrollTop += elevaSpend;
    }
}

/*
    backHandler
    页面位置跳转

*/

function backHandler(e: Event) {
    if (e.currentTarget === backtop) {
        topnum = 0;
    } else {
        let index = backBtn.indexOf(e.target);
        topnum = ($(backTopList[index]) as HTMLElement).offsetTop;
        if (prevele) prevele.className = "";
        prevele = e.target as HTMLElement;
        prevele.className = "active";
    }
    let clientTop = document.documentElement.scrollTop;
    if (topnum === clientTop) return;
    elevaSpend = Math.abs(clientTop - topnum) / 20;
    topdecri = topnum < clientTop ? "up" : "down";
    elevatorBool = true;
    scrollBool = false;
}

function scrollHandler() {
    changeElev();
    showSearch();
    recomFloatShow();
}


var showSearch = function () {
    showSearch = Utils.throttle(function () {
        if (document.documentElement.scrollTop > 700) {
            searchFixed.style.top = 0;
        } else {
            searchFixed.style.top = -searchFixed.offsetHeight + "px";
        }
    }, 400)
}

var recomFloatShow = function () {
    recomFloatShow = Utils.throttle(function () {
        let top = Utils.getAbsDec($(".fs-recom-slide") as HTMLElement);
        if (document.documentElement.scrollTop > top.y) {
            recomFloat.style.top = searchFixed.offsetHeight + "px";
            backBtnOuter.style.top = 140 + "px";
        } else {
            recomFloat.style.top = -recomFloat.offsetHeight + "px";
            backBtnOuter.style.top = 100 + "px";
        }
    }, 400)
}


function renderHead(name:string | null) {
    if (!name) {
        bannerJdText.innerHTML = `
            <h3>Hi~欢迎逛京东！</h3>
            <p>
                <a class="login-btn" href="./login.html">登录</a> |
                <a class="register-btn" href="./register.html">注册</a>
            </p>
        `;
        capUser.innerHTML=`
            <a href="./login.html">你好，请登录</a>
            <a href="./register.html">
                <b>免费注册</b>
            </a>
        `;
    }else{
        bannerJdText.innerHTML = `
            <h3>Hi,${name}</h3>
            <p>
                <span class="iconfont icon-tuichu"></span><a class="quit-btn" href="javascript:void(0)">退出</a>
            </p>
        `;
        capUser.innerHTML=`
            <a href="javascript:void(0);">${name}</a>
            <a href="javascript:void(0);">
                <i>PLUS</i>
            </a>
        `;
        quitBtn = document.querySelector(".quit-btn");
        quitBtn.addEventListener("click", function () {
            Cookie("username", null, {
                path: "/"
            });
            Cookie("password", null, {
                path: "/"
            });
            token(function (result:any) {
                renderHead(result.detail.value.username);
                renderCar(result.detail.value.username,result.detail.value.password);
            },function () {
                renderHead(null);
            });
        });
    }
}

function renderCar (user:string,pass:string) {
    ajax.ajaxSend({
        url: "http://haofusheng.xyz:3000/getcar",
        data: {
            username: user,
            password: pass
        },
        dataType: "json"
    }).then((result:any) => {
        carLen = result.detail.value.length;
        shopNum.forEach((item:any) => {
            item.textContent=carLen;
        })
    })
}


/*
    changeElev 滚动时的电梯导航切换
    throttle 节流
    惰性函数
*/

changeElev = function () {
    changeElev = Utils.throttle(function () {
        if (document.documentElement.scrollTop < ($(backTopList[0]) as HTMLElement).offsetTop) {
            backBtnOuter.style.display = "none";
        } else {
            backBtnOuter.style.display = "block";
        }
        if (!scrollBool) return;
        let elem;
        for (var i = 0; i < backBtn.length; i++) {
            if (document.documentElement.scrollTop >= ($(backTopList[i]) as HTMLElement).offsetTop) {
                elem = backBtn[i];
            }
        }
        if (elem) {
            if (prevele) prevele.className = "";
            prevele = elem;
            prevele.className = "active";
        }
    }, 200);
    changeElev();
}


/*

    getInitData
    懒加载事件，通过ajax通信获取下一次的商品数据

*/


function getInitData() {
    (ajax.ajaxSend({
        dataType: "json",
        url: "http://haofusheng.xyz:3000/getgoods",
        data: {
            page: page
        }
    })).then((data: any) => {
        if (data.type === "error") return;
        let dataList = data.detail.value;
        dataList.data = dataList;
        let htmls = dataList.length > 0 ? dataList.reduce((value: string, item: any) => {
            return value + `
            <li>
                <a href="./detail.html#${item.id}">
                    <div class="recom-goods-img">
                        <img src="${item.imgSrc}">
                    </div>
                    <p>${item.title}</p>
                    <div class="price">
                        <span>
                            <i>￥</i>${item.detail.price.split(".")[0]}.<b>${item.detail.price.split(".")[1]}</b>
                        </span>
                    </div>
                </a>
            </li>
            `
        }, "") : "";
        lazy.addData(htmls);
    })
}



init();