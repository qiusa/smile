//初始化
  $("#danmu").danmu({
    left:0,
    top:0,
    height:"100%",
    width:"100%",
    speed:20000,
    opacity:1,
    font_size_small:16,
    font_size_big:24,
    top_botton_danmu_time:6000
  });
  //query();//  从后端获取弹幕并添加

  //再添加三个弹幕
  $("#danmu").danmu("addDanmu",[{ text:"这是滚动弹幕1" ,color:"white",size:1,position:0,time:2}
    ,
    { text:"这是滚动弹幕2" ,color:"white",size:1,position:0,time:2}
    ,
    { text:"这是滚动弹幕3" ,color:"white",size:1,position:0,time:2}
    ,
    { text:"这是滚动弹幕4" ,color:"white",size:1,position:0,time:2}
    ,
    { text:"这是滚动弹幕5" ,color:"white",size:1,position:0,time:2}
    ,
    { text:"这是滚动弹幕6" ,color:"white",size:1,position:0,time:2}
    //,
    // { text:"这是滚动弹幕7" ,color:"white",size:1,position:0,time:2}
    // ,
    // { text:"这是滚动弹幕8" ,color:"white",size:1,position:0,time:2}
    // ,
    // { text:"这是滚动弹幕9" ,color:"white",size:1,position:0,time:2}
    // ,
    // { text:"这是滚动弹幕10" ,color:"white",size:1,position:0,time:2}
    // ,
    // { text:"这是滚动弹幕11" ,color:"white",size:1,position:0,time:2}
    // ,
    // { text:"这是滚动弹幕12" ,color:"white",size:1,position:0,time:2}
    // ,{ text:"这是顶部弹幕" ,color:"yellow" ,size:1,position:1,time:2}
    // ,{ text:"这是底部弹幕" , color:"red" ,size:1,position:2,time:2}
  ]);
    //一个定时器，监视弹幕时间并更新到页面上
  function timedCount(){
    $("#time").text($('#danmu').data("nowTime"));

    t=setTimeout("timedCount()",500)

  }
  timedCount();



  function starter(){
    $('#danmu').danmu('danmuStart');
  }
  function pauser(){
    $('#danmu').danmu('danmuPause');
  }
  function resumer(){
    $('#danmu').danmu('danmuResume');
  }
  function stoper(){
    $('#danmu').danmu('danmuStop');
  }
  function getime(){
    alert($('#danmu').data("nowTime"));
  }
  function getpaused(){
    alert($('#danmu').data("paused"));
  }
  //添加弹幕测试  这个函数没有调用
  function add() {
    var newd =
    {"text": "new2", "color": "green", "size": "1", "position": "0", "time": 60};
    $('#danmu').danmu("addDanmu", newd);
  }
  //向后端添加弹幕测试  这个函数没有调用
  function insert(){
    var newd= { "text":"new2" , "color":"green" ,"size":"1","position":"0","time":50};
    str_newd=JSON.stringify(newd);
    $.post("stone.php",{danmu:str_newd},function(data,status){alert(data)});
  }
  //从后端获取到弹幕并添加
  function query() {
    $.get("query.php",function(data,status){
      var danmu_from_sql=eval(data);
      for (var i=0;i<danmu_from_sql.length;i++){
        var danmu_ls=eval('('+danmu_from_sql[i]+')');
        $('#danmu').danmu("addDanmu",danmu_ls);
      }
    });
  }
  //发送弹幕，使用了文档README.md第7节中推荐的方法
  function send(){
    var text = document.getElementById('text').value;
    var color = document.getElementById('color').value;
    var position = document.getElementById('position').value;
    var time = $('#danmu').data("nowTime")+1;
    var size =document.getElementById('text_size').value;
    var text_obj='{ "text":"'+text+'","color":"'+color+'","size":"'+size+'","position":"'+position+'","time":'+time+'}';
    //$.post("stone.php",{danmu:text_obj});
    var text_obj='{ "text":"'+text+'","color":"'+color+'","size":"'+size+'","position":"'+position+'","time":'+time+',"isnew":""}';
    var new_obj=eval('('+text_obj+')');
    $('#danmu').danmu("addDanmu",new_obj);
    document.getElementById('text').value='';
  }
  //调整透明度函数
  function op(){
    var op=document.getElementById('op').value;
    $('#danmu').danmu("setOpacity",op/100);
  }

  //调隐藏 显示
  function changehide() {
    var op = document.getElementById('op').value;
    op = op / 100;
    if (document.getElementById("ishide").checked) {
      $("#danmu").danmu("setOpacity",1)
    } else {
      $("#danmu").danmu("setOpacity",0)

    }
  }

  //设置弹幕时间
  function settime(){
    var t=document.getElementById("set_time").value;
    t=parseInt(t)
    $('#danmu').danmu("setTime",t);
  }