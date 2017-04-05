define(["mvc","jquery","css!./image.css"],function(){
	MVC
.addView("home.image",function(model,template){
	var dom = $(".image");
	var data = model.get("home.images");
	// console.log(data);
	var tpl = [
		'<div class="top">',
			'<h2>{#title#}</h2>',
			'<div><a href="javascript:void(0);"  class="a1"></a><a href="javascript:void(0);" class="a2"></a></div>',
		'</div>',
		'<div class="bottom">',
			'<ul>{#ul#}</ul>',
		'</div>'
	].join("");
	var ulTpl = '<li><img src="modules/home/image/{#src#}" alt="" /></li>';
	var html = ul = "";
	data.list.forEach(function(value,index){
		ul += template(ulTpl,{
			src : value
		})
	})
	html = template(tpl,{
		title : data.title,
		ul : ul
	})
	
	dom.html(html);
	return dom;

})
.addCtrl("home.image",function(model,view,observer){
	observer.regist("homeComplete",function(){
		view.create("home.image");
		var index = 0;
		var lock = false;
		$(".a1").click(function(){
			if(lock) return;
			lock = true;
			index--;
			if(index<0)index=0
			$(".bottom ul").animate({"left":-184*index},1000,function(){
				lock = false;
			})
		})
		$(".a2").click(function(){
			if(lock) return;
			lock = true;
			index++;
			if(index>1)index=0
			$(".bottom ul").animate({"left":-184*index},1000,function(){
				lock = false;
			})
		})

		var timer = setInterval(function(){
			if(lock) return;
			lock = true;
			index++;
			if(index>1)index=0
			$(".bottom ul").animate({"left":-184*index},1000,function(){
				lock = false;
			})
		},2000)
		$(".image").hover(function(){
			clearInterval(timer);
		},function(){
				timer = setInterval(function(){
				if(lock) return;
				lock = true;
				index++;
				if(index>1)index=0
				$(".bottom ul").animate({"left":-184*index},1000,function(){
					lock = false;
				})
			},2000)
		})
	})
})
})