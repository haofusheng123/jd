interface counter {
    decreaseBtn: HTMLElement;
    increaseBtn: HTMLElement;
    showItem: HTMLElement;
    num?: number;
    callback?: (targetItem: any) => void;
}

export default class Counter extends EventTarget implements counter {
    public decreaseBtn!: HTMLElement;
    public increaseBtn!: HTMLElement;
    public showItem!: HTMLElement;
    public callback!: any;
    public startBool:boolean=true;

    public num!: number;
    constructor(option: counter) {
        super();
        this.setInit(option);
        this.setStyle();

        this.num = option.num ? option.num : 1;

        this.decreaseBtn.addEventListener("click", (e) => this.changeNum(e));
        this.increaseBtn.addEventListener("click", (e) => this.changeNum(e));
        this.showItem.addEventListener("input", (e) => this.changeNum(e))
    }
    setInit(option: counter) {
        this.decreaseBtn = option.decreaseBtn;
        this.increaseBtn = option.increaseBtn;
        this.showItem = option.showItem;
        (this.showItem as any).value = this.num;
        this.lazyProxy(this);
        this.callback = option.callback;
    }

    setStyle() {
        this.decreaseBtn.style.userSelect = "none";
        this.increaseBtn.style.userSelect = "none";
    }

    lazyProxy(cout: object) {
        ((num) => {
            Object.defineProperty(this, "num", {
                get() {
                    return num;
                },
                set(value) {
                    num = value;
                    if (value < 1) num = 1;
                    if (num > 99) num = 99;
                    if (this.startBool) {
                        this.startBool=false;
                        this.decreaseBtn.style.color = num === 1 ? "#ccc" : "#333";
                        this.increaseBtn.style.color = num === 99 ? "#ccc" : "#333";
                        (this.showItem as any).value = num;
                        return;
                    }
                    if (this.callback) {
                        this.callback({
                            num: num,
                            target: this.showItem
                        }).then((result: any) => { //等上一级的primise处理完毕最后执行这个方法，修改值和样式
                            this.decreaseBtn.style.color = num === 1 ? "#ccc" : "#333";
                            this.increaseBtn.style.color = num === 99 ? "#ccc" : "#333";
                            (this.showItem as any).value = num;
                        })
                    }else{
                        this.decreaseBtn.style.color = num === 1 ? "#ccc" : "#333";
                        this.increaseBtn.style.color = num === 99 ? "#ccc" : "#333";
                        (this.showItem as any).value = num;
                    }
                }
            })
        })(this.num)

    }

    changeNum(e: any) {
        if (e.target === this.showItem) {
            this.num = e.target.value;
            return;
        }
        e.target === this.increaseBtn ? this.num += 1 : this.num -= 1;
    }
}