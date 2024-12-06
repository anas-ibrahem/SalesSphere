package com.example.salessphere.fragments

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.salessphere.adapters.DealAdapter
import com.example.salessphere.R
import com.example.salessphere.databinding.FragmentClaimedDealsBinding
import com.example.salessphere.pojo.Deal


class ClaimedDealsFragment : Fragment() {

    private lateinit var binding : FragmentClaimedDealsBinding
    private lateinit var dealAdapter : DealAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Inflate the layout for this fragment
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_claimed_deals,container , false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        dealAdapter = DealAdapter(listOf(), 1 , requireActivity())
        binding.rvDeals.adapter = dealAdapter
        binding.rvDeals.layoutManager = LinearLayoutManager(requireActivity(), RecyclerView.VERTICAL,false)
    }
}