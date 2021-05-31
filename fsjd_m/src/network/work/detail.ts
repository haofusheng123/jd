import Cookie from "../common/Cookie.js";
import AjaxSend from "../common/AjaxSend.js";
import baseUrl from "../work/option.js";
import {goodsType,carType,sendType} from "../../InterfaceList/network.js";
import cookie from "../../common/Cookie.js";
import StoreMain from "../../store/s-main.js";
import {login ,register,getGoods } from "../../network/work/mine.js";

export function getDetail(pid:number) {
    return new Promise(async (fulfill:Function,reject:Function) => {
        let result = await AjaxSend.ajaxSend({
            url:baseUrl+"/getitem",
            data:{
                pid:pid
            },
            dataType:"json"
        });
        if (result.type==="succeed") fulfill(result.detail.value);
        else reject(result.detail.value);
    }) 
};

export async function addGoods (detailData:goodsType) {
    let goods:carType = {
        pid:detailData.id,
        shop:detailData.detail.shop.name,
        checked:true,
        title:detailData.title,
        price:detailData.price,
        num:1,
        info:detailData.detail.choose.cList[0].info,
        imgSrc:detailData.detail.choose.cList[0].img,
        sumPrice:detailData.price,
        delete:false,
        like:false,
        username:cookie("username") as string,
        password:cookie("password") as string
    };

    let result:sendType = await AjaxSend.ajaxSend({
        url:baseUrl+"/savecar",
        dataType:"json",
        data:goods,
        type:"POST"
    });

    console.log(result);

    if (result.type==="error") {
        alert("请登录");
        location.href="http://localhost:8080/dist/#mine/login"
    }else {
        alert("添加商品成功");

        let goodResult = await getGoods({
            username:cookie("username") as string,
            password:cookie("password") as string
        });
        if (goodResult.type="succeed") {
            StoreMain.instance.sotreData.shopcar=goodResult.detail.value;
            StoreMain.instance.sotreData.shop_num=StoreMain.instance.sotreData.shopcar.length;
        }
    }
}