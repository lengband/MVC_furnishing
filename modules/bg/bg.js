define(["mvc","jquery","css!./bg.css"],function(){
	MVC
.addModel("bg",{num:parseInt(Math.random()*6),wholeNum:6})
.addView("bg",function(model,template){
	var dom = $("<div id='bg' class='bg'></div>");
	var data = model.get("bg");
	var tpl = "<div class='bg-item item-{#item#} {#isShow#}'></div>";
	var html = "";
	for(var i = 0; i < 6;i++){
		html+=template(tpl,{
			item:i,
			isShow:data.num ===i?"choose":"" 
		})
	}
	dom.html(html);
	dom.prependTo("body");
	return dom;
}).addCtrl("bg",function(model,view,observer){
	var wholeNum = model.get('bg.wholeNum');
	var dom = view.create("bg");
	setInterval(function(){
		var num = parseInt(Math.random()*wholeNum);
		dom.find(".bg-item").eq(num).addClass("choose").siblings().removeClass("choose");
		model.add('bg.num', num);
	},4000)
})
})