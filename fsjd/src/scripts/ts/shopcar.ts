import Cookie from "../../common/Cookie.js";
import ajax from "../../common/AjaxSend.js";
import token from "../../common/token.js";
import Search from "../../components/Search/Search.js";
import Counter from "../../components/Counter/Counter.js";
import CityList from "../../components/CityList/cityList.js";
import proxy from "../../common/proxy.js";
import Utils from "../../common/Utils.js";



let shopdate: any[], capUser: any, search: any, searchBox: any, searchItem: any, shopNum: any, showItem: any, decreaseBtn: any, increaseBtn: any, goodsShow: any, goodsTable: any, proxyShop: any,originData:any,changeBool:boolean,checkItems:any[],checkShops:any[],checkAll:any,checkAllList:any,sumPrice:any,checkNum:any,carSetall:any,sendChecked:(setList:any[],checked:boolean) => void,deleteAllSend:(deleteList:any[]) => void,likeAllSend:() => void,showCap:any,showCon:any;

let counterList: any[] = [];

init();

function init() {
    setElem();
    setDataInit();
    shopdate = [];
    changeBool=true;
    search = new Search({ searchBox, searchItem });
    goodsTable.addEventListener("click", setGoods);
    carSetall.addEventListener("click",setGoodsAll);
    checkAllList = document.querySelectorAll(".check-all");
    checkAllList[1].addEventListener("click",setGoods);
}

function setElem() {
    capUser = $(".cap-user");
    searchBox = $(".nav-search-box");
    searchItem = $(".nav-search-item");
    goodsShow = $(".car-goods table tbody");
    goodsTable = $(".car-goods table");
    sumPrice = $(".sum-price");
    checkNum = $(".check-num");
    carSetall = $(".car-setall");
    showCap = $(".site-city");
    showCon = $(".city-list");
    shopNum = document.querySelectorAll(".shop-num") as any;
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

function setSumPrice() {
    let num=0;
    let price:number=originData.reduce((value:number,item:any) => {
        if (item.checked) {
            value+=item.num*item.price;
            num++;
        }
        return value;
    },0);
    sumPrice.textContent="￥"+price.toFixed(2);
    checkNum.textContent=num;
}

function changeCity (e:any) {

}

function setDataInit() {
    token(function (result: any) {
        renderHead(result.detail.value.username);
        ajax.ajaxSend({
            url: "http://haofusheng.xyz:3000/getcar",
            data: {
                username: result.detail.value.username,
                password: result.detail.value.password
            },
            dataType: "json"
        }).then((result: any) => {
            if (result.type === "succeed") {
                originData=result.detail.value;
                shopdate = setShopData(originData);
                renderCar(shopdate);
                renderElem();
                renderCity();
            } else {
                alert(result.detail.name);
                location.href = "./login.html";
            }
        })
    }, function (result:any) {
        window.alert("请重新登陆");
        location.href = "./login.html";
    });
}

function setShopData(_originData:any[]) {
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

function changeNum(targetItem: any) {
    let user = token(null, function () {
        alert("令牌失效");
        location.href = "./login.html"
    });
    let pid = Number(targetItem.target.getAttribute("count-id"));
    let item=originData.filter((item:any) => item.pid==pid)[0];
    let num = targetItem.num;
    return ajax.ajaxSend({
        url: "http://haofusheng.xyz:3000/changegoods",
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
            ($(`.goods-sum-price[count-id="${pid}"] p span`) as HTMLElement).textContent=item.sumPrice;
            setSumPrice();
        }else {
            window.alert("请重新登陆");
            location.href = "./login.html";
        }
    }));
}

function renderHead(name: string | null) {
    if (!name) {
        capUser.innerHTML = `
            <a href="javascript:void(0);">你好，请登录</a>
            <a href="javascript:void(0);">
                <b>免费注册</b>
            </a>
        `
    } else {
        capUser.innerHTML = `
            <a href="javascript:void(0);">${name}</a>
            <a href="javascript:void(0);">
                <i>PLUS</i>
            </a>
        `;
    }
}


/*
    setGoods
    集中分配函数
    事件委托要进行一些有冲突的事件处理时，可以调用几个函数来进行分别处理
*/


function setGoods(e: Event) {
    setCheckBtn(e);
    deleteHandler(e);
}


/*
    setGoodsAll 操作多个商品数据
*/


function setGoodsAll (e:any) {
    switch (e.target.className) {
        case "delete-all":
            let deleteList = originData.reduce((value:any[],item:any) => {
                if (item.checked) value.push(item.pid);
                return value;
            },[]);
            originData=originData.filter((item:any) => !item.checked);
            shopdate = setShopData(originData);
            deleteAllSend(deleteList);
            break;
        case "like-all":
            likeAllSend();
            let likeList = originData.reduce((value:any[],item:any) => {
                if (item.checked) value.push(item.pid);
                return value;
            },[]);
            likeList.forEach((pid:any) => {
                ($(`[like-id="${pid}"]`) as HTMLElement).textContent="移出关注";
            })
            break;
        case "clear-car":
            let bool=confirm("确定要清空购物车吗?");
            if (bool) {
                let deleteList = originData.reduce((value:any[],item:any) => {
                    value.push(item.pid);
                    return value;
                },[]);
                shopdate = [];
                originData=[];
                deleteAllSend(deleteList);
            }
            break;
    }
}


deleteAllSend = Utils.throttle(function (deleteList:any) {
    renderCar(shopdate);
    setSumPrice();
    let user=token(null,function (result:any) {
        alert(result.detail.name);
        location.href="./login.html";
    });
    ajax.ajaxSend({
        url:"http://haofusheng.xyz:3000/deletemany",
        data:{
            pidList:deleteList,
            username:user.username,
            password:user.password
        },
        dataType:"json",
        type:"POST"
    }).then((result:any) => {
        if (result.type!=="succeed") {
            alert(result.detail.name);
            location.href="./login.html";
        }
    });
},400);

likeAllSend = Utils.throttle(function () {
    let likeList = originData.reduce((value:any[],item:any) => {
        if (item.checked) value.push(item.pid);
        return value;
    },[]);
    let user=token(null,function (result:any) {
        alert(result.detail.name);
        location.href="./login.html";
    });
    ajax.ajaxSend({
        url:"http://haofusheng.xyz:3000/likemany",
        data:{
            pidList:likeList,
            username:user.username,
            password:user.password
        },
        dataType:"json",
        type:"POST"
    }).then((result:any) => {
        if (result.type!=="succeed") {
            alert(result.detail.name);
            location.href="./login.html";
        }
    });
},400);

/*
    点击复选框
    根据点击的复选框不同，选择或者取消某些商品
    使用两个全局的数组，一个是获取的源购物车数组 originData
    一个是处理后的店铺分组数组 shopdate
    这两个数组的数据具有链接关系
*/

function setCheckBtn(e: any) {
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
                originData[index].checked=checked;
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
            ($(`[info-index="${pid}"]`) as HTMLElement).style.backgroundColor=checked ? "#fef4e8" : "#fff";
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
        ($(`[shop-index="${index}"]`) as any).checked=bool;
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
            url:"http://haofusheng.xyz:3000/checkmany",
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

/*
    deleteGoods 删除商品

*/

function deleteGoods(pid:number) {
    let user=token(null,function (result:any) {
        alert(result.detail.name);
        location.href="./login.html";
    })
    ajax.ajaxSend({
        url:"http://haofusheng.xyz:3000/deletegoods",
        data:{
            username:user.username,
            password:user.password,
            pid:pid
        },
        dataType:"json",
        type:"POST"
    }).then((result:any) => {
        if (result.type==="succeed") {
            ($(`[info-index="${pid}"]`) as any).remove();
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
        url:"http://haofusheng.xyz:3000/likegoods",
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

function renderElem () {
    checkItems = $(".check-item") as any;
    checkShops = $(".check-shop") as any;
    checkAll = $(".check-all") as any;
}

function renderCity () {
    new CityList({showCap,showCon});
}

/*
    renderCar 渲染商品
*/

function renderCar(shopcar: any) {
    console.log(shopcar);
    let bool=true;
    if (originData.length>0) {
        ($(".car-goods") as HTMLElement).style.display="block";
        ($(".car-empty") as HTMLElement).style.display="none";
        originData.forEach((item:any) =>  bool && (bool=item.checked))
    }else{
        ($(".car-empty") as HTMLElement).style.display="block";
        ($(".car-goods") as HTMLElement).style.display="none";
        bool=false;
        return;
    }
    document.querySelectorAll(".check-all").forEach((item:any) => {
        item.checked=bool;
    });
    shopNum.forEach((item: any) => {
        item.textContent = originData.length;
    });
    if (Object.keys(shopcar).length === 0) {
        goodsShow.innerHTML = "";
        return;
    };
    ($("#check-all") as any).checked = originData.every((item:any) => item.checked);
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
                                <tr info-index="${itemG.pid}" shop-info=${index} class="goods-info ${itemG.checked ? "active" : ""}">
                                <td class="goods-check">
                                    <div>
                                        <input type="checkbox" ${itemG.checked ? "checked" : ""} class="check-item" check-type="check-item" get-shop=${index} goods-id="${itemG.pid}">
                                    </div>
                                </td>
                                <td>
                                    <a href="javascript:void(0)">
                                        <img class="goods-img" src="${itemG.imgSrc}">
                                    </a>
                                </td>
                                <td class="goods-i-title"><div>
                                    <a href="javascript:void(0)">${itemG.title}</a>
                                </div></td>
                                <td class="goods-i-info"><p>${itemG.info}</p></td>
                                <td class="goods-price"><p>￥<span>${itemG.price}</span></p></td>
                                <td class="goods-num">
                                    <div class="goods-counter clear-float">
                                        <span class="goods-counter-de">-</span>
                                        <input class="goods-counter-item" count-id=${itemG.pid} start-index="${itemG.num}" type="text">
                                        <span class="goods-counter-in">+</span>
                                    </div>
                                </td>
                                <td class="goods-sum-price" count-id=${itemG.pid}>
                                    <p>¥<span>${itemG.sumPrice}</span></p>
                                </td>
                                <td class="goods-delete">
                                    <div>
                                        <p><a href="javascript:void(0)" btn-type="delete" delete-id="${itemG.pid}">删除</a></p>
                                        <p><a href="javascript:void(0)" btn-type="like" like-id="${itemG.pid}">${itemG.like ? "移出关注" : "关注"}</a></p>
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
}