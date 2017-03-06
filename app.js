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
        success: function (result) {
          wx.request({
            url: that.globalData.url,
            method: 'GET',
            data: {
              api:'getOpenid',
              code:result.code
            },
            header: {
              'Accept': 'application/json'
            },
            success: function(res) {
              if(res.data.res!='1'){
                return app.alerts(res.data.msg);
              }
              that.globalData.openid = res.data.data;
              wx.getUserInfo({
                success: function (res) {
                  that.globalData.userInfo = res.userInfo
                  typeof cb == "function" && cb(that.globalData.userInfo)
                }
              })
            }
          })
        }
      })
    }
  },
  onShow:function(){
    var that = this
    //调用应用实例的方法获取全局数据
    that.getUserInfo(function(userInfo){
      var gender = userInfo.gender == '1' ? '男' : '女';
      var userData = {
        openid:that.globalData.openid,
        username:userInfo.nickName,
        gender:gender,
        identify:'普通会员'
      }
      userData = JSON.stringify(userData);
      var time = Date.parse(new Date());
      var params = {
        api: 'searchUser',
        data:userData,
        time:time
      };
      wx.request({
        url: that.globalData.url,
        method: 'GET',
        data: params,
        header: {
          'Accept': 'application/json'
        },
        success: function(res) {
          if(res.data.res!='1'){
            return that.alerts(res.data.msg);
          }
          that.globalData.imgsrc = userInfo.avatarUrl;
          that.globalData.userInfo = res.data.data;
        }
      })
    })
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
    openid:'',           //用户openid
    ways:'0',            //0为外卖，1为堂食
    orderlist:[],        //订单列表
    fullPrice:'',        //商品总价
    imgsrc:'',           //个人中心头像地址
    address:null           //默认地址
  }
})