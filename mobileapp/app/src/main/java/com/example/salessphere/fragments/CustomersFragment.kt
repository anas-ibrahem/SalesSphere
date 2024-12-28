package com.example.salessphere.fragments

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.salessphere.R
import com.example.salessphere.activities.AddCustomerActivity
import com.example.salessphere.adapters.CustomerAdapter
import com.example.salessphere.adapters.DealAdapter
import com.example.salessphere.databinding.FragmentCustomersBinding
import com.example.salessphere.network.RetrofitClient
import com.example.salessphere.util.CurrentEmployee
import com.example.salessphere.util.EmployeeRole
import com.example.salessphere.viewmodels.CustomerFactory
import com.example.salessphere.viewmodels.CustomerViewModel
import com.example.salessphere.viewmodels.DealFactory
import com.example.salessphere.viewmodels.DealViewModel


class CustomersFragment : Fragment() {
    private lateinit var binding : FragmentCustomersBinding
    private lateinit var customersAdapter : CustomerAdapter
    private lateinit var customerViewModel: CustomerViewModel
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_customers, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupRecyclerView()
        setupViewModel()
        observeCustomers()

        if (CurrentEmployee.role == EmployeeRole.DEAL_CLOSER.ordinal){
            binding.fabAdd.visibility = View.GONE
        }
        binding.fabAdd.setOnClickListener {
            val intent = Intent(activity, AddCustomerActivity::class.java)
            startActivity(intent)
        }
    }

    override fun onResume() {
        super.onResume()
        customerViewModel.getAllCustomers()
    }

    private fun setupRecyclerView() {
        customersAdapter = CustomerAdapter(listOf(), requireActivity())
        binding.rvCustomers.adapter = customersAdapter
        binding.rvCustomers.layoutManager =
            LinearLayoutManager(requireActivity(), RecyclerView.VERTICAL, false)
    }

    private fun setupViewModel() {
        val retrofitService = RetrofitClient.getInstance(requireActivity())
        val factory = CustomerFactory(retrofitService)
        customerViewModel = ViewModelProvider(this, factory).get(CustomerViewModel::class.java)
    }

    private fun observeCustomers(){
        customerViewModel.customers.observe(viewLifecycleOwner) { customers ->
            customersAdapter.customers = customers
            customersAdapter.notifyDataSetChanged()
        }
    }

}