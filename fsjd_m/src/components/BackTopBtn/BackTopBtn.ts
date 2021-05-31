import SetHandler from "../../components/SetHandler/SetHandler.js";
import { handerList } from "../../handlerType/handlerType.js";
import FsEvent from "../fsEvent/fsEvent.js";

class BackTopBtn{
    public elem!:HTMLDivElement;
    constructor () {

    }

    private goTop() {
        let evt = new FsEvent(handerList.GO_TOP);
        evt.elem = this.elem;
        SetHandler.instance.dispatchEvent(evt);
    }
}