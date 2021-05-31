import fsEventTarget from "../../components/fsEventTarget/fsEventTarget.js";
import {fsEventType} from "../../InterfaceList/components.js";
import {handerList} from "../../handlerType/handlerType.js";
import routerProxy from "../../common/routerProxy.js";
import proxy from "../../common/proxy.js";

//单例 观察者 中介者

export default class RouterSet extends fsEventTarget{  //继承自定义的事件对象类
    private static _instance:RouterSet;
    private routerList!:{path:string};
    constructor () {
        super();
        this.ceateRouteProxy();  // 使用代理创建路由改变后的界面切换

        //当外部通过操作改变路由要通过观察者切换路由界面，这样减少耦合，所有的界面切换要通过这个单例操作他内部的私有方法来控制

        this.addEventListener(handerList.ROUTER_CHANGE, (e?:fsEventType) => this.routerChange(e)); 
    }
    static get instance () {

        // 单例不能修改尽可能的保护  // get方法拦截直接获取_instance静态属性操作  // Object.defineProperty保护对象_instance属性不能修改， frazz冻结整个对象

        if (!RouterSet._instance) {
            Object.defineProperty(RouterSet,"_instance",{
                value:Object.freeze(new RouterSet())
            });
        }
        return RouterSet._instance;
    }
    private routerChange(e?:fsEventType) {
        this.routerList.path=(e as fsEventType).router;
    }
    private ceateRouteProxy() {
        this.routerList=routerProxy("routerList",{path:""},document.body);
        this.routerList.path=location.hash.slice(1);
    }
}

RouterSet.instance;