//获取应用实例
var app = getApp()
Page({
  data:{
    orderInfo:{},                  //订单详情
    findtype:''                    //查找类型
  },
  onLoad:function(option){        //页面加载获取订单详情
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    var that = this;
    var time = Date.parse(new Date());
    var param = {
      orderid:option.orderid,
      api:'findIndentidById',
      time:time
    }
    var findtype = option.findtype;
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: param,
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if(res.data.res!='1'){
          return app.alerts(res.data.msg);
        }
        var orderInfo = res.data.data;
        var orderlist = JSON.parse(orderInfo.orderlist);
        var orderAddress = JSON.parse(orderInfo.address);
        orderInfo.orderlist = orderlist;
        orderInfo.address = orderAddress;
        that.setData({
          orderInfo:orderInfo,
          findtype:findtype
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
              wx.navigateTo({
                url: '../order/order?findtype='+that.data.findtype
              })
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
      url: '../comment/comment?orderid='+e.currentTarget.dataset.id+'&state='+e.currentTarget.dataset.state+'&findtype='+this.data.findtype
    })
  },
})