//获取应用实例
var app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    imgUrls: [
      'http://ol58x6i5t.bkt.clouddn.com/images/01.jpg',
      'http://ol58x6i5t.bkt.clouddn.com/images/02.jpg',
      'http://ol58x6i5t.bkt.clouddn.com/images/03.jpg'
    ],
    martInfos:[{
      left:'店铺信息',
      right:''
    },{
      left:'店铺类型：',
      right:'西式快餐'
    },{
      left:'电话：',
      right:'0512-68186015'
    },{
      left:'起送价：',
      right:'￥20'
    },{
      left:'外送费：',
      right:'￥6（满99可免运费）'
    },{
      left:'外送范围：',
      right:'5公里'
    },{
      left:'店铺地址：',
      right:'高新区长江路463号绿宝广场一层'
    }],
    comments:[]         //评论
  },
  onLoad: function () {             //页面加载获取评论
    var that = this;
    var time = Date.parse(new Date());
    var param = {
      state:'1',
      api:'findCommentByState',
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
        if(res.data.res!='1'){
          return app.alerts(res.data.msg);
        }
        var comments = res.data.data;
        wx.setStorage({
          key:"comments",
          data:comments
        })
        comments = comments.slice(0,5);
        for (var i = 0; i < comments.length; i++) {
          comments[i].createtime = util.formatTime(comments[i].createtime);
        };
        that.setData({
          comments:comments
        })
      }
    })
  },
  toChoose: function(e){          //开始选购
    app.globalData.ways = e.currentTarget.id;
    wx.switchTab({
      url: '/pages/choose/choose'
    })
  },
  tel: function () {  //拨号
    wx.makePhoneCall({
      phoneNumber: '0512-68186015' 
    })
  },
  location: function() {  //定位
    wx.navigateTo({
      url: 'map/map'
    })
  },
  moreComment:function(){            //更多评论展示
    wx.navigateTo({
      url: 'moreComment/moreComment'
    })
  }
})
