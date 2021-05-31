import Cookie from "./Cookie.js";
import ajax from "./AjaxSend.js";


export default function token (succeed:any,error:any) {
    let username=Cookie("username");
    let password=Cookie("password");
    if (!username || !password) {
        error && error();
    }else{
        tokenSend(username,password,succeed,error);
    }
    return {username:username,password:password};
}

function tokenSend (user:string,pass:string,succeed:any,error:any) {
    ajax.ajaxSend({
        url:"http://haofusheng.xyz:3000/login",
        data:{
            user:user,
            pass:pass
        },
        dataType:"json"
    }).then((result:any) => {
        if (result.type==="error") {
            error && error(result);
        }else{
            succeed && succeed(result);
        }
    })
}