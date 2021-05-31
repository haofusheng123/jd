export default function proxy(name:string,data:object,parent?:HTMLElement) {
    return createProxy(data,name,parent);
}

let prevRouteItem:HTMLDivElement;

let prevRouteChild:HTMLDivElement;

/*
    createProxy 柯里化函数
    saveProp 每一次代理复杂属性时，都会将上层的键名累加，这样可以通过这个闭包属性来存储了上层键名层级
*/


function createProxy(data:any,saveProp:string,parent?:HTMLElement) {
    return new Proxy(data,{
        get (target:any,key:any) {
            if (typeof target[key] != undefined && typeof target[key] ==="object") {
                return createProxy(target[key],saveProp+"."+key);
            }else {
                return target[key];
            }
        },
        set (target:any,key:any,value:any) {
            target[key]=value;
            renderHtml(saveProp+"."+key,value,parent);
            return true;
        }
    } as any)
}

function renderHtml(sele:string,value:any,parent?:HTMLElement) {

    let domItem:any=parent ? parent.querySelector(`[v-route="${value}"]`) : document.querySelector(`[v-route="${value}"]`);
    if (!domItem) return;

    let length=value.split("/").length;
    if (length===1) {
        if (prevRouteItem) prevRouteItem.style.display="none";
        prevRouteItem=domItem;
        prevRouteItem.style.display="block";
    }else if (length===2){
        if (prevRouteChild) prevRouteChild.style.display="none";
        prevRouteChild=domItem;
        prevRouteChild.style.display="block";
    }


}