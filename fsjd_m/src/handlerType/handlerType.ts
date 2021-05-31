// 当用到固定数量固定值的情境下用枚举类型，枚举类型一旦创建是无法修改的

export enum handerList{
    ROUTER_CHANGE="router_change", //路由改变事件
    DOM_SET_BAR="dom_set_bar", //切换tab
    DOM_SCROLL="dom_scroll", //路由页面滚动
    BACK_TOP="back_top", //电梯流导航
    DETAIL_CHANGE_TAB="detail_change_tab", //切换详情页小tab
    DETAIL_RENDER="detail_render", //重新渲染详情页
    GO_TOP="go_top",  //返回顶部
    ADD_GOODS="add_goods",  //添加商品
    Mine_CHANGE_TAB="mine_change_tab",  //切换我的主页tab
    CHANGE_TAB_BAR="change_tab_bar",  //切换底层tab
    RENDER_CAR="render_car",  //渲染购物车
}