//获取应用实例
var app = getApp()
Page({
  data: {
    imgsrc: '',        //用户微信头像地址
    userInfo:[]        //用户信息
  },
  onLoad: function () {        //页面加载获取用户信息和头像
    this.setData({
      imgsrc:app.globalData.imgsrc,
      userInfo:app.globalData.userInfo
    })
  },
  personalCenter:function(){      //跳转至个人主页
    wx.navigateTo({
      url: 'info/info?userid='+this.data.userInfo.userid
    })
  },
  myAddress:function(){           //跳转至我的地址
    wx.navigateTo({
      url: 'address/address?userid='+this.data.userInfo.userid
    })
  },
  myOrder:function(e){
    wx.navigateTo({
      url: 'order/order?findtype='+e.currentTarget.dataset.id
    })
  }
})