import ajax from "../../common/AjaxSend.js";
import Cookie from "../../common/Cookie.js";

let user:HTMLElement,pass:HTMLElement,subBtn:HTMLElement,remePass:any,goRegister:HTMLElement,findPass:HTMLElement;


init ();

function init() {
    setElem();

    subBtn.addEventListener("click",loginHandler);
    goRegister.addEventListener("click",() => location.replace("./register.html"));
    findPass.addEventListener("click",() => location.replace("./register.html"));
}

function setElem () {
    user=$(".login-user") as HTMLElement;
    pass=$(".login-pass") as HTMLElement;
    subBtn=$(".login-box button") as HTMLElement;
    remePass=$(".reme-pass");
    goRegister=$(".go-register") as HTMLElement;
    findPass=$(".findpass") as HTMLElement;
}

function loginHandler (e:Event) {
    ajax.ajaxSend({
        url:"http://haofusheng.xyz:3000/login",
        data:{
            user:(user as any).value,
            pass:(pass as any).value
        },
        dataType:"json"
    }).then((result:any) => {
        if (result.type==="succeed") {
            let value=result.detail.value;
            let _option:any={
                path:"/"
            }
            remePass.checked && (_option["expires"]=7);
            Cookie("username",value.username,_option);
            Cookie("password",value.password,_option);
            window.history.length !==0 ? history.go(-1) : location.href="./index.html";
        }else{
            alert("账号或密码错误");
        }
    })
}