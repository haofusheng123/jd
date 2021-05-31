import Cookie from "../common/Cookie.js";
import AjaxSend from "../common/AjaxSend.js";
import baseUrl from "../work/option.js";

export function getMoreGoods(page:number) {
    return new Promise(async (fulfill:Function,reject:Function) => {
        let result = await AjaxSend.ajaxSend({
            url:baseUrl+"/getgoods",
            data:{
                page:page
            },
            dataType:"json"
        });
        if (result.type==="succeed") fulfill(result.detail.value);
        else reject(result.detail.value);
    }) 
}