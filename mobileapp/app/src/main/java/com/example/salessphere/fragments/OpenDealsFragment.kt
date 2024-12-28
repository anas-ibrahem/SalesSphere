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
import com.example.salessphere.network.RetrofitClient
import com.example.salessphere.util.CurrentEmployee
import com.example.salessphere.util.EmployeeRole
import com.example.salessphere.viewmodels.DealFactory
import com.example.salessphere.viewmodels.DealViewModel


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
        setupRecyclerView()
        binding.tvNoDealsTitle.visibility = View.GONE
        binding.tvNoDealsSubtitle.visibility = View.GONE
        setupViewModel()
        when(CurrentEmployee.role){
            EmployeeRole.DEAL_OPENER.ordinal -> observeSalehOpenDeals()
            EmployeeRole.DEAL_CLOSER.ordinal -> observeAllOpenDeals()
        }
    }

    override fun onResume() {
        super.onResume()
        when (CurrentEmployee.role) {
            EmployeeRole.DEAL_OPENER.ordinal -> dealViewModel.getSalehOpenDeals()
            EmployeeRole.DEAL_CLOSER.ordinal -> dealViewModel.getAllOpenDeals()
        }
    }

    private fun setupRecyclerView() {
        dealAdapter = DealAdapter(listOf(), requireActivity())
        binding.rvDeals.adapter = dealAdapter
        binding.rvDeals.layoutManager =
            LinearLayoutManager(requireActivity(), RecyclerView.VERTICAL, false)

    }

    private fun setupViewModel() {
        val retrofitService = RetrofitClient.getInstance(requireActivity())
        val factory = DealFactory(retrofitService)
        dealViewModel = ViewModelProvider(this, factory).get(DealViewModel::class.java)

    }

    private fun observeSalehOpenDeals() {
        dealViewModel.salehOpenDeals.observe(viewLifecycleOwner) { newDeals ->
            if (newDeals.isEmpty()) {
                binding.tvNoDealsTitle.text = "No Open Deals"
                binding.tvNoDealsSubtitle.text =
                    "You haven't opened any deals yet. Start exploring opportunities today!"
                binding.tvNoDealsTitle.visibility = View.VISIBLE
                binding.tvNoDealsSubtitle.visibility = View.VISIBLE
            } else {
                binding.tvNoDealsTitle.visibility = View.GONE
                binding.tvNoDealsSubtitle.visibility = View.GONE
            }
            dealAdapter.deals = newDeals
            dealAdapter.notifyDataSetChanged()
        }
    }

    private fun observeAllOpenDeals() {
        dealViewModel.openDeals.observe(viewLifecycleOwner) { newDeals ->
            if (newDeals.isEmpty()) {
                binding.tvNoDealsTitle.text = "No Open Deals"
                binding.tvNoDealsSubtitle.text = "No active deals available. Please check back later."
                binding.tvNoDealsTitle.visibility = View.VISIBLE
                binding.tvNoDealsSubtitle.visibility = View.VISIBLE
            } else {
                binding.tvNoDealsTitle.visibility = View.GONE
                binding.tvNoDealsSubtitle.visibility = View.GONE
            }
            dealAdapter.deals = newDeals
            dealAdapter.notifyDataSetChanged()
        }
    }




}