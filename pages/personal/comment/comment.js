//获取应用实例
var app = getApp()
Page({
  data:{
    shopStar:[                                     //商品质量评星
      {'starSrc':'../../../images/star.png'},
      {'starSrc':'../../../images/star.png'},
      {'starSrc':'../../../images/star.png'},
      {'starSrc':'../../../images/star.png'},
      {'starSrc':'../../../images/star.png'}
    ],
    shopStarNum:0,                                //商品数量星级
    serviceStar: [                                //服务质量评星
      {'starSrc':'../../../images/star.png'},
      {'starSrc':'../../../images/star.png'},
      {'starSrc':'../../../images/star.png'},
      {'starSrc':'../../../images/star.png'},
      {'starSrc':'../../../images/star.png'}
    ],
    serviceStarNum:0,                            //服务数量星级
    deliveryStar:[                               //送货服务评星
      {'starSrc':'../../../images/star.png'},
      {'starSrc':'../../../images/star.png'},
      {'starSrc':'../../../images/star.png'},
      {'starSrc':'../../../images/star.png'},
      {'starSrc':'../../../images/star.png'}
    ],
    deliveryStarNum:0,                          //送货数量星级
    state:'1',                         //1为外卖，2为堂食
    commentData:{},                    //评论所需提交的数据
    findtype:''                        //查找类型
  },
  onLoad:function(option){            //页面加载获取相关参数
    wx.setNavigationBarTitle({
      title: '评价订单'
    })
    var commentData = {
      username:app.globalData.userInfo.username,
      userid:app.globalData.userInfo.userid,
      orderid:option.orderid
    }
    this.setData({
      commentData:commentData,
      state:option.state,
      findtype:option.findtype
    })
  },
  comment:function(e){              //评星功能的实现
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var forType = this.data.shopStar;
    if(id == 'service'){
      forType = this.data.serviceStar;
    }
    if(id == 'delivery'){
      forType = this.data.deliveryStar;
    }
    for (var i = 0; i < forType.length ; i++) {
      if(i <= index){
        forType[i].starSrc = '../../../images/star_active.png'
      }else{
        forType[i].starSrc = '../../../images/star.png'
      }
    };
    index++;
    if(id == 'shop'){
      this.setData({
        shopStar:forType,
        shopStarNum:index
      })
    }
    if(id == 'service'){
      this.setData({
        serviceStar:forType,
        serviceStarNum:index
      })
    }
    if(id == 'delivery'){
      this.setData({
        deliveryStar:forType,
        deliveryStarNum:index
      })
    }
  },
  commentSubmit:function(e){              //评论提交
    var shopStarNum = this.data.shopStarNum;
    var serviceStarNum = this.data.serviceStarNum;
    var deliveryStarNum = this.data.deliveryStarNum;
    var content = e.detail.value.content;
    var star = 0;
    var that = this;
    if(shopStarNum == 0){
      return app.alerts('请评价下小店的商品质量哦');
    }
    if(serviceStarNum == 0){
      return app.alerts('请评价下小店的服务质量哦');
    }
    star = Math.round((shopStarNum+serviceStarNum)/2);
    if(this.data.state=='1'){
      if(deliveryStarNum == 0){
        return app.alerts('请评价下小店的配送服务哦');
      }
      star = Math.round((shopStarNum+serviceStarNum+deliveryStarNum)/3);
    }
    if(!content){
      return app.alerts('点评下吧，您的意见很重要哦');
    }
    var commentData = this.data.commentData;
    var time = Date.parse(new Date());
    commentData.star = star;
    commentData.createtime = time;
    commentData.state = '0';
    commentData.content = content;
    commentData = JSON.stringify(commentData);
    wx.request({
      url: app.globalData.url,
      method: 'GET',
      data: {
        api:'addComment',
        commentData:commentData
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
          content: '评论成功',
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
  }
})