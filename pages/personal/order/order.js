//获取应用实例
var app = getApp()
Page({
  data: {
    stateData:[{                      //订单状态与类型
      name:'全部',
      state:'all'
    },{
      name:'外卖订单',
      state:'1'
    },{
      name:'堂食订单',
      state:'2'
    },{
      name:'待评价',
      state:'3'
    },{
      name:'已完成',
      state:'4'
    }],
    curNav:'all',
    indentList:[]
  },
  onLoad: function (option) {              //页面加载获取查询方式
    wx.setNavigationBarTitle({
      title: '我的订单'
    })
    var findtype = option.findtype;
    if(!findtype){
      findtype = 'all';
    }
    this.finds(findtype);
  },
  findOrder:function(e){                   //根据条件查找
    this.finds(e.currentTarget.dataset.id);
  },
  finds:function(findtype){                   //定义查找订单函数
    var time = Date.parse(new Date());
    var param = {
      userid:app.globalData.userInfo.userid,
      time:time
    };
    param.api = 'findAllOrder';
    if(findtype == '1' || findtype == '2'){
      param.api = 'findOrderByState';
      param.state = findtype;
    }
    if (findtype == '3' || findtype == '4') {
      param.api = 'findOrderByProsess';
      param.prosess = findtype;
    }
    var that = this;
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: param,
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        console.log(res);
        if(res.data.res!='1'){
          return app.alerts(res.data.msg);
        }
        var indentList = res.data.data;
        for (var i = 0; i < indentList.length; i++) {
          var orderlist = JSON.parse(indentList[i].orderlist);
          indentList[i].orderlist = orderlist;
        };
        that.setData({
          curNav:findtype,
          indentList:indentList
        })
      }
    })
  },
  remind:function(e){                            //提醒商家接单或催单
    var orderid = e.currentTarget.dataset.id;
    var remark = e.currentTarget.dataset.remark;
    var remind = e.currentTarget.dataset.remind;
    var time = Date.parse(new Date());
    var param = {
      orderid:orderid,
      remark:remark,
      api:'remindReciveOrder',
      time:time
    };
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: param,
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        console.log(res);
        if(res.data.res!='1'){
          return app.alerts(res.data.msg);
        }
        if(remind){
          app.alerts('已提醒商家接单！');
        }else{
          app.alerts('已提醒商家尽快出餐！');
        } 
      }
    })
  },
  cancelAndDel:function(orderid,api,content){     //取消删除订单
    var that = this;
    var time = Date.parse(new Date());
    var param = {
      orderid:orderid,
      api:api,
      time:time
    }
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: param,
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        console.log(res);
        if(res.data.res!='1'){
          return app.alerts(res.data.msg);
        }
        wx.showModal({
          title: '提示',
          content: content,
          showCancel:false,
          success: function(res) {
            if (res.confirm) {
              that.finds(that.data.curNav);
            }
          }
        })  
      }
    })
  },
  cancel:function(e){               //取消订单
    var orderid = e.currentTarget.dataset.id;
    this.cancelAndDel(orderid,'cancelOrder','已经取消订单');
  },
  delOrder:function(e){                    //删除订单
    var orderid = e.currentTarget.dataset.id;
    this.cancelAndDel(orderid,'delIndent','已经删除订单');
  },
  toComment:function(e){           //评价
    wx.navigateTo({
      url: '../comment/comment?orderid='+e.currentTarget.dataset.id+'&state='+e.currentTarget.dataset.state+'&findtype='+this.data.curNav
    })
  },
  toOrderInfo:function(e){          //订单详情
    wx.navigateTo({
      url: '../orderInfo/orderInfo?orderid='+e.currentTarget.dataset.id+'&findtype='+this.data.curNav
    })
  }
})