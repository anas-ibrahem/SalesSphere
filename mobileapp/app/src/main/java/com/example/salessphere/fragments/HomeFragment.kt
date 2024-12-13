package com.example.salessphere.fragments

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.ViewModelProvider
import com.example.salessphere.R
import com.example.salessphere.databinding.FragmentHomeBinding
import com.example.salessphere.network.RetrofitClient
import com.example.salessphere.pojo.Employee
import com.example.salessphere.viewmodels.HomeFactory
import com.example.salessphere.viewmodels.HomeViewModel

class HomeFragment : Fragment() {
    private lateinit var binding : FragmentHomeBinding
    private lateinit var homeViewModel: HomeViewModel
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Inflate the layout for this fragment
        binding = DataBindingUtil.inflate(layoutInflater , R.layout.fragment_home, container , false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val retrofitService = RetrofitClient.getInstance(requireActivity())
        val factory = HomeFactory(retrofitService)
        var employeeList : List<Employee>
        homeViewModel = ViewModelProvider(this , factory ).get(HomeViewModel::class.java)

        homeViewModel.employees.observe(viewLifecycleOwner){ employees ->
            employeeList = employees
            val myEmployee = employeeList[0]
            binding.employeeTV.text = "Employee name is ${myEmployee.first_name} ${myEmployee.last_name} , role is ${myEmployee.role}"
        }

    }

}