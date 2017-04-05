define(["mvc","jquery","css!./banner.css"],function(){
	MVC.
addView("home.banner",function(model,template){
	var dom = $("#app .banner");
	var data = model.get("home.banner");
	// console.log(data);
	var tpl = [
		'<ul class="banner-img">{#bannerImg#}</ul>',
		'<ul class="banner-btn"><li class="pre"><</li>{#bannerBtn#}<li class="next">></li></ul>',
		'<h1>{#title#}</h1>'
	].join("");
	var imgLiItem = '<li class="{#isChoose#}"><img src="modules/home/banner/{#src#}.jpg" /><p>{#intro#}</p></li>';
	var btnLiItem = '<li class="{#isChoose#}" ></li>';
	var html = imgHtml = btnHtml = "";
	data.list.forEach(function(obj,index){
		imgHtml += template(imgLiItem,{
			isChoose:index===0?"choose" : "",
			src:obj.src,
			intro:obj.intro
		})
		btnHtml += template(btnLiItem,{
			isChoose:index===0?"choose":""
		})
	})

	var html = template(tpl,{
		bannerImg:imgHtml,
		bannerBtn:btnHtml,
		title:data.title
	})
	dom.html(html);
	return dom;

})
.addCtrl("home.banner",function(model,view,observer){
	observer.regist("homeComplete",function(){
		view.create("home.banner");
		//轮播图逻辑
		//分别注册小圆点和图片的两个信号量index是banner图的，Index是小圆点的
		var index = 0;
		var Index = 1;
		$(".next").click(function(){
			index++;
			Index++;
			if(index>3)index=0;
			if(Index>4)Index=1;
			$(".banner-img li").eq(index).addClass("choose").siblings().removeClass("choose");
			$(".banner-btn li").eq(Index).addClass("choose").siblings().removeClass("choose");
		})
		$(".pre").click(function(){
			index--;
			Index--;
			if(index<0)index=3;
			if(Index<1)Index=4;
			$(".banner-img li").eq(index).addClass("choose").siblings().removeClass("choose");
			$(".banner-btn li").eq(Index).addClass("choose").siblings().removeClass("choose");
		}) 
		//小圆点点击事件
		$(".banner-btn li").filter(function(index){
			return index>0&&index<5
		}).click(function(){
			Index = $(".banner-btn li").index($(this));
			index = Index - 1;
			$(".banner-img li").eq(index).addClass("choose").siblings().removeClass("choose");
			$(".banner-btn li").eq(Index).addClass("choose").siblings().removeClass("choose");
		})
		var timer = setInterval(function(){
			index++;
			Index++;
			if(index>3)index=0;
			if(Index>4)Index=1;
			$(".banner-img li").eq(index).addClass("choose").siblings().removeClass("choose");
			$(".banner-btn li").eq(Index).addClass("choose").siblings().removeClass("choose");
		},4000);
		
		$(".banner-img").hover(function(){
			clearInterval(timer);
		},function(){
			timer = setInterval(function(){
			index++;
			Index++;
			if(index>3)index=0;
			if(Index>4)Index=1;
			$(".banner-img li").eq(index).addClass("choose").siblings().removeClass("choose");
			$(".banner-btn li").eq(Index).addClass("choose").siblings().removeClass("choose");
		},4000)

	})

})
})
})