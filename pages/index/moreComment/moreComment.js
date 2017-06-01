var util = require('../../../utils/util.js');
Page({
  data:{
    lengths:0,                  //总评论数
    summary:0,                  //总评分
    starType:[{
      num:0,percent:0
    },{
      num:0,percent:0
    },{
      num:0,percent:0
    },{
      num:0,percent:0
    },{
      num:0,percent:0
    }],                //每种星级的数量
    comments:[],      //评论
    index:2,          //分页注入数据
    allcomment:[],    //所有评论
    position:'0px 0px'   //星级图片定位
  },
  onLoad:function(){            //页面加载从缓存中取出评论数据
    wx.setNavigationBarTitle({
      title: '店铺评论'
    })
    var that = this;
    wx.getStorage({
      key: 'comments',
      success: function(res) {
        var allcomment = res.data;
        var summary = 0;
        var starType = that.data.starType;
        for (var i = 0; i < allcomment.length; i++) {
          allcomment[i].createtime = util.formatTime(allcomment[i].createtime);
          summary = summary + parseInt(allcomment[i].star);
          if(allcomment[i].star == '5'){
            starType[0].num = starType[0].num + 1;
            starType[0].percent = starType[0].num/allcomment.length*100;
          }else if(allcomment[i].star == '4'){
            starType[1].num = starType[1].num + 1;
            starType[1].percent = starType[1].num/allcomment.length*100;
          }else if(allcomment[i].star == '3'){
            starType[2].num = starType[2].num + 1;
            starType[2].percent = starType[2].num/allcomment.length*100;
          }else if(allcomment[i].star == '2'){
            starType[3].num = starType[3].num + 1;
            starType[3].percent = starType[3].num/allcomment.length*100;
          }else{
            starType[4].num = starType[4].num + 1;
            starType[4].percent = starType[4].num/allcomment.length*100;
          }
        };
        var lengths = allcomment.length;
        summary = summary/lengths;
        var position = (5-summary)/5*85;
        summary = summary.toFixed(2);
        var comments = allcomment.slice(0,5);
        console.log(starType);
        that.setData({
          lengths:lengths,
          summary:summary,
          comments:comments,
          starType:starType,
          allcomment:allcomment,
          position:position+'px 0'
        })
      } 
    })
  },
  refresh:function(){           //上拉刷新
    var that = this;
    var index = that.data.index;
    var allcomment = that.data.allcomment;
    var comment = that.data.comments;
    if(allcomment.length == comment.length){
      return;
    }
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000,
      complete:function(){
        var comments = allcomment.slice(0,5*index);
        index++;
        that.setData({
          index:index,
          comments:comments
        })
      }
    })
  }
})