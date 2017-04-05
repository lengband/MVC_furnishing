define(["mvc","jquery","css!./news.css"],function(){
	MVC
.addView("home.news",function(model,template){
	var dom = $(".news");
	var data = model.get("home.news");
	// console.log(data);
	var tpl = [
		'<div class="hr"></div>',
			'<h2>{#title#}</h2>',
			'<div class="left common">',
				'<p>{#content#}</p>',
			'</div>',
			'<ul class="right common">',
				'{#rightLi#}',
			'</ul>',
			'<ul class="bottom clear">',
				'{#bottomLi#}',
			'</ul>',
			'<div class="clear"></div>'
	].join("");
	var rightLiTpl = '<li>{#index#}</li>';
	var bottomLiTpl = 
			   ['<li><img src="modules/home/news/{#img#}" alt="" /><p class="p1">{#title#}</p><p class="p2">{#content#}</p></li>'
				].join("");

	//定义空字符串
	var html = rightLi = bottomLi = "";

	data.list.forEach(function(v,i){
		rightLi += template(rightLiTpl,{
			index:v
		})
	})
	data.intro.forEach(function(obj,index){
		bottomLi += template(bottomLiTpl,obj);
	})
	// console.log(bottomLi);
	html = template(tpl,{
		title : data.title,
		content : data.content,
		rightLi : rightLi,
		bottomLi : bottomLi
	})
	// console.log(html);
	dom.html(html);
	return dom;
})
.addCtrl("home.news",function(model,view,observer){
	observer.regist("homeComplete",function(){
		view.create("home.news");
	})
})
})