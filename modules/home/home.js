define(["mvc","jquery","css!./home.css","./banner/banner","./image/image","./news/news"],function(MVC,$){
	MVC.addView("home",function(){
	var dom = $("#app");
	var tpl = '<div class="inner module"><div class="banner"></div><div class="news"></div><div class="image"></div></div>';
	dom.html(tpl);
	return dom;
}).addCtrl("home",function(model,view,observer){
	view.create("home");
	$.get('data/home.json',function(res){
		if(res&&res.errno===0){
			model.add("home",res.data);
			observer.fire("homeComplete")
		}
	})
})
})