package com.test.fiveelement;

import android.util.Log;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class Elements {
    public String date, time, wd, sd, fx, fs, js, qy,allDate;
    private SimpleDateFormat sdf = new SimpleDateFormat("yyyy年M月d日 E HH:mm", Locale.CHINA);
    private SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd HH:mm");
    public Elements(String date, String time, String wd, String sd, String fx, String fs, String js, String qy) {
        this.date = date;
        this.time = time;
        try {
            Date d = sdf1.parse(date+" "+time);
            allDate = sdf.format(d);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        this.wd = "温度："+wd;
        this.sd = "湿度："+sd;
        this.fx = "风向："+fx;
        this.fs = "风速："+fs;
        this.js = "雨量："+js;
        this.qy = "气压："+qy;
        Log.i("TAG_", "发送信息:"+toString());
    }

    @Override
    public String toString() {
        return "Elements{" +
                "date='" + date + '\'' +
                ", time='" + time + '\'' +
                ", wd='" + wd + '\'' +
                ", sd='" + sd + '\'' +
                ", fx='" + fx + '\'' +
                ", fs='" + fs + '\'' +
                ", js='" + js + '\'' +
                ", qy='" + qy + '\'' +
                '}';
    }
}
