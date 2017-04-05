// 定义一个闭包
(function (window) {
	var MVC = {};

	// 定义模型模块
	var M = {};
	MVC.Model = {
		/**
		 * 读取数据点的方法
		 * @str 	读取数据层级路径
		 * eg：
		 * 		M = {a: {b: {c: {d: 123}}}}
		 * 		MVC.Model.get('a.b.c.d')
		 **/
		get: function (str) {
			// 解析这个路径 
			var path = str
				// 如果这个路径以M.或者.开头,我们删除它们
				.replace(/^M\.|^\./, '')
				// 根据.切割字符串
				.split('.');
			// 定义结果,要从M变量最外层开始读，
			var result = M;
			// ["a", "b", "c"] 根据数组一级一级读取数据
			for (var i = 0; i < path.length; i++) {
				// 第一次遍历 path[i]是"a",要判断M包含不包含a属性
				if (result[path[i]] === undefined) {
					// 如果不存在, 值不是一个对象，值是一个null，不需要继续遍历了
					return null;
				}
				// 更新result 
				result = result[path[i]];
				// 如果此时resukt是123,下一次遍历的时候，result[path[i]]依然是undefined
			}
			return result;
		},
		/**
		 * 更新或者添加数据的方法
		 * @key 	表示一个属性层级的路径
		 * @value 	表示值
		 * eg：
		 * 		add('a.b.c', {d: 111})
		 * 	看M中是否有a属性，如果没有，对a属性赋值对象 {a: {}}
		 * 	看M.a中是否有b属性，如果没有，对b属性进行赋值 {a: {b: {}}}
		 * 	c属性是最后一次了，我们不需要再遍历了，直接赋值，因此不需要遍历最后一次
		 * 		M = {a: {b: c: {d: 111}}}
		 **/
		add: function (key, value) {
			// 将路径转化成数组
			var path = key
				// 如果这个路径以M.或者.开头,我们删除它们
				.replace(/^M\.|^\./, '')
				// 根据.切割字符串
				.split('.');
			// 每一次遍历要缓存上一次的结构
			var result = M;
			// 遍历数组，赋值
			// ["a", "b", "c"] 根据数组一级一级读取数据
			// 判断属性值是否存在，不存在赋值一个对象
			for (var i = 0; i < path.length - 1; i++) {
				// 属性名称是path[i]，
				// 对象是result，
				// 属性值是result[path[i]]
				// 如果属性值存在，是一个值类型的数据，抛出错误
				if (
					// 如果属性值存在，是一个值类型的数据
					(result[path[i]] !== undefined && typeof result[path[i]] !== 'object') || 
					// 值是一个null
					result[path[i]] === null
				) {
					// 抛出错误，通知用户
					throw new Error(typeof result[path[i]] + '类型的数据，不能添加属性，值是:' + result[path[i]])
				}
				// 判断属性值是否存在，不存在赋值对象
				if (result[path[i]] === undefined) {
					// 不存在赋值对象
					result[path[i]] = {};
				}
				// 缓存当前属性值
				result = result[path[i]]
			}
			// 对最后一个属性赋值
			result[path[i]] = value;
			// 链式调用
			return this;
		}
	}
	// 定义视图模块
	var V = {};
	MVC.View = {
		/**
		 * 添加视图创建方法
		 * @id 	视图的id
		 * @fn 	视图的创建函数
		 **/
		add: function (id, fn) {
			// 将函数存储在容器中
			V[id] = fn;
			// 返回当前对象
			return this;
		},
		/**
		 * 执行创建视图的方法
		 * @id 	视图的id
		 **/
		create: function (id) {
			// 判断是否存在
			// if (V[id]) {
			// 	V[id]();
			// }
			// 如果存在立即执行
			// 可以传递模型，模板方法
			// return可以在外界使用视图方法执行完毕时候返回的dom
			if (V[id]) {
				var dom = V[id].call(MVC, MVC.Model, MVC.template);
				return dom;
			}
			// return V[id] && V[id].call(MVC, MVC.Model, MVC.template);
			// return this;
		}
	}
	// 定义控制器模块
	var C = {};
	MVC.Controller = {
		/**
		 * 添加控制器
		 * @id 		控制器的id
		 * @fn 		控制器的方法
		 **/
		add: function (id, fn) {
			// 将fn存储
			C[id] = fn;
			// 链式调用返回this
			return this;
		},
		/**
		 * 初始化所有的控制器的
		 **/
		init: function () {
			// 将存储所有控制器都执行
			for (var i in C) {
				// 执行每一个控制器
				C[i].call(MVC, MVC.Model, MVC.View, MVC.Observer);
			}
		}
	};
	/**
	 * 定义格式化模板的方法
	 * @str 	模板字符串
	 * @data 	模板数据
	 * return 	格式化后的模板字符串
	 **/ 
	MVC.template = function (str, data) {
		// 调用替换字符串方法
		// () {} [] ^ $ . \ + * ? -
		return str.replace(/\{#([\w\.]+)#\}/g, function (match, $1) {
			// console.log(match);
			// console.log($1);
			// 根据捕获组$1去data里面寻找数据，并替换
			// 我们要屏蔽undefined
			// return data[$1] === undefined ? '' : data[$1];
			// console.log($1)
			// 第一步 将$1按点切割，得到一个数组，
			var path = $1.split('.');
			var result = data;
			// console.log(result);
			// 第二步 遍历数组，获取数据
			for (var i = 0; i < path.length; i++) {
				// 判断数据是否存在，不存在就无法继续遍历了
				if (undefined === result[path[i]]) {
					// 不存在就无法继续遍历了，我们不能搜索到结果，返回空字符串
					return '';
				}
				// 缓存数据
				result = result[path[i]]
			}
			// 第三步 将数据返回
			return result;
		})
	};
	// 整理观察者模式
	var __message = {};
	MVC.Observer = {
		/**
		 * 用来注册消息
		 * @type 	消息的名称
		 * @fn 		回调函数	
		 **/
		regist: function (type, fn) {
			// 将回调函数注册到__message变量中
			// 对于message消息管道来说，我们要根据type开辟不同的存储空间，来存储fn（放在数组中）
			// 判断有没有type类型的存储空间
			if (__message[type]) {
				// 存储回调函数
				__message[type].push(fn);
			} else {
				// 开辟新的存储空间存储回调函数
				__message[type] = [fn];
			}
		},
		/**
		 * 用来触发消息
		 * @type 	消息的名称
		 * @data 	传递的数据
		 **/
		fire: function (type, data) {
			// 将类对象转化成数组的最快捷方式，调用数据slice方法执行它
			var arg = [].slice.call(arguments, 0)
			// 在消息管道中，寻找有没有该类型的消息，所以遍历消息管道
			if (__message[type]) {
				// __message[i] 是一个数组，遍历这个数组并执行
				for (var i = 0; i < __message[type].length; i++) {
					// 我们要将自定义数据传递进来
					// __message[type][i](data)
					// 我们想实现jqyery的Callbacks触发方式
					// call 将参数意义列举进来，apply将参数作为数组传递
					__message[type][i].apply(null, arg)
				}
			}
		}
	};
	// 优化添加模型方法
	MVC.addModel = function (id, data) {
		// 调用MVC.Model.add
		MVC.Model.add(id, data);
		// 返回this链式调用
		return this;
	}
	// 读取模型数据
	MVC.get = function (id) {
		// 返回数据的值
		return MVC.Model.get(id)
	}
	// 优化添加视图方法
	MVC.addView = function (id, fn) {
		MVC.View.add(id, fn);
		return this;
	}
	// 创建视图
	MVC.create = function (id) {
		// 为了在外界访问dom，我们可以将方法的结果返回
		return MVC.View.create(id)
	}
	MVC.addCtrl = function (id, fn) {
		MVC.Controller.add(id, fn);
		return this;
	}
	// 封装install方法，在页面加载完成我们初始化所有控制器
	MVC.install = function () {
		// 加载完成
		$(function () {
			// 初始化所有控制器
			MVC.Controller.init();
		})
	}
	// 也可以对jquery进行拓展
	// $.extend({
	// 	template: MVC.template
	// })
	// 将MVC暴漏出来
	window.MVC = MVC;
})(window)