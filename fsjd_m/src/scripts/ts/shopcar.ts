import StoreMain from "../../store/s-main.js";
import { getDetail, addGoods } from "../../network/work/detail.js";
import cookie from "../../network/common/Cookie.js";
import SlideOpa from "../../components/SlideOpa/slide-outer.js";
import SetHandler from "../../components/SetHandler/SetHandler.js";
import { handerList } from "../../handlerType/handlerType.js";
import FsEvent from "../../components/fsEvent/fsEvent.js";
import Utils from "../../common/Utils.js";
import Animation from "../../components/Animation/Animation.js";
import { goodsType, carType, sendType } from "../../InterfaceList/network.js";
import AjaxSend from "../../network/common/AjaxSend.js";
import { login, register, getGoods } from "../../network/work/mine.js";
import Counter from "../../components/Counter/Counter.js";
import token from "../../common/token.js";
import ajax from "../../common/AjaxSend.js";


let goodsOuter: HTMLUListElement, originData: Array<goodsType>, shopdate: any[], shopNum: any, goodsShow: HTMLDivElement,decreaseBtn: any, increaseBtn: any,showItem: any,checkNum:any,checkAll:any,checkItems:any,checkShops:any,sendChecked:(setList:any[],checked:boolean) => void,goodsTable:any,checkAllList:any;
let counterList: any[] = [];


//  时间太赶 ， 只能any大法


function init() {
    console.log(StoreMain.instance.sotreData.shopcar)
    console.log("进入购物车");
    getItem();
    setInit();
    setEvent();
}

function getItem() {
    goodsShow = document.querySelector(".s-s-con table") as HTMLDivElement;
    goodsTable=document.querySelector(".s-s-con table")
    checkNum = document.querySelector(".check-num");
    checkAllList = document.querySelector(".check-all");
    checkAllList.addEventListener("click",setGoods);
    shopNum = [];

}

function setInit() {

    getShopcar();
}

function setEvent () {
    SetHandler.instance.addEventListener(handerList.RENDER_CAR,renderCarHandler);
    goodsTable.addEventListener("click", setGoods);
}

function renderCarHandler (e?:FsEvent) {
    // renderCar(StoreMain.instance.sotreData.shopcar);
    getShopcar();
}

async function getShopcar() {
    let goodResult = await getGoods({
        username: cookie("username") as string,
        password: cookie("password") as string
    });
    if (goodResult.type = "succeed") {
        StoreMain.instance.sotreData.shopcar = goodResult.detail.value;
        StoreMain.instance.sotreData.shop_num = StoreMain.instance.sotreData.shopcar.length;
    }

    originData = goodResult.detail.value;
    shopdate = setShopData(originData);

    renderCar(shopdate);
}

function setShopData(_originData: any[]) {
    return _originData.length > 0 ? _originData.reduce((value: any, item: any) => {
        let shopItem = value.filter((_item: any) => {
            return _item.name === item.shop;
        })[0];
        if (shopItem) {
            shopItem.list.push(item);
        } else {
            value.push({ name: item.shop, list: [item] });
        }
        return value;
    }, []) : [];
}


function setCounter() {
    decreaseBtn = document.querySelectorAll(".goods-counter-de") as any;
    increaseBtn = document.querySelectorAll(".goods-counter-in") as any;
    showItem = document.querySelectorAll(".goods-counter-item") as any;
    showItem.forEach((item: any, index: number) => {
        let counter = new Counter({ decreaseBtn: decreaseBtn[index], increaseBtn: increaseBtn[index], showItem: showItem[index], num: Number(showItem[index].getAttribute("start-index")), callback: changeNum });
        showItem[index].removeAttribute("start-index")
        counterList.push(counter);
    });
}

function changeNum(targetItem: any) {
    let user = token(null, function () {
        alert("令牌失效");
        location.href = "./login.html"
    });
    let pid = Number(targetItem.target.getAttribute("count-id"));
    let item:any=originData.filter((item:any) => item.pid==pid)[0];
    let num = targetItem.num;
    return ajax.ajaxSend({
        url: "http://localhost:3000/changegoods",
        data: {
            username: user.username,
            password: user.password,
            pid: pid,
            num: num,
            sumPrice: Number(item.price*num).toFixed(2)
        },
        dataType: "json",
        type: "POST"
    }).then(((result:any) => {
        if (result.type==="succeed") {
            item.sumPrice=(item.price*num as number).toFixed(2);
            item.num=num;
            setSumPrice();
        }else {
            window.alert("请重新登陆");
            location.href = "./login.html";
        }
    }));
}


function setSumPrice() {
    let num=0;
    let price:number=originData.reduce((value:number,item:any) => {
        if (item.checked) {
            value+=item.num*item.price;
            num++;
        }
        return value;
    },0);
    // checkNum.textContent=num;
}



function setGoods(e: Event) {
    setCheckBtn(e);
    deleteHandler(e);
}

function deleteHandler(e: any) {
    if (e.target.nodeName!=="A") return;
    switch (e.target.getAttribute("btn-type")) {
        case "delete":
            let pid:number=e.target.getAttribute("delete-id")-0;
            deleteGoods(pid);
            break;
        case "like":
            let pidL:number=e.target.getAttribute("like-id")-0;
            likeGoods(pidL,e.target.textContent==="移出关注",e.target);
            break;
    }
}

function deleteGoods(pid:number) {
    let user=token(null,function (result:any) {
        alert(result.detail.name);
        location.href="./login.html";
    })
    ajax.ajaxSend({
        url:"http://localhost:3000/deletegoods",
        data:{
            username:user.username,
            password:user.password,
            pid:pid
        },
        dataType:"json",
        type:"POST"
    }).then((result:any) => {
        if (result.type==="succeed") {
            (document.querySelector(`[info-index="${pid}"]`) as any).remove();
            originData = originData.filter((item:any) => {
                return item.pid!==pid;
            });
            shopdate = setShopData(originData);
            renderCar(shopdate);
        }else{

        }
    })
}


function likeGoods(pid:number,bool:boolean,elem:HTMLElement) {
    let user=token(null,function (result:any) {
        alert(result.detail.name);
        location.href="./login.html";
    });
    ajax.ajaxSend({
        url:"http://localhost:3000/likegoods",
        data:{
            username:user.username,
            password:user.password,
            pid:pid,
            like:!bool
        },
        dataType:"json",
        type:"POST"
    }).then((result:any) => {
        if (result.type==="succeed") {
            originData.forEach((item:any) => item.pid===pid && (item.like=!bool));
            elem.textContent=!bool ? "移出关注" : "关注";
        }else{

        }
    });
}





function setCheckBtn(e: any) {
    console.log(checkAll);
    if (e.target.nodeName !== "INPUT" || e.target.type !== "checkbox") return;
    let checked=e.target.checked;
    let setList:any[]=[];
    switch (e.target.getAttribute("check-type")) {
        case "check-all":
            let info=document.querySelectorAll(".goods-info");
            document.querySelectorAll(".check-item").forEach((item:any,index:number) => {
                if (item.checked !==checked)  {
                    setList.push(item.getAttribute("goods-id")-0);
                    item.checked=checked;
                    (info[index] as HTMLElement).style.backgroundColor=checked ? "#fef4e8" : "#fff";
                }
                (originData[index] as any).checked=checked;
            });
            checkAll.forEach((item:any) => {
                item.checked=checked;
            });
            break;
        case "check-shop":
            let index=e.target.getAttribute("shop-index");
            shopdate[index].list.forEach((item:any) => {
                setList.push(item.pid);
                item.checked=checked;
            });
            let infoS=(document.querySelectorAll(`[shop-info="${index}"]`) as any);
            (document.querySelectorAll(`[get-shop="${index}"]`) as any).forEach((item:any,index:number) => {
                item.checked=checked;
                infoS[index].style.backgroundColor=checked ? "#fef4e8" : "#fff";
            });

            checkAll.forEach((item:any) => {
                item.checked = originData.every((item:any) => item.checked);
            })
            break;
        case "check-item":
            let pid=e.target.getAttribute("goods-id");
            setList.push(Number(pid));
            (document.querySelector(`[info-index="${pid}"]`) as HTMLElement).style.backgroundColor=checked ? "#fef4e8" : "#fff";
            let bool=true;
            originData.forEach((item:any) => {
                if (item.pid==pid) item.checked=checked;
                bool && (bool=item.checked);
            });
            checkAll.forEach((item:any) => {
                item.checked=bool;
            });
            break;
    }
    shopdate.forEach((item:any,index:number) => {
        let bool=item.list.every((item:any) => item.checked);
        (document.querySelector(`[shop-index="${index}"]`) as any).checked=bool;
    });
    setSumPrice();
    sendChecked(setList,checked);
}

sendChecked = function (pidList:any,checked:boolean) {
    sendChecked=Utils.throttle((pidList:any[],checked:boolean) => {
        let user=token(null,function (result:any) {
            alert(result.detail.name);
            location.href="./login.html";
        });
        ajax.ajaxSend({
            url:"http://localhost:3000/checkmany",
            data:{
                username:user.username,
                password:user.password,
                pidList:pidList,
                checked:checked
            },
            dataType:"json",
            type:"POST"
        }).then((result:any) => {
            switch (result.code) {
                case 405:
                    alert("令牌失效，请重新登陆");
                    location.href="./index.html";
                    break;
                case 408:
                    alert("操作失败");
                    break;
                case 207:
                    break;
            }
        })
    },400);
    sendChecked(pidList,checked);
}

function renderElem () {
    checkItems = document.querySelectorAll(".check-item") as any;
    checkShops = document.querySelectorAll(".check-shop") as any;
    checkAll = document.querySelectorAll(".check-all") as any;
}


function renderCar(shopcar: any) {
    let bool = true;
    // if (originData.length>0) {
    //     ($(".car-goods") as HTMLElement).style.display="block";
    //     ($(".car-empty") as HTMLElement).style.display="none";
    //     originData.forEach((item:any) =>  bool && (bool=item.checked))
    // }else{
    //     ($(".car-empty") as HTMLElement).style.display="block";
    //     ($(".car-goods") as HTMLElement).style.display="none";
    //     bool=false;
    //     return;
    // }
    document.querySelectorAll(".check-all").forEach((item: any) => {
        item.checked = bool;
    });
    shopNum.forEach((item: any) => {
        item.textContent = originData.length;
    });
    if (Object.keys(shopcar).length === 0) {
        goodsShow.innerHTML = "";
        return;
    };
    goodsShow.innerHTML = `
        ${(function (list: any) {
            return list.reduce((value: string, item: any, index: number) => {
                return value + `
                    <tr class="goods-shop">
                        <td>
                            <input type="checkbox" shop-index=${index} ${(function (list: any[]) {
                        return list.every((item: any) => {
                            return item.checked;
                        }) ? "checked" : "";
                    })(item.list)} class="check-shop" check-type="check-shop">
                        </td>
                        <td colspan="7"><a href="javascript:void(0)">${item.name}</a><a href="javascript:void(0)"><span class="iconfont icon-huaban28"></span></a></td>
                    </tr>
                    ${(function (goodsList: any[]) {
                        return goodsList.reduce((valueG: string, itemG: any, indexG: number) => {
                            return valueG + `
                                <tr info-index="${itemG.pid}" shop-info=${index} class="goods-info ${itemG.checked ? "active" : ""}" style="${itemG.checked ? "background-color: rgb(254, 244, 232);" : ""}">
                                <td class="goods-check">
                                    <div>
                                        <input type="checkbox" ${itemG.checked ? "checked" : ""} class="check-item" check-type="check-item" get-shop=${index} goods-id="${itemG.pid}">
                                    </div>
                                </td>
                                <td class="goods-img">
                                    <a href="javascript:void(0)">
                                        <img class="goods-img" src="${itemG.imgSrc}">
                                    </a>
                                </td>
                                <td class="goods-i-info"><div>
                                    <a href="javascript:void(0)" class="giids-i-title">${itemG.title}</a>
                                    <p class="giids-i-info">${itemG.info}</p>
                                    <div class="flex-box">
                                        <p class="giids-i-price">￥<span>${itemG.price}</span></p>
                                        <div class="goods-counter clear-float">
                                            <span class="goods-counter-de">-</span>
                                            <input class="goods-counter-item" count-id=${itemG.pid} start-index="${itemG.num}" type="text">
                                            <span class="goods-counter-in">+</span>
                                        </div>
                                    </div>
                                    <div class="flex-box">
                                        <p><a href="javascript:void(0)" btn-type="delete" delete-id="${itemG.pid}">删除</a>&emsp;</p>
                                        <p><a href="javascript:void(0)" btn-type="like" like-id="${itemG.pid}">${itemG.like ? "移出关注" : "关注"}</a></p>
                                    </div>
                                </div>
                                </td>
                            </tr>
                            `
                        }, "")
                    })(item.list)}
                `
            }, "");
        })(shopcar)}
    `;
    setCounter();
    setSumPrice();
    renderElem();
}


export default init;