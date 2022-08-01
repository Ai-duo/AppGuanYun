// speed: 15, html: '<p>请填写</p>'
define(['knockout', 'jquery', 'ko-mapping'], function (ko, $, koMapping) {
    //速度
    //var rate = 25;
    function NewSingleLineText(data, layer) {
        //fixbug lineHeight
        if (!data.lineHeight)
            data.lineHeight = 1.0

       koMapping.fromJS(data, {}, this);
        //replaced html
        this.replacedHtml = ko.computed(function () {
            var temp = this.html();
            temp = temp.replace(/<p>|<\/p>/g, '');
            temp = '<span>' + temp + '</span>';
            //console.log(temp);
            return temp;
        }, this);
        //compute content width 文本，字体大小 都影响它
        this.contentWidth = ko.computed(function () {
            var size = this.height() * this.layer.program['viewScale']();
            var html = this.replacedHtml();
            var content = $(html).css('font-size', size + 'px');
            var wrap = $('<div></div>').css({
                width: '10000000px'
            }).append(content).appendTo('body');
            var width = content.width();
            wrap.remove();
            //console.log(width);
            return width;
        }, this);
        this.view_contentWidth = ko.computed(function () {
            return this.contentWidth() + 'px';
        }, this);
        //视图元素 font-size
        this.viewFontSize = ko.computed(function () {
            var r = this.height() / this.lineHeight() * this.layer.program['viewScale']() + 'px';
            return r;
        }, this);
        //起始位置
        this.beginPx = ko.computed(function () {
            return this.width() * this.layer.program['viewScale']();
        }, this);
        //element
        var borderStyle = "none"
        if (this.isBoder) {
            borderStyle = this.border() + "px solid " + this.borderColor()
        }
        var ele = $('<div></div>').css({
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            border: borderStyle

        });
        this.element = ele[0]; //要显示的dom元素
        ele.append($('<div></div>').css({
                position: 'relative',
                color: '#fff'
            })
            .attr('data-bind', "singleMove: 1, html: replacedHtml, style:{'font-size': viewFontSize, 'line-height': lineHeight,  width:view_contentWidth }"));
    }
    NewSingleLineText.prototype = new Source(); //继承
    NewSingleLineText.prototype.remove = function () {
        Source.prototype.remove.call(this); //调用父类remove
        //window.clearInterval(this._timer);
    };

    function move(viewModel, element) {
        var begin = viewModel.beginPx(); //起始位置
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
    return NewSingleLineText;
});