export default (function (win) {
    return {
        ce(type:keyof HTMLElementTagNameMap|null|undefined,styles?:object,data?:any,parent?:HTMLElement) {
            if (!type) return null;
            let ce:any=document.createElement(type);
            Object.assign(ce.style,styles);
            for (let prop in data) {
                ce[prop]=data[prop];
            }
            
            if (parent) parent.appendChild(ce);
            return ce;
        },

        /*
            throttle 节流
            参数: fn => 节流执行函数 ; space => 间隔事件 ; args => 预处理参数
            返回值: 闭包函数
        */

        throttle(fn:Function,space:number=400,end:boolean=true,...args:any[]){ //节流
            let ids:any;
            let oldTime:number=0;
            return function (...arg:any[]) {
                var newTime=new Date().getTime();
                if (oldTime<newTime) {
                    fn(...args.concat(arg));
                    oldTime=newTime+space;
                }else{
                    if (!end) return;
                    clearTimeout(ids);
                    ids=setTimeout(() => {
                        clearTimeout(ids);
                        fn(...args.concat(arg));
                    },space);
                }
            }
        },

        /*
            setStyle 添加css格式样式
            参数: str => css文本 
        */

        setStyle(str:string) {
            if (document.styleSheets.length===0) {
                let styleBox=document.createElement("style");
            }
            let styleItem=document.styleSheets[document.styleSheets.length-1];
            str=str.replace(/\n/g,"").replace(/(.*?)\{(.*?)\}/g,function (item,name,value) {
                styleItem.addRule(name,value);
                return item
            })
        },

        /*
            获取元素距离最上层的距离，
            上层的若干定位父元素可以进行距离累加
            参数 : elem => 需要计算的元素
        */
        
        getAbsDec(elem:HTMLElement){
            let dec={x:0,y:0};
            while (true) {
                dec.x+=elem.offsetLeft;
                dec.y+=elem.offsetTop;
                if (!elem.offsetParent && elem.parentElement!==document.body) return dec;
                elem=elem.offsetParent as HTMLElement;
            }
        },

        deepClone(target:{[prop:string]:any},origin:object) {
            if (!target) target={};
            let propList=(Object.getOwnPropertyNames(origin) as []).concat(Object.getOwnPropertySymbols(origin) as []);

            for (let keys in propList) {
                if (target[keys]) throw new Error("目标对象属性已存在");
                let prop:PropertyDescriptor = Object.getOwnPropertyDescriptor(origin,keys) as PropertyDescriptor;
                if (typeof prop?.value === "object" && prop.value!==null) {
                    let o:any;
                    if (prop.value instanceof HTMLElement) {
                        o = document.createElement(prop.value.nodeName);
                        Object.keys(prop.value.style).forEach((key:string) => {
                            o[key]=(prop.value.style)[key];
                        })
                    }else if (prop.value.constructor===Set || prop.value.constructor===Map || prop.value.constructor===Date) {
                        o=new (prop.value.constructor as any)(prop.value);
                    }else if (prop.value.constructor===RegExp) {
                        o=new RegExp(prop.value.source,prop.value.flags)
                    }else {
                        o=prop.value.constructor();
                        this.deepClone(o,prop.value);
                    }
                    Object.defineProperty(target,keys,{
                        enumerable:prop.enumerable,
                        configurable:prop.configurable,
                        writable:prop.writable,
                        value:o
                    })
                }else {
                    Object.defineProperty(target,keys,prop as PropertyDescriptor);
                }
            }

            return target;
            
        },



        setClassName(targetItem:HTMLElement,classItem:string,dele?:boolean) {

            let reg=new RegExp(`\\b${classItem}\\b`,"g");
            if (dele) {
                targetItem.className = targetItem.className.replace(reg,"");
            }else{
                targetItem.className = reg.test(targetItem.className) ? targetItem.className : targetItem.className.split(/\s+/).concat(classItem).join(" ");
            }

        }
    }
})(window)