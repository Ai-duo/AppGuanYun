package com.test.fiveelement;


import android.graphics.Typeface;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.test.fiveelement.databinding.ActivityOneBinding;
import com.test.fiveelement.databinding.ActivitySecondBinding;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;

public class TextFragment extends Fragment {
    ActivitySecondBinding binding;
    String[] text ={ "1、营商环境只有更好，没有最好。———习近平 " +
            "2、打造办事方便、法制良好、成本竞争力强、生态宜居的营商环境。\n" ,
            "3、人人都是营商环境，个个都是开放形象。 " +
            "4、优化营商环境人人有责，共享营商环境人人有份。\n" ,
            "5、把方便留给企业，把“麻烦”留给自己。" +
            "6、营商环境就是我们自己。"};
    private Typeface face;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        if(binding==null) {
            binding = DataBindingUtil.inflate(inflater, R.layout.activity_second, container, false);
            binding.textview.setTypeface(face);
          //  binding.textview.setText(text[index]);
        }


        return binding.getRoot();
    }
    int index = 0;
    public void setIndex(int index){
        this.index = index;
    }

    public void setFace(Typeface face) {
        this.face =face;
    }
}
