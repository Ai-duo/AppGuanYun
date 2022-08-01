// html: '',time: '',lineHeight:1.4,
define(['knockout', 'jquery', 'ko-mapping'], function (ko, $, koMapping) {
    function Countdown(data) {
        //mapping
		koMapping.fromJS(data, {}, this); 
        //行数
        var lineCount = ko.computed(function () {
            var count = 1;
            var html = this.html().replace(/<\s*br\s*\/>$/, '');
            html.replace(/<[ ]*br/g, function (data) {
                count++;
            });
            return count;
        }, this);
        //now
        var now = ko.observable(new Date());
        //内容
        this.view_html = ko.computed(function () {
            var time = this.time().replace(/-/g, '/');
            var html = this.html().replace(/<\s*br\s*\/>$/, '');
            var def = new Date(time).getTime() - now().getTime();
            def = Math.floor(def / 1000);
            var d, h, m, s;
            var hasDay = html.indexOf('%d') != -1;
            var hasHour = html.indexOf('%h') != -1;
            var hasMin = html.indexOf('%m') != -1;
            var hasSec = html.indexOf('%s') != -1;
            if (hasDay) {
                d = Math.floor(def / 60 / 60 / 24);
                html = html.replace(/%d/g, fix(d));
            }
            if (hasHour) {
                h = Math.floor(def / 60 / 60)
                if (hasDay)
                    h %= 24;
                html = html.replace(/%h/g, fix(h));
            }
            if (hasMin) {
                m = Math.floor(def / 60);
                if (hasHour)
                    m %= 60;
                else if (hasDay)
                    m -= d * 24 * 60;
                html = html.replace(/%m/g, fix(m));
            }
            if (hasSec) {
                s = def;
                if (hasMin)
                    s %= 60;
                else if (hasHour) {
                    s -= h * 60 * 60;
                    if (hasDay)
                        s -= d * 24 * 60 * 60;
                }
                else if (hasDay)
                    s -= d * 24 * 60 * 60;
                html = html.replace(/%s/g, fix(s));
            }
            return html;
        }, this);
        //字大小
        this.view_fontSize = ko.computed(function () {
            return this.height() / this.lineHeight() / lineCount() + 'px';
        }, this);
        //element      
        var ele = $('<div></div>').css({ width: '100%', height: '100%', position: 'relative', color: '#fff' })
            .attr('data-bind', "style:{'font-size': view_fontSize, 'line-height': lineHeight}, html: view_html");
        this.element = ele[0];//要显示的dom元素    
        //timer
        this._timer = window.setInterval(clock, 1000, now);
    }
    function clock(now) {
        now(new Date());
    }

    //补0
    function fix(x) { return x < 10 && x >= 0 ? x = '0' + x : x; }

    return Countdown;
});