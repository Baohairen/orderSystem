//获取应用实例
var app = getApp()
Page({
  data: {
    navLeftItems: [                   //定义产品种类
        {name:'当季特选',id:'0'},
        {name:'披萨',id:'1'},
        {name:'好多翅',id:'2'},
        {name:'饮料',id:'3'},
        {name:'沙拉和蔬菜',id:'4'},
        {name:'超值套餐',id:'5'},
        {name:'工作日午餐',id:'6'},
        {name:'超值下午茶',id:'7'},
        {name:'饭食',id:'8'},
        {name:'意面',id:'9'},
        {name:'米线',id:'10'},
        {name:'小吃',id:'11'},
        {name:'汤',id:'12'},
        {name:'甜点',id:'13'}
    ],
    navRightItems: [],  //产品列表
    curNav: 0,          //当前选择的产品种类
    foodinfo:[],        //产品详情展示
    foodlist:[],        //产品id列表
    orderlist:[],       //订单表
    fullprice:'0.00',    //产品总价
    collect:{
      imgSrc:'../../images/star.png',       //图片地址
      text:'收藏'       //是否收藏
    },
    collectFood:[]                 //收藏的商品
  },
  checkChoose:function(){                //判断是否已加入购物车
    var orderlist = app.globalData.orderlist;
    if(orderlist.length<1){
      this.setData({
        orderlist:orderlist
      })
      return;
    }
    var list = this.data.foodlist;
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < orderlist.length; j++) {
        if(list[i].foodid == orderlist[j].foodid){
          list[i].num = orderlist[j].num;
        }
      };
    };
    this.setData({
      foodlist:list,
      orderlist:orderlist
    })
  },
  checkCollect:function(isCollect){             //判断是否已经收藏
    var list = this.data.navRightItems;
    if(isCollect){
      var collectFood = this.data.collectFood;
    }else{
      if (!app.globalData.userInfo.collect) {
        return;
      }
      var collectFood = JSON.parse(app.globalData.userInfo.collect);
    }

    for (var i = 0; i < list.length; i++) {
      list[i].isCollect = '0';
      for (var k = 0; k < collectFood.length; k++) {
        if(collectFood[k].foodid == list[i].foodid){
          list[i].isCollect = '1';
        }
      };
    }
    this.setData({
      navRightItems:list,
      collectFood:collectFood
    })
  },
  onShow: function(){   //页面进入
    this.setData({
      curNav: 0
    })
    var that = this;
    var time = Date.parse(new Date());
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: {
        api:'findAllFood',            //服务器端请求所有产品列表
        time:time
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if(res.data.res!='1'){
          return app.alerts(res.data.msg);
        }
        that.setData({
          foodlist: res.data.data
        })
        that.actives();
      }
    })
  },
  actives :function(){               //通过产品种类查询产品
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2000
    })
    var that = this;
    var time = Date.parse(new Date());
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: {
        api:'findFoodByFoodNum',
        foodnum1:this.data.curNav,
        state:'1',
        time:time
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        wx.hideToast();
        if(res.data.res!='1'){
          return app.alerts(res.data.msg);
        }
        that.setData({
          navRightItems: res.data.data
        })
        that.checkCollect();
        that.checkChoose();
        that.getFullPrice();
      }
    })
  },

  //事件处理函数
  switchRightTab: function(e) {               //产品种类更换
    var id = e.target.id;
    this.setData({
      curNav: id
    })
    this.actives();
  },
  foodsInfo:function(e){                     //通过产品id查询产品详情
    var foodid = e.currentTarget.dataset.id;
    var isCollect = e.currentTarget.dataset.collect;
    var collect = this.data.collect; 
    var that = this;
    var time = Date.parse(new Date());
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: {
        api:'findFoodById',
        foodid:foodid,
        time:time
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if(res.data.res!='1'){
          return app.alerts(res.data.msg);
        }
        if(isCollect != '0'){
          collect = {
            imgSrc:'../../images/star_active.png',       
            text:'取消收藏'       
          }
        }else{
          collect = {
            imgSrc:'../../images/star.png',       
            text:'收藏'       
          }
        }
        that.setData({
          foodinfo: res.data.data[0],
          collect:collect
        })
      }
    })
  },
  close:function(){                    //关闭产品详情页
    this.setData({
      foodinfo: []
    })
  },
  plus:function(e){                   //增加产品数量
    var index = e.currentTarget.dataset.index;
    var num = this.data.foodlist[index].num;
    num++;
    var list = this.data.foodlist;
    list[index].num = num;
    var order = this.data.orderlist;
    if(order.length<1){
      order.push(list[index]);
    }else{
      for (var i = 0; i < order.length; i++) {
        if(order[i].foodid == list[index].foodid){
          order[i] = list[index];
          break;
        }
        if(order[order.length-1].foodid != list[index].foodid){
          order.push(list[index]);
        }
      };
    }
    this.setData({
      foodlist: list,
      orderlist:order
    })
    app.globalData.orderlist = order;
    this.getFullPrice();
  },
  minus:function(e){                  //减少产品数量
    var index = e.currentTarget.dataset.index;
    var num = this.data.foodlist[index].num;
    num--;
    var list = this.data.foodlist;
    list[index].num = num;
    var order = this.data.orderlist;
    var id = e.currentTarget.dataset.id;
    for (var i = 0; i < order.length; i++) {
      if(order[i].foodid == id){
        order[i].num = num;
        if(num == 0){
          order.splice(i,1);
        }
        break;
      }
    };
    this.setData({
      foodlist: list,
      orderlist:order
    })
    app.globalData.orderlist = order;
    this.getFullPrice();
  },
  getFullPrice:function(){               //获取用户所选的产品总价
    var price = [];
    var sum = 0;
    for (var i = 0; i < this.data.orderlist.length; i++) {
      price[i] = this.data.orderlist[i].price*this.data.orderlist[i].num;
    };
    for (var i = 0; i < price.length; i++) {
      sum = sum + parseInt(price[i]);
    };
    sum = sum.toString() + '.00';
    this.setData({
      fullprice:sum
    })
  },
  chooseOk:function(){                   //用户选择完毕，进入购物车
    app.globalData.orderlist = this.data.orderlist;
    app.globalData.fullPrice = this.data.fullprice;
    wx.switchTab({
      url: '/pages/shopCar/shopCar'
    })
  },
  collect:function(){                 //收藏或取消收藏
    var collectFood = this.data.foodinfo;
    var that = this;
    var time = Date.parse(new Date());
    if(that.data.collect.text == '收藏'){
      var api = 'addCollect';
    }else{
      var api = 'cancelCollect';
    }
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: {
        api:api,
        userid:app.globalData.userInfo.userid,
        collect:collectFood,
        time:time
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if(res.data.res!='1'){
          return app.alerts(res.data.msg);
        }
        var collectFood = JSON.parse(res.data.data);
        if(that.data.collect.text == '收藏'){
          var collect = {
            imgSrc:'../../images/star_active.png',       
            text:'取消收藏'       
          }
        }else{
          var collect = {
            imgSrc:'../../images/star.png',       
            text:'收藏'       
          }
        }
        that.setData({
          collect: collect,
          collectFood:collectFood
        })
        that.checkCollect('0');
      }
    })
  }
})