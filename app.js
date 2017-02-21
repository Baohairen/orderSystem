//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  alerts: function(content){       //封装弹框函数
    wx.showModal({
      title: '提示',
      content: content,
      showCancel:false
    })
  },
  globalData:{
    userInfo:null,
    url:'http://127.0.0.1:8001/admin.jsp',
    ways:'1',            //0为外卖，1为堂食
    orderlist:[],        //订单列表
    fullPrice:''         //商品总价
  }
})