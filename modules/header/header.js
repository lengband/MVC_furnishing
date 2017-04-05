define(["mvc","jquery","css!./header.css"],function(MVC1,jq,css){
	// 定义模型，视图，控制器
	// console.log(css) //underfined
MVC1
.addView("header",function(model,template){
	var dom = $("#header");
	var data = model.get("header");
	var tpl = [
		"<div class='inner'>",
			"<div class='logo-container'>",
				"<img src='modules/header/logo.png' class='logo' />",
				"<ul>{#iconUl#}</ul>",
			"</div>",
			'<ul class="nav module">{#navHtml#}</ul>',
		"</div>"
	].join("");
	// 如果模板需要用模型中的数据渲染，尽量让渲染的变量名称与模型中的数据属性名称一致
	var iconLiTpl = '<li><a href="{#href#}"><img src="modules/header/{#img#}" alt="" /></a></li>';
	// 定义每一个导航成员模板 
	// 我们想将外层li和内层的li复用同一个模板
	var navItemTpl = '<li class="{#cls#}"><a href="{#href#}">{#title#}</a>{#childList#}</li>';
	var innerUlTpl = '<ul class="inner-nav">{#navHtml#}</ul>';
	// 定义字符串
	var html = iconHTML = navHtml = innerNavHtml = '';
	// 格式化模板
	// 遍历icon数据
	data.icon.forEach(function (obj, index) {
		// 渲染输出iconUl结果
		iconHTML += template(iconLiTpl, obj);
	})
	// 渲染nav用data中的nav数据，是一个数组
	// 遍历最外层的li
	data.nav.forEach(function (obj, index) {
		// 判断obj是否有list属性值，有的话，我们要渲染下拉框
		if (obj.list) {
			// 清空保证当前innerNavHtml变量没有内容
			innerNavHtml = ''
			// list是一个数组，我们还需要遍历
			obj.list.forEach(function (o, i) {
				// 得到的结果 '<li><a href=""></a></li><li><a href=""></a></li>'
				innerNavHtml += template(navItemTpl, {
					cls: 'inner-nav-item',
					href: o.href,
					title: o.title,
					childList: ''
				})
			})
			// 我们要用格式化后的innerNavHtml去格式化innerUlTpl模板得到完整列表，我们重新定义innerNavHtml
			innerNavHtml = template(innerUlTpl, {navHtml: innerNavHtml})
		} else {
			innerNavHtml = '';
		}
		// 渲染li
		navHtml += template(navItemTpl, {
			cls: 'nav-item',
			href: obj.href,
			title: obj.title,
			childList: innerNavHtml
		})
	})
	// 格式化tpl模板
	html = template(tpl, {
		// 添加icon字符串
		iconUl: iconHTML,
		// 渲染导航模块
		navHtml: navHtml
	})
	// 渲染到页面中
	dom.html(html);
	// 返回dom
	// console.log(data)
	return dom;
	
})

.addCtrl('header', function (model, view, observer) {
		var init = function(){
			var dom = view.create('header');
		dom.delegate(".nav-item","mouseenter",function(){
			$(this).find("ul").stop().slideDown(200)
		}).delegate(".nav-item","mouseleave",function(){
			$(this).find("ul").stop().slideUp(200);
		})
	}
	$.get('data/header.json', function (res) {
		// console.log(res)
		// 请求数据成功，将数据存储在模型中
		if (res && res.errno === 0) {
			// 将data存储
			model.add('header', res.data);
			// 存储成功了。我们就可以渲染页面了
			init();
		}
	})
})
})