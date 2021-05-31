import fsEventTarget from "../components/fsEventTarget/fsEventTarget.js";
import {fsEventType} from "../InterfaceList/components.js";
import {handerList} from "../handlerType/handlerType.js";
import routerProxy from "../common/routerProxy.js";
import proxy from "../common/proxy.js";
import Utils from "../common/Utils.js";

// 单例、数据存储池


export default class StoreMain extends fsEventTarget{
    private static _instance:StoreMain;
    public sotreData!:{[prop:string]:any};
    constructor () {
        super();
    }
    static get instance () {
        if (!StoreMain._instance) {
            Object.defineProperty(StoreMain,"_instance",{
                value:new StoreMain()
            });
        }
        return StoreMain._instance;
    }
    public createStore(data:Object) {
        this.sotreData = proxy("storemain",data,document.body);
    }
}