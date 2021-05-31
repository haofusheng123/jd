import Utils from "../../common/Utils.js";
import ajax from "../../common/AjaxSend.js";
import LazyLoad from "../../components/LazyLoad/LazyLoad.js";
import {dataList} from "../../store/index.js";
import ZoomGoods from "../../components/ZoomGoods/ZoomGoods.js";
import IconTab from "../../components/ZoomGoods/IconTab.js";
import Counter from "../../components/Counter/Counter.js";
import Search from "../../components/Search/Search.js";
import Cookie from "../../common/Cookie.js";
import token from "../../common/token.js";
import CityList from "../../components/CityList/cityList.js";


let optionInfo:any,data:any,optionSName:any,goodsShow:any,capText:any,cGoodsPrice:any,cGoodsappri:any,siteText:any,textOption:any,goodsLook:any,infoShop:any,shopStar:any,hotGoods:any,newGoods:any,capPrice:any,tabCon:any,rightImg:any,searchBox:any, searchItem: any,lazy:any,layer:any,optionIndex:any,prevElement:any,optionCon:any,counter:any,tabCap:any,capUser:any,carLen:number,shopNum:any[],showCap:any,showCon:any;
let counterCon:any,iBtn:any,dBtn:any,search:any,searchF:any,gocar:Element,pid:number;

init();

function init(){
    getElem();
    getInitData ();
 
    optionIndex=0;

    counter=new Counter({decreaseBtn:dBtn,increaseBtn:iBtn,showItem:counterCon});
    search = new Search({searchBox,searchItem});
    lazy = new LazyLoad(rightImg,(document.querySelector(".info-right-img") as HTMLElement).offsetTop);
    lazy.addEventListener(LazyLoad.LOAD_DATA,loadDataHandler);
    optionCon.addEventListener("click",checkOption);
    gocar.addEventListener("click",addGoods);
    tabCap.addEventListener("click",addGoods);
    new CityList({showCap,showCon});
}

function animation () {
    requestAnimationFrame(animation);
    IconTab.RUN_ICON_MOVE();
    LazyLoad.ListenAll();
}

function getElem(){
    optionInfo=$(".option-info-list");
    optionSName=$(".option-shop-name a");
    goodsShow=$(".c-goods-show");
    counterCon=$(".counter-con");
    iBtn=$(".i-btn");
    dBtn=$(".d-btn");
    capText=$(".c-goods-text > h3");
    cGoodsPrice=$(".g-disc-left b i");
    cGoodsappri=$(".g-disc-right a");
    siteText=$(".site-text a");
    textOption=$(".c-text-option");
    goodsLook=$(".c-goods-look");
    infoShop=$(".d-info-shop h3");
    shopStar=$(".i-shop-star");
    hotGoods=$(".shop-hot-goods");
    newGoods=$(".shop-new-goods");
    capPrice=$(".tab-cap-price");
    tabCon=$(".right-tab-con ul");
    rightImg=$(".info-right-img ul");
    searchBox=$(".nav-search-box");
    searchItem=$(".nav-search-item");
    (gocar as any)=$(".c-gocar");
    optionCon=$(".c-text-option");
    tabCap=$(".right-tab-cap");
    capUser = $(".cap-user");
    showCap = $(".site-city");
    showCon = $(".city-list");
    shopNum=document.querySelectorAll(".shop-num") as any;
}

function checkOption(e:any) {
    if (e.target.nodeName==="UL" || e.target.nodeName==="DIV") return;
    if (prevElement) prevElement.className="";
    prevElement=e.target.nodeName!=="A" ? e.target.parentElement : e.target;
    prevElement.className="active";
    optionIndex=prevElement.getAttribute("option-index")-0;
}

async function addGoods () {
    let user=token(null,function () {
        window.alert("请重新登陆");
        location.href="./login.html";
    });
    let goods={
        pid:pid*100+optionIndex,
        checked:true,
        imgSrc:data.imgSrc,
        title:data.title,
        info:optionCon.querySelectorAll("li a span")[optionIndex].textContent,
        price:data.price,
        num:counter.num,
        sumPrice:data.price*counter.num,
        delete:false,
        like:false,
        username:user.username,
        shop:data.detail.shop.name
    }

    let result = await ajax.ajaxSend({
        url:"http://haofusheng.xyz:3000/savecar",
        dataType:"json",
        data:goods,
        type:"POST"
    });
    alert(result.detail.name);
    token(function (result:any) {
        renderHead(result.detail.value.username);
        renderCar(result.detail.value.username,result.detail.value.password);
    },function () {
        renderHead(null);
    });
}

function renderHead(name:string | null) {
    if (!name) {
        capUser.innerHTML=`
            <a href="javascript:void(0);">你好，请登录</a>
            <a href="javascript:void(0);">
                <b>免费注册</b>
            </a>
        `
    }else{
        capUser.innerHTML=`
            <a href="javascript:void(0);">${name}</a>
            <a href="javascript:void(0);">
                <i>PLUS</i>
            </a>
        `;
    }
}

function loadDataHandler(e:any) {
    if (!data.detail.moreList) return;
    let htmls=`
        ${(function (list) {
            return list.length>0 ? list.reduce((value:string,item:any) => {
                return value+`
                <li>
                    <a href="javascript:void(0)">
                        <img src="${item}">
                    </a>
                </li>
                `
            },"") : "";
        })(data.detail.moreList)}
    `;
    lazy.addData(htmls);
    lazy.removeEventListener(LazyLoad.LOAD_DATA,loadDataHandler);
    lazy=null;
}

function render(data:any) {
    optionInfo.innerHTML+=`
    <li><a href="javascript: void(0)">${data.title}</a></li>
    `;
    optionSName.textContent=data.detail.shop.name;

    let imgList:any=[];
    data.detail.imgList.forEach((item:string) => {
        imgList.push({icon:item,small:item.replace(/\/(n5)\//g,"/n1/"),big:item.replace(/\/(n5)\//g,"/n0/")})
    });
    new ZoomGoods({imgList:imgList,parent:goodsShow,width:350});

    capText.textContent=data.title;
    cGoodsPrice.textContent=data.price;
    cGoodsappri.textContent=data.detail.appraise;
    siteText.textContent=data.detail.shop.name;
    infoShop.textContent=data.detail.shop.name;
    capPrice.textContent=data.detail.appraise;
    textOption.innerHTML=getOptionHtml(data.detail.choose);
    goodsLook.innerHTML=getLookHtml(data.detail.lookList);
    shopStar.innerHTML=getshopStarHtml(data.detail.shop);
    hotGoods.innerHTML=gethotGoodsHtml(data.detail.hotList);
    newGoods.innerHTML=getnewGoodsHtml(data.detail.newList);
    tabCon.innerHTML=getTabConHtml(data.detail.introduce);
    prevElement=optionCon.querySelector("li a");
}

function getOptionHtml(data:{cList:any[],cName:string}) {
    return  `
        <div class="c-text-option-name">${data.cName}</div>
        <div class="c-text-option-content">
            <ul class="clear-float">
                ${((list:any[]) => {
                    return list.length>0 ? list.reduce((value,item,index) => {
                        return value+`
                        <li>
                            <a href="javascript:void(0)" class="${index===0 ? "active" : ""}" option-index="${index}">
                                <img src="${item.img}">
                                <span>${item.info}</span>
                            </a>
                        </li>
                        `
                    },"") : "";
                })(data.cList)}
            </ul>
        </div>
    `;
}

function getLookHtml(data:any[]) {
    return `
        <h3><span>看了又看</span></h3>
        ${(() => {
            return data.length > 0 ?  data.slice(0,3).reduce((value,item) => {
                return value+`
                    <a href="javascript: void(0)" class="goods-look-item">
                        <img src="${item.img}">
                        <p>${item.name}</p>
                        <span>${item.price}</span>
                    </a>
                `
            },"") : "";
        })()}
    `
}

function getshopStarHtml(data:any) {
    return `
        <div class="i-shop-star">
            <p><span>店铺星级</span><i class="tall">${data.star}</i></p>
            ${(function (list) {
                return list.length >0 ? list.reduce((value:string,item:any) => {
                    let className:string;
                    let name:string;
                    if (Number(item.num)>9) {
                        className="tall";
                        name="高";
                    }else if (Number(item.num) >8.5){
                        className="middle";
                        name="中";
                    }else{
                        className="low";
                        name="底";
                    }
                    return value+`
                        <p><span>${item.desc}</span><i class="${className}">${item.num} ${name}</i></p>
                    `
                },"") : "";
            })(data.grade)}
        </div>
        `
}

function gethotGoodsHtml (list:any[]) {
    return `
        ${(function (list) {
           return  list.reduce((value:string,item:any,index:number) => {
            return value+`
                <a href="javascript:void(0)" class="shop-goods-item">
                    <img src="${item.img}">
                    <p><b>${index+1}</b><span>${item.info}</span><strong>${item.price}</strong></p>
                    <i>${item.name}</i>
                </a>
            `
           },"")
        })(list)}
    `
}

function getnewGoodsHtml (list:any[]) {
    return `
        ${(function (list) {
           return  list.reduce((value:string,item:any,index:number) => {
            return value+`
                <a href="javascript:void(0)" class="shop-goods-item">
                    <img src="${item.img}">
                    <p><i>${item.price}</i></p>
                    <i>${item.name}</i>
                </a>
            `
           },"")
        })(list)}
    `
}

function getTabConHtml(list:any[]) {
    return `
        ${(function () {
            return list.length > 0 ? list.reduce((value:string,item:any) => {
                return value+`
                <li>${item}</li>
                `
            },"") : "";
        })()}
    
    `
}

function getRightImgHtml (list:any[]) {
    return `
        ${(function () {
            return list.length>0 ? list.reduce((value:string,item:any) => {
                return value+`
                <li>
                    <a href="javascript:void(0)">
                        <img src="${item}">
                    </a>
                </li>
                `
            },"") : "";
        })()}
    `
}

function getInitData() {
    pid=Number(location.hash.slice(1));
    (ajax.ajaxSend({
        dataType:"json",
        url:"http://haofusheng.xyz:3000/getitem",
        data:{
            pid:pid
        }
    })).then((result:any) => {
        if (result.type==="succeed") {
            data=result.detail.value;
            render(data);
        }else{
            location.href="./error.html#"+data.code;
        }
        animation();
    });


    token(function (result:any) {
        renderHead(result.detail.value.username);
        renderCar(result.detail.value.username,result.detail.value.password);
    },function () {
        renderHead(null);
    });
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