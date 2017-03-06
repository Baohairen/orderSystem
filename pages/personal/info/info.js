//获取应用实例
var app = getApp()
Page({
  data:{
    userInfo:[]          //个人信息
  },
  onLoad:function(option){
    wx.setNavigationBarTitle({
      title: '个人主页'
    })
    var that = this;
    var time = Date.parse(new Date());
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: {
        api:'findUserById',
        userid:option.userid,          //通过用户id获取用户信息
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
          userInfo:res.data.data
        })
      }
    });
  },
  formSubmit:function(e){                 //用户信息修改
    var userData = e.detail.value;
    if(!userData.username){
      return app.alerts('请输入姓名');
    }
    if(!userData.gender){
      return app.alerts('请选择性别');
    }
    var res= /^1[34578]\d{9}$/;
    if(!res.test(userData.phone)){
      return app.alerts('请输入正确的手机号吗');
    }
    if(!userData.address){
      return app.alerts('请输入联系地址');
    }
    userData.userid = this.data.userInfo.userid;
    var time = Date.parse(new Date());
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: {
        api:'modifyUser',
        userData:userData,
        time:time
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        console.log(res);
        if(res.data.res!='1'){
          return app.alerts(res.data.msg);
        }
        wx.navigateBack();                //返回个人中心
      }
    })
  }
})