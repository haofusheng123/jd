// 全局持续执行函数观察

export default class Animation {

    private static _instance:Animation;
    private fnList:Array<Function>;
    constructor () {
        this.fnList=[];
        setInterval(() => {
            this.animation();
        },16);
    }

    static get instance () {
        if (!Animation._instance) {
            Object.defineProperty(Animation,"_instance",{
                value:Object.freeze(new Animation())
            })
        }
        return Animation._instance;
    }

    private animation () {
        for (var i=0;i<this.fnList.length;i++) {
            this.fnList[i]();
        }
    }

    public addFn(fn:Function) {
        this.fnList.push(fn);
    }
}