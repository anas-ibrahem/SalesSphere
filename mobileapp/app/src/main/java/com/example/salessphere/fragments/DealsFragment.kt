package com.example.salessphere.fragments

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.viewpager2.widget.ViewPager2
import com.example.salessphere.adapters.DealAdapter
import com.example.salessphere.R
import com.example.salessphere.adapters.FragmentPageAdapter
import com.example.salessphere.databinding.FragmentDealsBinding
import com.google.android.material.tabs.TabLayout
import com.google.android.material.tabs.TabLayoutMediator


class DealsFragment : Fragment() {

    private lateinit var binding : FragmentDealsBinding

    private lateinit var fragmentPageAdapter: FragmentPageAdapter
    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        // Inflate the layout for this fragment
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_deals,container , false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        fragmentPageAdapter = FragmentPageAdapter(this)
        binding.viewPager2.adapter = fragmentPageAdapter

        TabLayoutMediator(binding.tabLayout, binding.viewPager2) { tab, position ->
            tab.text = if (position == 0) "Open Deals" else "Claimed Deals"
        }.attach()

    }

}