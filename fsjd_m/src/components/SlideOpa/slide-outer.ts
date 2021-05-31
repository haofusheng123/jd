import Utils from "../../common/Utils.js";
interface slideType{
    slideOuter:HTMLElement|null|undefined;
    time?:number;
    spend?:number;
    autoplay?:boolean;
}

class SlideOpa implements slideType{
    public slideOuter!:HTMLElement|undefined;
    public time!:number;
    public spend!:number;
    public autoplay!:boolean;

    private type!:"flicker"|"roll";
    private width:number;
    private slideCon!:HTMLElement|null|undefined;
    private itemList!:any;
    private itemnum!:number;
    private index:number=0;
    private leftBtn!:HTMLElement|Node;
    private rightBtn!:HTMLElement|Node;
    private iconCon!:HTMLElement;
    private iconList!:any;
    private decoration:string="left";
    private runBool:boolean=false;
    private left:number=0;
    private prevIndex!:number;
    private runtime!:number;
    private stopBool:boolean=false;
    private btnClick:boolean=false;
    private iconHandlerPar:(e: Event) => void;

    static slideList:Array<object|null>=[];

    static RunAllSlide() {
        SlideOpa.slideList.forEach((item:any) => {
            item.runSlide();
        })
    }

    constructor (slideOuter:HTMLElement|undefined,type:"flicker"|"roll"="flicker",autoplay:boolean=true,width?:number,time:number=200,spend:number=30){
        this.setInit(slideOuter,time,spend,autoplay,type);
        this.slideCon=this.slideOuter!.querySelector("ul");
        this.itemList=this.slideCon!.querySelectorAll("li");
        this.width = width ? width : this.slideOuter!.offsetWidth;
        this.slideCon!.style.position="relative";
        this.addBtn();
        this.iconCon=this.addSlideIcon();
        this.iconList=this.iconCon.children;
        this.setRule();

        this.iconHandlerPar=this.iconHandler.bind(this);
        this.iconCon!.addEventListener("click",this.iconHandlerPar);
        this.changeIcon(this.index);

        this.type==="roll" && this.setRollInit();

        SlideOpa.slideList.push(this);
        // (this.slideOuter as HTMLElement).addEventListener("mouseenter",(e) => this.stopSlide(e));
        // (this.slideOuter as HTMLElement).addEventListener("mouseleave",(e) => this.stopSlide(e));
    }

    setInit(slideOuter:HTMLElement|undefined,time:number,spend:number,autoplay:boolean,type:"flicker"|"roll"){
        this.slideOuter=slideOuter;
        this.time=time;
        this.spend=spend;
        this.autoplay=autoplay;
        this.type=type;
        this.runtime=this.time;
    }

    setRollInit(){
        if ((this.slideCon as HTMLElement).children.length===0) return;
        (this.slideCon as HTMLElement).appendChild((this.slideCon as HTMLElement).children[0].cloneNode(true));
        this.slideCon!.style.width=this.width*(this.itemList.length+1)+"px";
    }

    stopSlide(e:Event){
        this.stopBool=e.type ==="mouseenter" ? true : false;
    }

    removeIcon(){
        this.iconCon!.removeEventListener("click",this.iconHandler);
        this.iconCon.remove();
    }

    removeBtn(){
        this.leftBtn!.removeEventListener("click",this.showBtn);
        (this.leftBtn as HTMLElement).remove();
        this.rightBtn!.removeEventListener("click",this.showBtn);
        (this.rightBtn as HTMLElement).remove();
    }

    removeSlide(){
        this.iconCon!.removeEventListener("click",this.iconHandlerPar);
        this.removeBtn();
        this.removeIcon();
        let index = SlideOpa.slideList.indexOf(this);
        SlideOpa.slideList[index]=null;
        SlideOpa.slideList.splice(index,1);
    }

    addBtn() {
        this.rightBtn=Utils.ce("span",{
            width:"32px",
            height:"32px",
            position:"absolute",
            top:"calc(50% - 16px)",
            fontSize:"20px",
            color:"#f6f6f6",
            lineHeight:"32px",
            textAlign:"center",
            opacity:"0.2",
            background:"#000",
            borderRadius:"50% 0 0 50%",
            cursor:"pointer",
            display:"block"
        },{
            className:"iconfont icon-jiantouarrow487"
        },this.slideOuter);
        this.leftBtn=this.rightBtn.cloneNode();
        Object.assign((this.leftBtn as HTMLElement).style,{
            transform:"scaleX(-1)",
            left:0
        });
        Object.assign((this.rightBtn as HTMLElement).style,{
            right:0
        });
        this.leftBtn.addEventListener("click",(e) => this.btnHandler(e));
        this.rightBtn.addEventListener("click",(e) => this.btnHandler(e));

        this.leftBtn.addEventListener("mouseenter",this.showBtn);
        this.rightBtn.addEventListener("mouseenter",this.showBtn);
        this.leftBtn.addEventListener("mouseleave",this.showBtn);
        this.rightBtn.addEventListener("mouseleave",this.showBtn);
        this.slideOuter!.appendChild(this.leftBtn);
    }

    showBtn(e:any){
        e.target.style.opacity=e.type==="mouseenter" ? "0.4" : "0.2";
    }


    addSlideIcon(){
        if (this.itemList.length===0) return;
        let ul=Utils.ce("ul",{
            position:"absolute",
            bottom:"10px",
            overflow:"hidden",
            left:"50%",
            transform:"translate(-50%)"
        });
        ul.innerHTML=new Array(this.itemList.length).fill(0).reduce((value,item,index) => {
            return value+"<li icon-index="+index+"></li>";
        },"");
        for (var i=0;i< ul.children.length;i++) {
            Object.assign(ul.children[i].style,{
                width:this.width*0.016+"px",
                height:this.width*0.016+"px",
                backgroundColor:"rgba(255,255,255,0.6)",
                borderRadius:"50%",
                border:"2px transparent solid",
                margin:"0 1px",
                float:"left",
                cursor:"pointer",
                backgroundClip:"padding-box"
            });
        }
        this.slideOuter!.appendChild(ul);
        return ul;
    }
    setRule(){
        Object.assign(this.slideOuter!.style,{
            overflow:"hidden",
            position:"relative",
            height:"100%"
        });
        Object.assign(this.slideCon!.style,{
            width:this.type==="flicker" ? this.width+"px" : this.width*this.itemList.length+"px",
            overflow:"hidden",
            height:"100%",
            zIndex:0
        });

        switch (this.type) {
            case "flicker":
                this.itemList.forEach(((item: { style: any; },_index:number) => {
                    Object.assign(item.style,{
                        width:this.width+"px",
                        transition: ".5s",
                        position:"absolute",
                        opacity:this.index === _index ? 1 : 0,
                        zIndex:this.index === _index ? 99 : 0
                    })
                }));
                break;
            case "roll":
                this.itemList.forEach(((item: { style: any; },_index:number) => {
                    Object.assign(item.style,{
                        width:this.width+"px",
                        float:"left"
                    })
                }));
                this.runBool=true;
                break;
            default:
                let priEvent:never=this.type;
        }
    }

    btnHandler(e:Event){
        if (e.target===this.leftBtn) {
            this.changeIndex(this.index-1);
        }else{
            this.changeIndex(this.index+1);
        }
        this.btnClick=true;
    }

    iconHandler(e:Event) {
        let iconIndex:number = Number((e.target as HTMLElement).getAttribute("icon-index"));
        this.changeIndex(iconIndex);
        this.btnClick=true;
    }
    
    changeIndex(_index:number) {
        if (_index === this.index) return;
        this.spend=Math.abs(this.index-_index)*30;
        this.decoration=_index > this.index ? "left" : "right";
        this.prevIndex=this.index;
        this.index=_index;
        switch (this.type) {
            case "flicker":
                if (this.index<0) this.index=this.itemList.length-1;
                if (this.index>this.itemList.length-1) this.index=0;
                this.changeIcon(this.index);
                break;
            case "roll":
                if (_index>this.itemList.length) this.index=0;
                if (this.index<0) {
                    this.index=this.itemList.length-1;
                    this.left=-this.itemList.length*this.width;
                    (this.slideCon as HTMLElement).style.left=this.left+"px";
                }
                this.changeIcon(this.index);
                break;
            default:
                let priEvent:never=this.type;
        }
        this.runBool=true;
    }

    changeIcon(index:number){
        if (this.prevIndex || this.prevIndex===0){
            (this.iconList[this.prevIndex] as HTMLElement).style.borderColor="transparent";
            (this.iconList[this.prevIndex] as HTMLElement).style.backgroundColor="rgba(255,255,255,0.6)";
        }

        if (index===this.itemList.length) {
            (this.iconList[0] as HTMLElement).style.borderColor="#eee";
            (this.iconList[0] as HTMLElement).style.backgroundColor="rgba(255,255,255,1)";
            return;
        }

        (this.iconList[this.index] as HTMLElement).style.borderColor="#eee";
        (this.iconList[this.index] as HTMLElement).style.backgroundColor="rgba(255,255,255,1)";
    }
    
    runSlide(){
        if (this.stopBool && !this.btnClick) return;
        this.autoControl();
        if (!this.runBool) return;
        this.runtime=this.time;
        this.flicker();
        this.roll();
    }

    autoControl() {
        if (this.autoplay) {
            if (!this.stopBool) {
                this.runtime--;
                if(this.runtime<0) {
                    this.runtime=this.time;
                    this.changeIndex(this.index+1);
                }
            };
        }
    }

    flicker() {
        if (this.type!=="flicker") return;
        this.runBool=false;
        this.itemList[this.prevIndex].style.zIndex=1;
        this.itemList[this.index].style.zIndex=99;
        this.itemList[this.prevIndex].style.opacity=0;
        this.itemList[this.index].style.opacity=1;
        this.btnClick=false;
    }

    roll(){
        if (this.type!=="roll") return;
        if (this.decoration === "left") {
            this.left-=this.spend;
            if (this.left <= -this.index*this.width+this.spend) {
                this.left=-this.index*this.width;
                this.runBool=false;
                this.btnClick=false;
                this.spend=30;
                if (this.index===this.itemList.length) {
                    this.index=0;
                    this.left=0;
                }
            }
        }else{
            this.left+=this.spend;
            if (this.left >= -this.index*this.width-this.spend) {
                this.left=-this.index*this.width;
                this.runBool=false;
                this.btnClick=false;
                this.spend=30;
            }
        }
        (this.slideCon as HTMLElement).style.left=this.left+"px";
    }
}


export default SlideOpa;
function item(item: any, arg1: (any: any) => void) {
    throw new Error("Function not implemented.");
}

