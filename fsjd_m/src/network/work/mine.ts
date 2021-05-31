import Cookie from "../common/Cookie.js";
import AjaxSend from "../common/AjaxSend.js";
import baseUrl from "../work/option.js";
import {goodsType,carType,sendType} from "../../InterfaceList/network.js";


export async function login (users:{username:String,password:String}) {
    let result:sendType = await AjaxSend.ajaxSend({
        url:baseUrl+"/login",
        dataType:"json",
        data:{
            user:users.username,
            pass:users.password
        }
    });
    return result;
}

export async function register (users:{username:String,password:String}) {
    let result:sendType = await AjaxSend.ajaxSend({
        url:baseUrl+"/register",
        dataType:"json",
        data:{
            user:users.username,
            pass:users.password
        }
    });
    return result;
}

export async function getGoods (users:{username:String,password:String}) {
    let result:sendType = await AjaxSend.ajaxSend({
        url:baseUrl+"/getcar",
        dataType:"json",
        data:{
            username:users.username,
            password:users.password
        }
    });
    return result;
}