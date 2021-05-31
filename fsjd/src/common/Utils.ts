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
        }

        // deepClone(target:object,origin:object) {
            
        //     let nameList=Object.getOwnPropertyNames(target);
            
        // }
    }
})(window)