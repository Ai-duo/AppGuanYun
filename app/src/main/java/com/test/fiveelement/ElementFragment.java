package com.test.fiveelement;

import android.graphics.Typeface;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;


import com.test.fiveelement.databinding.ActivityOneBinding;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.databinding.DataBindingUtil;
import androidx.fragment.app.Fragment;

public class ElementFragment extends Fragment {
    ActivityOneBinding binding;
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        if(binding==null) {
            binding = DataBindingUtil.inflate(inflater, R.layout.activity_one, container, false);
            if(face!=null)
                binding.setFace(face);
        }
        if(elements!=null){
            binding.setElements(elements);
        }

        return binding.getRoot();
    }
    Elements elements;
    public void setElement(Elements elements){
        elements = elements;
        if(binding!=null){
            binding.setElements(elements);
        }
    }
    Typeface face;
    public void setFace(Typeface face){
        this.face = face;
        if(binding!=null){
            binding.setFace(face);
        }
    }
}
