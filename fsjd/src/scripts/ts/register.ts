import ajax from "../../common/AjaxSend.js";
import Cookie from "../../common/Cookie.js";
let user:HTMLElement,pass:HTMLElement,subBtn:HTMLElement,remePass:any;


init ();

function init() {
    setElem();
    console.log(subBtn);
    subBtn.addEventListener("click",loginHandler);
}

function setElem () {
    user=$(".re-user") as HTMLElement;
    pass=$(".re-pass") as HTMLElement;
    subBtn=$(".rige-con button") as HTMLElement;
}

function loginHandler (e:Event) {
    ajax.ajaxSend({
        url:"http://haofusheng.xyz:3000/register",
        data:{
            user:(user as any).value,
            pass:(pass as any).value
        },
        dataType:"json"
    }).then((result:any) => {
        if (result.type==="succeed") {
            alert("注册成功");
            location.replace("./login.html");
        }else{
            alert(result.detail.name);
        }
    })
}