// speed: 15, lineHeight: 1.4, center: true, html: '<p>请填写</p>'
define(['knockout', 'jquery', 'ko-mapping'], function (ko, $, koMapping) {
    function MultiLineText(data,temperature,humidity) {
        //mapping
		koMapping.fromJS(data, {}, this); 
        //page
        this.page = ko.observable(0);
        this.pageCount = ko.observable(0);
        //paragraphs
        this.paragraphs = ko.computed(function () {
			var html =this.html();
			//temperature
			var t = temperature();
			if(t > 254) {
			    html = html.replace(/%c2/g, "--");
                html = html.replace(/%c1/g, "--");
                html = html.replace(/%c/g, "--");
                html = html.replace(/%f2/g, "--");
                html = html.replace(/%f1/g, "--");
                html = html.replace(/%f/g, "--");
			}else{
                html = html.replace(/%c2/g, t.toFixed(2));
                html = html.replace(/%c1/g, t.toFixed(1));
                html = html.replace(/%c/g, t.toFixed(0));
                var f = 32 + t*1.8;
                html = html.replace(/%f2/g, f.toFixed(2));
                html = html.replace(/%f1/g, f.toFixed(1));
                html = html.replace(/%f/g, f.toFixed(0));
            }

			//humidity
			var h = humidity();
			if(h<0)
			    html = html.replace(/%h/g, "--");
			else
			    html = html.replace(/%h/g, Math.round(h));
			
            var arr = html.match(/<\s*p(\s[^>]*)?>[\s\S]*?<\s*\/p\s*>/g);
            if (this.pageCount != arr.length)
                this.pageCount(arr.length);
            return arr;
        }, this)
        //view Line height
        this.view_fontSize = ko.computed(function () {
            return '1em';
        }, this);
        //element      
        var ele = $('<div></div>').css({ width: '100%', height: '100%', position: 'relative', color: '#fff', align:data.align, 'background-color':data.backgroundColor })
            .attr('data-bind', "foreach: paragraphs, style:{'font-size': view_fontSize}");
        var template = $('<div></div>').attr('data-bind', 'multiText_html: 1,  multiText_show: 1, multiText_center: 1');
        ele.append(template);
        this.element = ele[0]; //要显示的dom元素

        //timer
        ko.computed(function () {
            //console.log('change speed');
            var interval = this.speed() * 1000;
            window.clearInterval(this._timer);
            this._timer = window.setInterval(this.nextPage.bind(this), interval);
        }, this);
    }

    //翻页
    MultiLineText.prototype.nextPage = function () {
        var next = this.page() + 1;
        next >= this.pageCount() ? this.page(0) : this.page(next);
        //console.log('next');
    }
    MultiLineText.prototype.clickNext = function () {
        window.clearInterval(this._timer);
        this._timer = window.setInterval(this.nextPage.bind(this), this.speed() * 1000);
        this.nextPage();
    }

    //bind
    ko.bindingHandlers.multiText_html = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            //console.log('init');
            var p = $(viewModel).css({ margin: 0, padding: 0 });
            p.appendTo(element);
            //console.log('init');
        }
    }
    ko.bindingHandlers.multiText_show = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var ele = $(element);
            var index = bindingContext.$index();
            var page = bindingContext.$parent.page();
            //显示
            if (index == page)
                ele.show();
            else
                ele.hide();
            //console.log('index: %d, page: %d', index, page);
        }
    }
    ko.bindingHandlers.multiText_center = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var ele = $(element);
            //关联height变化
            var h = bindingContext.$parent.height();
            //关联比例变化
            var s = 1;
            //linheight
            var lineHeight = bindingContext.$parent.lineHeight();
            ele.css({ 'line-height': lineHeight });
            var center = bindingContext.$parent.center();
            //居中
            if (center) {
                var windowHeight = ele.parent().parent().height();
                var contentHeight = ele.height();
                //fix ko bug
                if (contentHeight == 0) {
                    var copy = ele.children().clone();
                    var wrap =$('<div><div>').css({ position: 'absolute' }).width(bindingContext.$parent.width()).appendTo('body').append(copy);
                    contentHeight = copy.height();
                    wrap.remove();
                    console.log('fix');                    
                }
                var top = (windowHeight - contentHeight) / 2;
                ele.css({ position: 'relative', 'top': top + 'px' });
            } else
                ele.css({ 'top': 0 });
            //console.log('center', center);
        }
    }

    //ko.bindingHandlers.multiText = {
    //    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    //        //console.log('init');
    //        var p = $(viewModel).css({ margin: 0, padding: 0 });
    //        p.appendTo(element);
    //    },
    //    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    //        var ele = $(element);
    //        var index = bindingContext.$index();
    //        var page = bindingContext.$parent.page();
    //        var lineHeight = bindingContext.$parent.lineHeight();
    //        ele.css({ 'line-height': lineHeight });           
    //        //居中
    //        if (bindingContext.$parent.center()) {
    //            var windowHeight = bindingContext.$parent.height();
    //            var contentHeight = $(element).height();
    //            //fix ko bug
    //            if (contentHeight == 0) {
    //                var copy = ele.children().clone();
    //                copy.width(bindingContext.$parent.width());
    //                $('body').append(copy);
    //                contentHeight = copy.height();
    //                copy.remove();
    //                console.log('fix');
    //            }
    //            var top = (windowHeight - contentHeight) / 2;
    //            ele.css({ position: 'relative', 'top': top + 'px' });
    //        }
    //        //显示
    //        if (index == page)
    //            ele.show();
    //        else
    //            ele.hide();
    //        //console.log('index: %d, page: %d', index, page);
    //    }
    //}
    return MultiLineText;
});