//lineHeight:1.4, language:'en', timezone: 8, html: '%y年%M月%d日 %h:%m:%s'
// define(['knockout', 'jquery', './knockout.mapping', "./lunarDate"], function (ko, $, koMapping, lunarDate) {
define(['knockout', 'jquery', 'ko-mapping', "./lunarDate"], function (ko, $, koMapping, lunarDate) {
    function DigitalClock(data) {
		//mapping
		koMapping.fromJS(data, {}, this); 
        //element      
        var ele = $('<div></div>').css({ width: '100%', height: '100%', position: 'relative', color: '#fff' })
            .attr('data-bind', "style:{'font-size': view_fontSize, 'line-height': lineHeight}, html: view_html");
        this.element = ele[0];//要显示的dom元素     
        //now
        var now = ko.observable(new Date());
        //内容
        this.view_html = ko.computed(function () {
            var date = now();
            var offset =date.getTimezoneOffset();
            //console.log(offset);
            date = new Date(date.getTime() + (offset + this.timezone()*60) * 60 * 1000);
            var temp = this.html();
            var lang = this.language();
            var hour = date.getHours();
            var hour_12 =hour;
            if (hour > 12)
                hour_12 = hour - 12;
            return temp
                .replace(/<\s*br\s*\/>$/, '')
                .replace(/%y/g, date.getFullYear())
                .replace(/%Mw|%MW/g, getMonth(lang, date))
                .replace(/%ML/g, lunarDate.month)
                .replace(/%YL/g, lunarDate.tg + lunarDate.dz + lunarDate.year)
                .replace(/%DL/g, lunarDate.day)
                .replace(/%M/g, fix(date.getMonth() + 1))
                .replace(/%d/g, fix(date.getDate()))
                .replace(/%H/g, fix(hour))
                .replace(/%h/g, fix(hour_12))
                .replace(/%m/g, fix(date.getMinutes()))
                .replace(/%s/g, fix(date.getSeconds()))             
                .replace(/%w/g, getWeek(lang, date))
                .replace(/%am/g, getAM(lang, hour < 12))
            ;
        }, this);
        //行数
        var lineCount = ko.computed(function () {
            var count = 1;
            var html = this.view_html();
            html.replace(/<[ ]*br/g, function (data) {
                count++;
            });
            return count;
        }, this);
        //字大小
        this.view_fontSize = ko.computed(function () {
            return "1em"
            // return this.height() / this.lineHeight() / lineCount() + 'px';
        }, this);
        //timer
        this._timer = window.setInterval(clock, 1000, now);
    };
    function clock(now) {
        now(new Date());
    }
    var month = {
        cn: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月' ],
        en: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
        'pt-BR':["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        fr: ['Jan.', 'Fev.', 'Mar.', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Aou.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
        es: ['En.','Febr.','Mzo.','Abr.','My.','Jun.','Jul.','Agto.','Sept.','Oct.','Nov.','Dic.']

    }
    function getMonth(lang, date) {
        return month[lang][date.getMonth()];
    }
    var week = {
        cn: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', ],
        en: ['Sun.', 'Mon.', 'Tues.', 'Wed.', 'Thur.', 'Fri.', 'Sat.'],
        'pt-BR':["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
		 fr: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
        es:['Lun.','Mart.','Miérc.','Juev.', 'Vier.', 'Sáb.','Dom.']
    }
    function getWeek(lang, date) {
        return week[lang][date.getDay()];
    }
    var ampm = {
        cn: ['上午', '下午'],
        en: ['AM', 'PM'],
		'pt-BR':['manhã', 'tarde'],
		 fr:['mat.','apr-mid.'],
        es:['am','pm']
    }
    function getAM(lang, am) {
        var index = am ? 0 : 1;
        return ampm[lang][index];
    }

    //补0
    function fix(x) { return x < 10 && x >= 0 ? x = '0' + x : x; }
    return DigitalClock;
});