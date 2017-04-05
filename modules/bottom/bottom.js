define(["mvc","jquery","css!./bottom.css"],function(){
	MVC
.addView("bottom",function(model,template){

	var dom = $(".bottom");
	var html = "<div class='dibu'>© 2011 Zeences Design. All Right Reserved.</div>";
	dom.html(html);
	return dom;

}).addCtrl("bottom",function(model,view,observer){
	view.create("bottom");
})
})