// speed: 15, html: '<p>请填写</p>'
define(['knockout', 'jquery', 'ko-mapping'], function (ko, $, koMapping) {
    function SingleLineText(data) {
		//mapping
		koMapping.fromJS(data, {}, this); 
        //replaced html
        console.log(8888888888888)
        this.replacedHtml =ko.computed(function(){
            var temp = this.html();
            temp = temp.replace(/<p>|<\/p>/g, '');
            temp = '<span>' + temp + '</span>';
            //console.log(temp);
            return temp;
        },this);
        //compute content width 文本，字体大小 都影响它
        this.contentWidth = ko.computed(function () {
            var size = this.height() ;
            var html = this.replacedHtml();
            var content = $(html).css('font-size',size+'px');
            var wrap = $('<div></div>').css({ width: '1000000px', position:'absolute', display:'block', opacity:0}).append(content).appendTo('body');
            var width = content.width();
			//wrap.text(width);
            wrap.remove();
            //console.log(width);
            return width;
        }, this);
        this.view_contentWidth = ko.computed(function () {
            return this.contentWidth() + 'px';
        }, this);
        //视图元素 font-size
        this.viewFontSize = ko.computed(function () {
            var r = this.height()  + 'px';
            return r;
        }, this);
        //起始位置
        this.beginPx = ko.computed(function () {
            return this.width() ;
        }, this);
        //element      
        var ele = $('<div></div>').css({ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' });
        this.element = ele[0]; //要显示的dom元素
        ele.append($('<div></div>').css({ position: 'relative', color: '#fff', 'line-height': 1, left: this.width() })
            .attr('data-bind', "singleMove: 1, html: replacedHtml, style:{'font-size': viewFontSize,  width:view_contentWidth }"));
    }

    function move(viewModel, element) {
        var begin = viewModel.beginPx();//起始位置
        if (viewModel._left < -viewModel.contentWidth())
            viewModel._left = begin;
        else
            viewModel._left--;
        element.style.left = viewModel._left + 'px';
        //$(element).scrollLeft(viewModel._left);
    }
    //bind
    ko.bindingHandlers.singleMove = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                // This will be called when the element is removed by Knockout or
                // if some other part of your code calls ko.removeNode(element)
                console.log("destroy");
                window.clearInterval(viewModel._timer);
            });
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var width = viewModel.width();
            var speed = viewModel.speed();
            var r_speed = speed * 1000 / width;
            viewModel._left = viewModel.beginPx(); //起始位置
            window.clearInterval(viewModel._timer);
            viewModel._timer = window.setInterval(move, r_speed, viewModel, element);
        }
    }
    return SingleLineText;
});
