import Utils from "../../common/Utils.js";
import IconTab from "./IconTab.js";

interface zoomType{
    imgList:{icon:string,small:string,big:string}[],
    parent:HTMLElement;
    [prop:string]:any;
}

export default class Zoom implements zoomType{
    public imgList!:{icon:string,small:string,big:string}[];
    public parent!:HTMLElement;
    private width:number=400;
    private bigWidth:number=540;
    private bigImgWidth:number=0;
    private scale:number=0;
    private shadowX:number=0;
    private shadowY:number=0;
    private smallPosition:any;
    private mouseRun:any;
    private scrollTop!:number;

    private shadowItem!:HTMLElement;
    private smallItem!:HTMLElement;
    private bigItem!:HTMLElement;
    private smallImg!:any;
    private bigImg!:any;
    constructor(option:zoomType){
        this.setInit(option);
        this.createZoom();
        this.setStyle();
        let iconList=new IconTab({imgList:this.imgList as any,num:5,width:this.width});
        iconList.appendTo(document.querySelector(".c-goods-icon") as HTMLElement);

        this.shadowItem=this.parent.querySelector(".small-shadow") as HTMLElement;
        this.smallItem=this.parent.querySelector(".c-goods-small") as HTMLElement;
        this.bigItem=this.parent.querySelector(".c-goods-big") as HTMLElement;
        this.bigImg = this.parent.querySelector(".c-goods-big img") as HTMLElement;
        this.smallImg = this.parent.querySelector(".c-goods-small img") as HTMLElement;
        this.smallPosition=Utils.getAbsDec(this.smallItem);

        this.mouseRun=this.mouseHandler.bind(this);
        this.bigImg.addEventListener("load",this.bigLoadHandler.bind(this));
        this.smallItem.addEventListener("mouseenter",this.mouseRun);
        window.addEventListener("scroll",(e) => this.scrollHandler(e));
        window.addEventListener("resize",(e) => this.resizeHandler(e));
        iconList.addEventListener(IconTab.CHANGE_ICON,(e) => this.changeIcon(e));
    }
    setInit(option:zoomType) {
        this.imgList=option.imgList;
        this.parent=option.parent;
        this.scrollTop=document.documentElement.scrollTop;
        if (option.width) this.width=option.width;
    }

    changeIcon(e:any) {
        this.changeImg(e.targetImg);
    }

    changeImg(src:string) {
        this.bigImg.src=src.replace(/\/(n5)\//g,"/n0/");
        this.smallImg.src=src.replace(/\/(n5)\//g,"/n1/");
    }

    scrollHandler(e:Event) {
        this.scrollHandler=Utils.throttle((e:Event) => {
            this.scrollTop=document.documentElement.scrollTop;
        },200);
        this.scrollHandler(e)
    }

    resizeHandler(e:Event) {
        this.resizeHandler=Utils.throttle((e:Event) => {
            this.smallPosition=Utils.getAbsDec(this.smallItem);
        },200);
        this.resizeHandler(e);
    }

    mouseHandler(e:Event) {
        switch (e.type){
            case "mouseenter":
                this.bigItem.style.display="block";
                this.bigImg.style.display="block";
                this.shadowItem.style.display="block";
                this.smallItem.addEventListener("mouseleave",this.mouseRun);
                window.addEventListener("mousemove",this.mouseRun);
                break;
            case "mouseleave":
                this.bigItem.style.display="none";
                this.bigImg.style.display="none";
                this.shadowItem.style.display="none";
                this.smallItem.removeEventListener("mouseleave",this.mouseRun);
                window.removeEventListener("mousemove",this.mouseRun);
                break;
            case "mousemove":
                this.runZoom(e);
                break;
        }
    }

    bigLoadHandler(e:Event) {
        this.bigImgWidth=(e.target as any).width;
        this.scale=this.width/this.bigImgWidth;
        Object.assign((this.shadowItem as HTMLElement).style,{
            width:this.bigWidth*this.scale+"px",
            height:this.bigWidth*this.scale+"px"
        })
    }

    runZoom(e:any) {
        this.shadowX=e.x-this.smallPosition.x-this.bigWidth/2*this.scale;
        this.shadowY=e.y-this.smallPosition.y-this.bigWidth/2*this.scale+this.scrollTop;
        
        if (this.shadowX<0) this.shadowX=0;
        if (this.shadowY<0) this.shadowY=0;
        if (this.shadowX >= this.width-this.bigWidth*this.scale) this.shadowX=this.width-this.bigWidth*this.scale;
        if (this.shadowY >= this.width-this.bigWidth*this.scale) this.shadowY=this.width-this.bigWidth*this.scale;

        this.shadowItem.style.left=this.shadowX+"px";
        this.shadowItem.style.top=this.shadowY+"px";
        this.bigImg.style.left=-this.shadowX*this.bigWidth/(this.bigWidth*this.scale)+"px";
        this.bigImg.style.top=-this.shadowY*this.bigWidth/(this.bigWidth*this.scale)+"px";
    }

    createZoom() {
        this.parent.innerHTML=`
            <div class="c-goods-img">
                <div class="c-goods-small">
                    <img src="${this.imgList[0].small}">
                    <div class="small-shadow"></div>
                </div>
                <div class="c-goods-big">
                    <img src="${this.imgList[0].big}">
                </div>
            </div>
            <div class="c-goods-icon">
                
            </div>
        `
    }

    setStyle() {
        Object.assign(this.parent.style,{
            position:"relative",
            width:this.width+"px",
            height:this.width+"px"
        });
        let str=`
            .c-goods-img{
                height: ${this.width}px;
            }
            .c-goods-small {
                width: ${this.width}px;
                height: ${this.width}px;
                overflow: hidden;
                position: absolute;
                left: 0;
                top: 0;
            }
            .c-goods-small img{
                width: 100%;
            }
            .c-goods-big{
                display:none;
                position: absolute;
                left: ${this.width+2}px;
                top: 0;
                width: ${this.bigWidth}px;
                height: ${this.bigWidth}px;
                overflow: hidden;
                z-index:99;
            }
            .c-goods-big img{
                position: absolute;
                display:none;
            }
            .small-shadow{
                width: ${this.bigWidth*this.scale}px;
                height: ${this.bigWidth*this.scale}px;
                background: yellow;
                opacity: .2;
                position: absolute;
                display:none;
                top: 0;
                left: 0;
            }
            .c-goods-icon{
                position:absolute;
                top:${this.width+2}px;
            }
            .c-goods-icon ul li{

            }
        `
        Utils.setStyle(str)
    }
}