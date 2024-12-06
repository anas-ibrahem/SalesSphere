package com.example.salessphere.fragments

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.salessphere.adapters.DealAdapter
import com.example.salessphere.R
import com.example.salessphere.databinding.FragmentOpenDealsBinding
import com.example.salessphere.network.RetrofitHelper
import com.example.salessphere.pojo.Deal
import com.example.salessphere.viewmodels.DealFactory
import com.example.salessphere.viewmodels.DealViewModel
import com.example.salessphere.viewmodels.HomeViewModel


class OpenDealsFragment : Fragment() {

    private lateinit var binding: FragmentOpenDealsBinding
    private lateinit var dealAdapter: DealAdapter
    private lateinit var dealViewModel: DealViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Inflate the layout for this fragment
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_open_deals, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupViewModel()
        setupRecyclerView()

    }

    private fun setupViewModel() {
        val retrofitService = RetrofitHelper.retrofitService
        val factory = DealFactory(retrofitService)
        dealViewModel = ViewModelProvider(this, factory).get(DealViewModel::class.java)

        //        dealViewModel.deals.observe(viewLifecycleOwner){newDeals ->
//            dealAdapter.deals = newDeals
//            dealAdapter.notifyDataSetChanged()
//        }
    }

    private fun setupRecyclerView(){
        val dealList = listOf(
            Deal(1 ,
                "Software Sale" ,
                "El ablkash el mateeen" ,
                "Open" ,
                1 ,
                2000f ,
                1000f ,
                null ,
                null ,
                "1/1/2024" ,
                "2/2/2024" ,
                null ,
                1
            ) ,
            Deal(1 ,
                "Software Sale" ,
                "El ablkash el mateeen" ,
                "Open" ,
                1 ,
                2000f ,
                1000f ,
                null ,
                null ,
                "1/1/2024" ,
                "2/2/2024" ,
                null ,
                1
            ) ,
            Deal(1 ,
                "Software Sale" ,
                "El ablkash el mateeen" ,
                "Open" ,
                1 ,
                2000f ,
                1000f ,
                null ,
                null ,
                "1/1/2024" ,
                "2/2/2024" ,
                null ,
                1
            ) ,
            Deal(1 ,
                "Software Sale" ,
                "El ablkash el mateeen" ,
                "Open" ,
                1 ,
                2000f ,
                1000f ,
                null ,
                null ,
                "1/1/2024" ,
                "2/2/2024" ,
                null ,
                1
            )

        )
        dealAdapter = DealAdapter(dealList, 0, requireActivity())
        binding.rvDeals.adapter = dealAdapter
        binding.rvDeals.layoutManager = LinearLayoutManager(requireActivity(), RecyclerView.VERTICAL, false)

    }
}