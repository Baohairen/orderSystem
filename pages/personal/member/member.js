//获取应用实例
var app = getApp()
Page({
  data:{
    identify:'普通会员',           //客户身份
    number:'888001'              //会员编号
  },
  onShow:function(){             //页面加载获取用户身份信息
    wx.setNavigationBarTitle({
      title: '会员中心'
    })
    var identify = app.globalData.userInfo.identify;
    var number = 'NO.8880'+app.globalData.userInfo.userid;
    this.setData({
      identify:identify,
      number:number
    })
  },
  openVIP:function(){
    var that = this;
    var time = Date.parse(new Date());
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: {
        api:'openVIP',
        userid:app.globalData.userInfo.userid,          //通过用户id获取用户信息
        time:time
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        if(res.data.res!='1'){
          return app.alerts(res.data.msg);
        }
        wx.showModal({
          title: '提示',
          content: '会员开通成功',
          showCancel:false,
          success: function(res) {
            if (res.confirm) {
              that.setData({
                identify:'超级会员',
              })
              app.globalData.userInfo.identify = '超级会员';
            }
          }
        })  
      }
    });
  }
})