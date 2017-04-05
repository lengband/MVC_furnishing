// 定义模型，视图，控制器
MVC
// 数据有异步请求获取，现在就没什么可以添加的了
// .addModel('header', {
// 		"icon": [
// 			{
// 				"img": "icon-rss.png",
// 				"href": "index.html"
// 			},
// 			{
// 				"img": "icon-dribble.png",
// 				"href": "index.html"
// 			},
// 			{
// 				"img": "icon-twitter.png",
// 				"href": "index.html"
// 			},
// 			{
// 				"img": "icon-googleplus.png",
// 				"href": "index.html"
// 			},
// 			{
// 				"img": "icon-dribble.png",
// 				"href": "index.html"
// 			},
// 			{
// 				"img": "icon-flickr.png",
// 				"href": "index.html"
// 			},
// 			{
// 				"img": "icon-tumblr.png",
// 				"href": "index.html"
// 			}
// 		],
// 		"nav": [
// 			{
// 				"title": "Home",
// 				"href": "index.html"
// 			},
// 			{
// 				"title": "Portfolio",
// 				"href": "portfolio.html",
// 				"list": [
// 					{"title": "Portfolio 5 Columns", "href": "portfolio-columns.html"}, 
// 					{"title": "Portfolio Post", "href": "portfolio-post.html"}
// 				]
// 			},
// 			{
// 				"title": "Blog", 
// 				"href": "blog.html",
// 				"list": [
// 					{"title": "Blog Post", "href": "blog-post.html"}
// 				]
// 			},
// 			{
// 				"title": "Pages", 
// 				"href": "pages.html",
// 				"list": [
// 					{"title": "Full Width Page", "href": "pages.html"}, 
// 					{"title": "Page with Sidebar", "href": "pages.html"}
// 				]
// 			},
// 			{
// 				"title": "Styles", 
// 				"href": "styles.html",
// 				"list": [
// 					{"title": "Buttons Boxes Images", "href": "styles.html"}, 
// 					{"title": "Columns", "href": "styles.html"}, 
// 					{"title": "Typography", "href": "styles.html"}, 
// 					{"title": "Tabs Toggle Tables", "href": "styles.html"}, 
// 					{"title": "Testimonials", "href": "styles.html"}
// 				]
// 			},
// 			{
// 				"title": "Contact",
// 				"href": "contact.html"
// 			}
// 		]
// 	})
// 构建视图
.addView("header",function(model,template){
	var dom = $("#header");
	var data = model.get("header");
	var tpl = [
		"<div class='inner'>",
			"<div class='logo-container'>",
				"<img src='modules/header/logo.png' class='logo' />",
			"<ul>{#iconUl#}</ul>",
			"</div>",
			"<ul class='nav'>{#navHtml#}</ul>",
		"</div>"
	].join("");
	var iconLiTpl = "<li><a href='{#href#}'><img src = 'modules/header/{#img#}'</a></li>"
	//定义内层li(竖直的li)和外层li(横着的li)用同一个模板
	var navItemTpl = "<li class='{#cls#}'><a href='{#href#}'>{#title#}</a>{#childList#}</li>";
	//定义一个能让innerNavHtml重置的ul模板
	var innerUlTpl = "<ul class = 'inner-nav'>{#navHtml#}</ul>";
	var html = iconHTML = navHtml = innerNavHtml = "";
	//icon模板渲染
	data.icon.forEach(function(obj,index){
		iconHTML += template(iconLiTpl,obj)
	})
	//两层li模板渲染
	data.nav.forEach(function(obj,index){
		//先判断内层li存在不存在
		if(obj.list){
			innerNavHtml = '';
			obj.list.forEach(function(o,i){
				innerNavHtml += template(navItemTpl,{
					"cls":"inner-nav-item",
					"href":o.href,
					"title":o.title,
					"childList":""
				})
			})
			//重置innerNavHtml,使之变成ul列表
		innerNavHtml = template(innerUlTpl,{"navHtml":innerNavHtml});
		}else{
			innerNavHtml = "";
		}
		
		//渲染两层li
		navHtml += template(navItemTpl,{
			"cls":"nav-item",
			"href":obj.href,
			"title":obj.title,
			"childList":innerNavHtml
		})
	})
//渲染总模板
	html = template(tpl,{
		"iconUl":iconHTML,
		"navHtml":navHtml
	})
	dom.html(html);
	return dom;
})



.addCtrl("header",function(model,view,observer){
	$.get("data/header.json",function(res){
		if(res&&res.errno===0){
			model.add("header",res.data);
			init();
		}
	})
		function init(){
			var dom = view.create("header");
			dom.delegate(".nav-item","mouseenter",function(){
				$(this).find("ul").stop().slideDown(200)}).delegate(".nav-item","mouseleave",function(){
					$(this).find("ul").stop().slideUp(200)
				})
		}

})