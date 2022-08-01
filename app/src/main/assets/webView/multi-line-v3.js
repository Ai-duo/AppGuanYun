// speed: 15, lineHeight: 1.4, center: true, html: '<p>请填写</p>'
// define(['knockout', 'jquery', './knockout.mapping', "./lunarDate"], function (ko, $, koMapping, lunarDate) {
    define(['knockout', 'jquery', 'ko-mapping', "./lunarDate"], function (ko, $, koMapping, lunarDate) {
    function MultiLineTextV3(data, temperature, humidity, screenWidth, screenHeight) {
        // console.log(333,data, temperature, humidity)
        if (screenWidth)
            data.width = screenWidth
        if (screenHeight)
            data.height = screenHeight
        //mapping
        koMapping.fromJS(data, {}, this);
        // 
        console.log(this.lineHeight(), screenHeight, this.width(), this.height())

        //page
        this.page = ko.observable(0);
        this.pageCount = ko.observable(0);
        var now = ko.observable(new Date());
        //paragraphs
        this.paragraphs = ko.computed(function () {
            var date = now();
            var html = this.html();
            //temperature
            var t = temperature();
            var f = 32 / 1 + t / 1 * 1.8;
            if (t > 254) {
                html = html.replace(/%c2/g, "--");
                html = html.replace(/%c1/g, "--");
                html = html.replace(/%c/g, "--");
                html = html.replace(/%f2/g, "--");
                html = html.replace(/%f1/g, "--");
                html = html.replace(/%f/g, "--");
            } else {
                html = html.replace(/%c2/g, t.toFixed(2));
                html = html.replace(/%c1/g, t.toFixed(1));
                html = html.replace(/%c/g, t.toFixed(0));

                html = html.replace(/%f2/g, f.toFixed(2));
                html = html.replace(/%f1/g, f.toFixed(1));
                html = html.replace(/%f/g, f.toFixed(0));
            }

            html = html.replace(/%T2/g, t.toFixed(2) + '℃');
            html = html.replace(/%T1/g, t.toFixed(1) + '℃');
            html = html.replace(/%T/g, t.toFixed(0) + '℃');
            html = html.replace(/%t2/g, f.toFixed(2) + '℉');
            html = html.replace(/%t1/g, f.toFixed(1) + '℉');
            html = html.replace(/%t/g, f.toFixed(0) + '℉');
            var h = humidity();
            html = html.replace(/%HR/g, Math.round(h) + '%');
            html = html.replace(/%ws/g, '10m/s');
            html = html.replace(/%wd/g, 'E');
            html = html.replace(/%ns/g, '20db');
            html = html.replace(/%pm2/g, '100μg/m³');
            html = html.replace(/%pm10/g, '20μg/m³');
            if (lunarDate) {
                html = html.replace(/%YL/g, lunarDate.tg + lunarDate.dz + lunarDate.year)
                html = html.replace(/%DL/g, lunarDate.day)
                html = html.replace(/%ML/g, lunarDate.month)
            }
            html = html.replace(/%YG/g, date.getFullYear())
            html = html.replace(/%DG/g, fix(date.getDate()))
            html = html.replace(/%MG/g, fix(date.getMonth() + 1))
            html = html.replace(/%W/g, getWeek(date))
            //humidity
            if (h < 0)
                html = html.replace(/%h/g, "--");
            else
                html = html.replace(/%h/g, Math.round(h));
            // 去除<p></p>标签
            html = html.replace(/<p>/g, "")
            var arrP = html.split("</p>")
            html = arrP.join("")
            // var arr = html.match(/<\s*p(\s[^>]*)?>[\s\S]*?<\s*\/p\s*>/g);
            var arr = this.subsection(html)
            if (!arr) {
                this.html(html)
                arr = [this.html()];
            }
            if (this.pageCount != arr.length)
                this.pageCount(arr.length);
            return arr;
        }, this)
        //view Line height
        this.view_fontSize = ko.computed(function () {
            return '1em';
        }, this);
        //element      
        var ele = $('<div></div>').css({
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                color: '#fff',
                padding: 0,

            })
            .attr('data-bind', "foreach: paragraphs, style:{'font-size': view_fontSize, 'background-color': backgroundColor}");
        var template = $('<div></div>').css({
                width: '100%',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                padding: 0,
                margin: 0,
            }).attr('data-bind', 'multiTextv3_html: 1,  multiTextv3_show: 1, multiTextv3_center:1')
            .addClass("page")
        ele.append(template);
        this.element = ele[0]; //要显示的dom元素
        var speedOri = this.speed()
        //timer
        ko.computed(function () {
            var interval = (Math.ceil(this.height() / this.speed()) + this.intervalTime() / 1) / 1 * 1000;
            window.clearInterval(this._timer);
            if (speedOri != this.speed()) {
                clearTask()

                speedOri = this.speed()
                var next = this.page() + 1;
                next >= this.pageCount() ? this.page(0) : this.page(next);
            }
            this._timer = window.setInterval(this.nextPage.bind(this), interval);
        }, this);
    }
    // 切割
    MultiLineTextV3.prototype.subsection = function (html) {
        // var subHtml=html
        // subHtml = subHtml.replace(/<[^>]+>/g, "")
        // 获取到这段文本显示完整所需要的高度
        var div = document.createElement('div');
        var $div = $(div)
        $div.css({
            width: this.width() + "px",
            'line-height': this.lineHeight(),
            "word-break": "normal",
            border: "1px solid red",
            color: "black"
        })
        $div.html(html)
        document.querySelector('body').appendChild(div)
        var height = $div.height()
        $div.remove()
        // 根据获得的高度 来切割html
        var arr = []
        var pNum = Math.ceil(height / this.height())
        var length = html.length
        var amount = Math.floor(length / pNum)
        // var subArr=[]
        for (var i = 1; i < pNum + 1; i++) {
            var start = (i - 1) * (amount + 1)
            var end = i * (amount + 1) > html.length ? html.length : i * amount + 1
            arr.push(html.slice(start, end))
        }
        return arr
    }

    //翻页
    MultiLineTextV3.prototype.nextPage = function () {
        var next = this.page() + 1;
        next >= this.pageCount() ? this.page(0) : this.page(next);
    }
    MultiLineTextV3.prototype.clickNext = function () {
        if (this.page() != 0) {
            var interval = (Math.ceil(this.height() / this.speed()) + this.intervalTime() / 1) / 1 * 1000;
            clearTask()
            window.clearInterval(this._timer);
            this._timer = window.setInterval(this.nextPage.bind(this), interval);
            // this.nextPage()
            this.page(0)
        }

    }

    function replaceHtml(text) {
        var date = new Date();
        var hour = date.getHours();
        var hour_12 = hour;
        if (hour > 12)
            hour_12 = hour - 12;
        if (text) {
            // text = text.replace(/%H12/g, fix(hour_12))
            text = text.replace(/%H24/g, fix(hour))
            text = text.replace(/%M/g, fix(date.getMinutes()))
            text = text.replace(/%S/g, fix(date.getSeconds()))
        }
        return text

    }
    //bind
    ko.bindingHandlers.multiTextv3_html = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            //console.log('init');
            // var p = $(viewModel).css({
            //     margin: 0,
            //     padding: 0
            // });
            // p.appendTo(element);
            //console.log('init');
        }
    }

    var taskArr = []

    function clearTask() {
        if (taskArr && taskArr.length > 0) {
            taskArr.forEach(function (item) {
                if (item)
                    window.clearInterval(item)
            })
            taskArr = []
        }

    }
    ko.bindingHandlers.multiTextv3_show = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var ele = $(element);
            var eleOri = ele
            var index = bindingContext.$index();
            var page = bindingContext.$parent.page();
            var speed = bindingContext.$parent.speed();
            var paragraphs = bindingContext.$parent.paragraphs()
            var interval = bindingContext.$parent.intervalTime();
            //显示
            if (index == page) {
                console.log(page)
                clearTask()
                var text = paragraphs[index]
                var parentHeight = ele.parent().parent().height()
                ele.css({
                    top: parentHeight + "px"
                })
                ele.show()
                var task = window.setInterval(function () {
                    var newText = replaceHtml(text)
                    ele.html(newText)
                    parentHeight--
                    ele.css({
                        top: parentHeight + "px"
                    })
                    if (parentHeight === 0) {
                        window.clearInterval(task)
                        var starTime = new Date().getTime()
                        var taskInter = window.setInterval(function () {
                            var nowTime = new Date().getTime()
                            if (nowTime - starTime >= interval * 1000) {
                                window.clearInterval(taskInter)
                            } else {
                                var newText = replaceHtml(text)
                                ele.html(newText)
                            }
                        }, 1000)
                    }
                }, 1000 / speed)
                taskArr.push(task)
            } else {
                ele.hide();
            }
        }
    }
    ko.bindingHandlers.multiTextv3_center = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var ele = $(element);
            var center = bindingContext.$parent.center();
            //  console.log("水平居中变化", center, ele, ele.width(), ele.height())
            //  var w = bindingContext.$parent.width();
            //关联比例变化
            //  var s = bindingContext.$parent.layer.program['viewScale']();
            var lineHeight = bindingContext.$parent.lineHeight();
            ele.css({
                'line-height': lineHeight
            });
            if (center) {
                ele.css({
                    "text-align": "center"
                });

            } else {
                ele.css({
                    "text-align": "left"
                });

            }
        }
    }


    function clock(now) {
        now(new Date());
    }
    var month = {
        cn: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        'pt-BR': ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        fr: ['Jan.', 'Fev.', 'Mar.', 'Avr.', 'Mai', 'Juin', 'Juil.', 'Aou.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
        es: ['En.', 'Febr.', 'Mzo.', 'Abr.', 'My.', 'Jun.', 'Jul.', 'Agto.', 'Sept.', 'Oct.', 'Nov.', 'Dic.']

    }

    function getMonth(lang, date) {
        return month[lang][date.getMonth()];
    }

    var week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', ]
    // {
    // cn: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', ],
    // en: ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'],
    // 'pt-BR': ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    // fr: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    // es: ['Lun.', 'Mart.', 'Miérc.', 'Juev.', 'Vier.', 'Sáb.', 'Dom.']
    // }

    function getWeek(date) {
        return week[date.getDay()];
    }

    var ampm = {
        cn: ['上午', '下午'],
        en: ['AM', 'PM'],
        'pt-BR': ['manhã', 'tarde'],
        fr: ['mat.', 'apr-mid.'],
        es: ['am', 'pm']
    }

    function getAM(lang, am) {
        var index = am ? 0 : 1;
        return ampm[lang][index];
    }

    //补0
    function fix(x) {
        return x < 10 && x >= 0 ? x = '0' + x : x;
    }

    return MultiLineTextV3;
});