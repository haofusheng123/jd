一、全局的观察者设置

进行三重锁定，保证观察者的唯一

1、Animation
path: ./components/Animation 
desc: 持续执行函数，如果需要持续监听或者持续执行要向这个观察者中注册函数 

方法: addFn 注册函数

2、Route/main
path: ./route/obServer/main
desc: 路由事件改变的页面切换，当hash改变后会向他抛发事件，这个观察者接收到后会修改他其中的代理属性实现页面的切换

方法: 

3、SetHandler

path: ./components/SetHandler
desc: 全局的样式改变，当模块想要改变全局的dom样式时，如果直接进行设置，需要进行页面元素获取，出现了耦合，模块的复用性降低，通过全局观察者，模块将需要改变的样式交给观察者去设置，这个观察者便是模块与全局元素交互的桥梁

二、状态存储

1、s-main
path: ./store/s-main.ts
desc: 状态存储池，对数据进行存储与代理，数据改变将绑定该属性的元素内容重置

方法: createStore 代理数据，他的数据创建是一次性的，后期不能覆盖添加，所以绑定数据必须有初始值，来进行代理属性的占位

三、network模块

所有的网络请求在此模块进行

四、interfaceList模块

接口规范

五、handerType

向全局观察者抛发的事件存储

六、router

路由管理模块、二级路由