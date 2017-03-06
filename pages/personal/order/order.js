//获取应用实例
var app = getApp()
Page({
  data: {
    stateData:[{
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
  onLoad: function (option) {
    wx.setNavigationBarTitle({
      title: '我的订单'
    })
    var findtype = option.findtype;
    if(!findtype){
      findtype = 'all';
    }
    this.finds(findtype);
  },
  findOrder:function(e){
    this.finds(e.currentTarget.dataset.id);
  },
  finds:function(findtype){
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
  }
})