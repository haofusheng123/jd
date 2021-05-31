type checkElem = HTMLElement|NodeList|null|[];
type checkType = {
    (sel:string) : checkElem;
}
var $:checkType=function (name:string) {
    let list:checkElem=document.querySelectorAll(name);
    if (list.length === 1) {
        let elem:any = document.querySelector(name);
        return elem;
    }
    if (!list) return;
    return (list as NodeList).forEach ? list : list[0];
}

var checkElem:checkType=$;
