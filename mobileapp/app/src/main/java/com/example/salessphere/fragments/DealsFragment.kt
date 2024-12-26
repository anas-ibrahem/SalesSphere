package com.example.salessphere.fragments

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import com.example.salessphere.R
import com.example.salessphere.activities.AddCustomerActivity
import com.example.salessphere.activities.AddDealActivity
import com.example.salessphere.adapters.FragmentPageAdapter
import com.example.salessphere.databinding.FragmentDealsBinding
import com.example.salessphere.util.CurrentEmployee
import com.example.salessphere.util.EmployeeRole
import com.google.android.material.tabs.TabLayoutMediator


class DealsFragment : Fragment() {

    private lateinit var binding: FragmentDealsBinding

    private lateinit var fragmentPageAdapter: FragmentPageAdapter
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Inflate the layout for this fragment
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_deals, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        fragmentPageAdapter = FragmentPageAdapter(this)
        binding.viewPager2.adapter = fragmentPageAdapter



        if (CurrentEmployee.role == EmployeeRole.DEAL_CLOSER.ordinal){
            binding.fabAdd.visibility = View.GONE
        }

        binding.fabAdd.setOnClickListener {
            val intent = Intent(activity, AddDealActivity::class.java)
            startActivity(intent)
        }

        TabLayoutMediator(binding.tabLayout, binding.viewPager2) { tab, position ->
            tab.text = when (CurrentEmployee.role) {
                EmployeeRole.DEAL_OPENER.ordinal ->  when (position) {
                    0 -> "Opened Deals"
                    1 -> "Claimed Deals"
                    else -> "Closed Deals"
                }
                else -> when (position) {
                    0 -> "Open Deals"
                    1 -> "Claimed Deals"
                    else -> "Closed Deals"
                }
            }
        }.attach()

    }

}