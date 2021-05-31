import SotreMain from "../../store/s-main.js";
import lazyLoad from "../../components/LazyLoad/LazyLoad.js";
import Animation from "../../components/Animation/Animation.js";
import {getMoreGoods} from "../../network/work/home.js";
import {goodsType} from "../../InterfaceList/network.js";
import Cookie from "../../network/common/Cookie.js";

let moreGoods:HTMLUListElement,sHome:HTMLDivElement,lazyItem:lazyLoad,page:number;
function init() {
    setInitData();
    getItem();
    lazyItem = new lazyLoad(moreGoods,sHome);
    Animation.instance.addFn(lazyLoad.ListenAll);
    lazyItem.addEventListener(lazyLoad.LOAD_DATA,loadDMoreata);
    moreGoods.addEventListener("click",changeDetail);
}


function setInitData() {
    page=0;
}

function getItem() {
    moreGoods=document.querySelector(".s-more-goods ul") as HTMLUListElement;
    sHome=document.querySelector(".s-home") as HTMLDivElement;
}

function changeDetail(e:Event) {
    let pid = (e.target as HTMLElement).parentElement?.getAttribute("g-pid");
    SotreMain.instance.sotreData.detailId=pid;
    Cookie("fspid",pid,{path:"/"});
}

async function loadDMoreata (e:Event) {
    let list:Array<goodsType> = await getMoreGoods(page) as Array<goodsType>;
    page++;
    if (!Array.isArray(list) || list.length===0) return;
    let str=`
        ${(function (list:Array<goodsType>) {
            return list.reduce((value:string,item:goodsType) => {
                return value + `
                    <li style="height: 21rem;">
                        <a href="#detail" g-pid="${item.id}">
                            <img src="${item.imgSrc}">
                            <p>${item.title}</p>
                            <div class="flex-box" g-pid="${item.id}">
                                <p g-pid="${item.id}"><b>￥</b><i>${item.price}</i></p>
                                <span>看相似</span>
                            </div>
                        </a>
                    </li>
                `
            },"")
        })(list)}
    `;
    lazyItem.addData(str);
}

export default init;