package com.test.fiveelement;


import androidx.appcompat.app.AppCompatActivity;
import androidx.databinding.DataBindingUtil;
import androidx.databinding.ViewDataBinding;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.graphics.Typeface;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;

import com.test.fiveelement.databinding.ActivityMainBinding;
import com.test.fiveelement.service.ElementsService;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import java.util.Timer;
import java.util.TimerTask;


public class MainActivity extends AppCompatActivity {
    ServiceConnection connection;
    ActivityMainBinding mainBinding;
    ElementFragment ef;
    TextFragment tf,tf1,tf2;
    Typeface face;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        mainBinding = DataBindingUtil.setContentView(this, R.layout.activity_main);
        init();
    }

    private void init() {
        connection = new ServiceConnection() {
            @Override
            public void onServiceConnected(ComponentName componentName, IBinder iBinder) {

            }

            @Override
            public void onServiceDisconnected(ComponentName componentName) {

            }
        };
        face = Typeface.createFromAsset(getAssets(),"fonts/simsun.ttc");
        Intent intent = new Intent(this, ElementsService.class);
        bindService(intent, connection, Context.BIND_AUTO_CREATE);
        EventBus.getDefault().register(this);
        ef = new ElementFragment();
        tf = new TextFragment();
        tf1 = new TextFragment();
        tf2 = new TextFragment();
        mainBinding.setFace(face);
        ef.setFace(face);
        tf.setFace(face);
        tf1.setFace(face);
        tf2.setFace(face);
        tf.setIndex(0);
        tf1.setIndex(1);
        tf2.setIndex(2);
        changFragments();
    }
    private Timer timer;
    int i = 0;
    public void changFragments(){
        timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                if(i>=40000) {
                    i = 0;
                }
                FragmentManager fm = getSupportFragmentManager();
                FragmentTransaction ft = fm.beginTransaction();
                switch (i%4){
                    case 0:
                    ft.replace(R.id.content,ef);
                    break;
                    case 1:
                        ft.replace(R.id.content,tf);
                        break;
                    case 2:
                        ft.replace(R.id.content,tf1);
                        break;
                    case 3:
                        ft.replace(R.id.content,tf2);
                        break;
                }

                ft.commit();
                i++;
            }
        },0,15*1000);
    }
    @Subscribe(threadMode = ThreadMode.MAIN)
    public void updateElement(Elements elements) {
        Log.i("TAG","收到信息");
        mainBinding.setElements(elements);
        ef.setElement(elements);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        EventBus.getDefault().unregister(this);
        unbindService(connection);
    }
}