import StoreMain from "../../store/s-main.js";
import {login ,register,getGoods } from "../../network/work/mine.js";
import cookie from "../../network/common/Cookie.js";
import SetHandler from "../../components/SetHandler/SetHandler.js";
import { handerList } from "../../handlerType/handlerType.js";
import FsEvent from "../../components/fsEvent/fsEvent.js";
import Utils from "../../common/Utils.js";



let user:HTMLInputElement,pass:HTMLInputElement,tCode:HTMLInputElement,subBtn:HTMLButtonElement,userLoginOuter:HTMLDivElement;
let ruser:HTMLInputElement,rpass:HTMLInputElement,repass:HTMLInputElement,rsubBtn:HTMLButtonElement,userRegisterOuter:HTMLDivElement;

function init(){
    getItem();
    setEvent();
}

function getItem (){
    user=document.querySelector("#cname") as HTMLInputElement;
    pass=document.querySelector("#cemail") as HTMLInputElement;
    tCode=document.querySelector("#t-code") as HTMLInputElement;
    subBtn=document.querySelector("#sub-btn") as HTMLButtonElement;
    userLoginOuter=document.querySelector(".s-mine-login") as HTMLDivElement;


    ruser=document.querySelector("#rname") as HTMLInputElement;
    rpass=document.querySelector("#rpass") as HTMLInputElement;
    repass=document.querySelector("#repass") as HTMLInputElement;
    rsubBtn=document.querySelector("#r-sub-btn") as HTMLButtonElement;
    userRegisterOuter=document.querySelector(".s-mine-register") as HTMLDivElement;
}

function setEvent(){
    userLoginOuter.addEventListener("input",dugerBtn);
    userRegisterOuter.addEventListener("input",dugerRegiBtn);
    rsubBtn.addEventListener("click",rigesterHandler);
    subBtn.addEventListener("click",loginHandler);

    SetHandler.instance.addEventListener(handerList.Mine_CHANGE_TAB,changeTab);
}

function changeTab(e?:FsEvent) {
    let tabList:NodeList = (document.querySelectorAll(`[mine-tab]`) as NodeList);
    tabList.forEach((item:Node) => {
        (item as HTMLDivElement).style.display="none";
    });

    (document.querySelector(`[mine-tab='${(e as FsEvent).mineTab}']`) as HTMLDivElement).style.display="block";

}

async function loginHandler() {
    if (user.value.length<5 || pass.value.length<5) {
        alert("账号或者密码不能小于五位");
        return;
    }
    if (tCode.value.length!==4) {
        alert("验证码位数不正确");
        return;
    }
    let result =await login({
        username:user.value,
        password:pass.value
    });
    if (result.type==="error") {
        alert("账号或密码错误");
    }else{
        cookie("username",result.detail.value.username);
        cookie("password",result.detail.value.password);
        alert("登陆成功");
        let goodResult = await getCarList();
        if (goodResult.type="succeed") {
            StoreMain.instance.sotreData.shopcar=goodResult.detail.value;
            StoreMain.instance.sotreData.shop_num=StoreMain.instance.sotreData.shopcar.length;

            let evt:FsEvent = new FsEvent(handerList.RENDER_CAR);
            SetHandler.instance.dispatchEvent(evt);
            console.log("你登录了，要渲染了");
        }
        location.href="http://localhost:8080/dist/#mine/mymine";
    }
}

async function getCarList () {
    return await getGoods({
        username:cookie("username") as string,
        password:cookie("password") as string
    });
}

async function rigesterHandler () {
    if (ruser.value.length<5 || rpass.value.length<5) {
        alert("账号或者密码不能小于五位");
        return;
    }
    if (rpass.value !== repass.value) {
        alert("两次输入的密码不同");
        return;
    }
    let result =await register({
        username:ruser.value,
        password:rpass.value
    });
    if (result.type==="error") {
        alert(result.detail.name);
    }else{
        alert("注册成功");
        ruser.value="";
        rpass.value="";
        location.href="http://localhost:8080/dist/#mine/login";
        (document.querySelector(".s-m-head-center") as HTMLDivElement).textContent="我的主页";
    }
}

function dugerBtn(){
    if (user.value.length<5 || pass.value.length<5) {
        subBtn.disabled=true;
        Utils.setClassName(subBtn,"disa");
        return;
    }
    if (tCode.value.length!==4) {
        subBtn.disabled=true;
        Utils.setClassName(subBtn,"disa");
        return;
    }
    subBtn.disabled=false;

    Utils.setClassName(subBtn,"disa",true);
}

function dugerRegiBtn (){
    if (ruser.value.length<5 || rpass.value.length<5) {
        rsubBtn.disabled=true;
        Utils.setClassName(rsubBtn,"disa");
        return;
    }
    rsubBtn.disabled=false;

    Utils.setClassName(rsubBtn,"disa",true);
}



export default init;