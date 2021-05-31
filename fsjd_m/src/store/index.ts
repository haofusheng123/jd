import SotreMain from "../store/s-main.js";

export default function setBindData() {
    SotreMain.instance.createStore({
        navName:"",
        navNameList:{home:"首页",classify:"分类",shopcar:"购物车",mine:"我的",detail:"详情页"},
        shopcar:[],
        detailId:"",
        tabList:["home","classify","shopcar","mine"],
        tabModle:["home","classif","shopcar","mine","detail","login","register"],
        detailOption:[],
        shop_num:0
    })
}

