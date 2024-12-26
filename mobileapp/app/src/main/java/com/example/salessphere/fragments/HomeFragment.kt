package com.example.salessphere.fragments

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.example.salessphere.R
import com.example.salessphere.activities.NotificationsActivity
import com.example.salessphere.adapters.TargetAdapter
import com.example.salessphere.databinding.FragmentHomeBinding
import com.example.salessphere.network.RetrofitClient
import com.example.salessphere.util.CurrentEmployee
import com.example.salessphere.util.EmployeeRole
import com.example.salessphere.util.Utils
import com.example.salessphere.viewmodels.HomeFactory
import com.example.salessphere.viewmodels.HomeViewModel

class HomeFragment : Fragment() {
    private lateinit var binding: FragmentHomeBinding
    private lateinit var homeViewModel: HomeViewModel
    private lateinit var targetAdapter: TargetAdapter


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Inflate the layout for this fragment
        binding = DataBindingUtil.inflate(layoutInflater, R.layout.fragment_home, container, false)
        return binding.root
    }

    override fun onResume() {
        super.onResume()
        homeViewModel.getUnseenNotificationsCount()
        homeViewModel.getEmployeeSummary()
        homeViewModel.getEmployeeFinancialSummary()
        homeViewModel.getEmployeeActiveTargets()
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupViewModel()
        setupRecyclerView()
        setupObservers()

        binding.ivNotification.setOnClickListener {
            val intent = Intent(requireActivity(), NotificationsActivity::class.java)
            startActivity(intent)
        }
    }

    private fun setupObservers() {
        observeNotificationsCount()
        observeEmployeeSummary()
        observeEmployeeFinancialSummary()
    }

    private fun observeEmployeeFinancialSummary() {
        homeViewModel.employeeFinancialSummary.observe(viewLifecycleOwner) { newSummary ->
            binding.tvTotalIncome.text = "$${Utils.formatMoney(newSummary.totalIncome)}"
            binding.tvTotalExpenses.text = "$${Utils.formatMoney(newSummary.totalExpenses)}"
            binding.tvNetBalance.text = "$${Utils.formatMoney(newSummary.netBalance)}"
            if (newSummary.netBalance > 0) {
                binding.tvNetBalanceTitle.text = "Profit"
                binding.tvNetBalanceTitle.setTextColor(
                    ContextCompat.getColor(
                        requireContext(),
                        R.color.money
                    )
                )
                binding.tvNetBalance.setTextColor(
                    ContextCompat.getColor(
                        requireContext(),
                        R.color.money
                    )
                )
                binding.ivNetBalance.setImageResource(R.drawable.ic_income)
                binding.ivNetBalance.setColorFilter(
                    ContextCompat.getColor(
                        requireContext(),
                        R.color.money
                    )
                )
                binding.cvProfit.setCardBackgroundColor(
                    ContextCompat.getColor(
                        requireContext(),
                        R.color.bg_money
                    )
                )
            } else if (newSummary.netBalance < 0) {
                binding.tvNetBalanceTitle.text = "Loss"
                binding.tvNetBalanceTitle.setTextColor(
                    ContextCompat.getColor(
                        requireContext(),
                        R.color.expenses
                    )
                )
                binding.tvNetBalance.setTextColor(
                    ContextCompat.getColor(
                        requireContext(),
                        R.color.expenses
                    )
                )
                binding.ivNetBalance.setImageResource(R.drawable.ic_expenses)
                binding.ivNetBalance.setColorFilter(
                    ContextCompat.getColor(
                        requireContext(),
                        R.color.expenses
                    )
                )
                binding.cvProfit.setCardBackgroundColor(
                    ContextCompat.getColor(
                        requireContext(),
                        R.color.bg_expenses
                    )
                )
            } else {
                binding.tvNetBalanceTitle.text = "Net Balance"
                binding.tvNetBalanceTitle.setTextColor(
                    ContextCompat.getColor(
                        requireContext(),
                        R.color.zero_profit
                    )
                )
                binding.tvNetBalance.setTextColor(
                    ContextCompat.getColor(
                        requireContext(),
                        R.color.zero_profit
                    )
                )
                binding.ivNetBalance.setImageResource(R.drawable.ic_zero_profit)
                binding.ivNetBalance.setColorFilter(
                    ContextCompat.getColor(
                        requireContext(),
                        R.color.zero_profit
                    )
                )
                binding.cvProfit.setCardBackgroundColor(
                    ContextCompat.getColor(
                        requireContext(),
                        R.color.bg_zero_profit
                    )
                )
            }
        }
    }

    private fun observeEmployeeSummary() {
        homeViewModel.targets.observe(viewLifecycleOwner) { targets ->
            targetAdapter.employeeTargets = targets
            targetAdapter.notifyDataSetChanged()
        }
        homeViewModel.employeeSummary.observe(viewLifecycleOwner) { employeeSummary ->
            binding.tvTotalCustomersCount.text = employeeSummary.customers.customersCount.toString()
            binding.tvWonDealsCount.text = employeeSummary.deals.closedWonDealsCount.toString()
            binding.tvLostDealsCount.text = employeeSummary.deals.closedLostDealsCount.toString()
            when (CurrentEmployee.role) {
                EmployeeRole.DEAL_OPENER.ordinal -> {
                    binding.tvClaimedOrOpenTitle.text = "Open Deals"
                    binding.tvClaimedOrOpenCount.text = employeeSummary.deals.openDealsCount.toString()
                }

                EmployeeRole.DEAL_CLOSER.ordinal -> {
                    binding.tvClaimedOrOpenTitle.text = "Claimed Deals"
                    binding.tvClaimedOrOpenCount.text = employeeSummary.deals.claimedDealsCount.toString()
                }
            }
            CurrentEmployee.id = employeeSummary.id
            CurrentEmployee.email = employeeSummary.email
            CurrentEmployee.role = employeeSummary.role
            CurrentEmployee.firstName = employeeSummary.firstName
            CurrentEmployee.lastName = employeeSummary.lastName
            CurrentEmployee.birthDate = Utils.formatDateTime(employeeSummary.birthDate , "dd/MM/yyyy")
            CurrentEmployee.phoneNumber = employeeSummary.phoneNumber
            CurrentEmployee.profilePictureUrl = employeeSummary.profilePictureUrl
            CurrentEmployee.address = employeeSummary.address
            CurrentEmployee.accountCreationDate =Utils.formatDateTime(employeeSummary.accountCreationDate , "dd/MM/yyyy")
            showUserNameAndImage()
        }
    }

    private fun setupViewModel() {
        val retrofitService = RetrofitClient.getInstance(requireContext())
        val factory = HomeFactory(retrofitService)
        homeViewModel = ViewModelProvider(this, factory).get(HomeViewModel::class.java)
    }

    private fun observeNotificationsCount() {
        homeViewModel.unseenNotificationsCount.observe(viewLifecycleOwner) { notificationsCount ->
            if (notificationsCount == 0) {
                binding.cvNotificationCount.visibility = View.GONE
            } else {
                binding.cvNotificationCount.visibility = View.VISIBLE
                binding.tvNotificationCount.text = notificationsCount.toString()
            }
        }
    }

    private fun showUserNameAndImage() {
        binding.tvHello.text = "Hello, ${CurrentEmployee.firstName}!"
        if (CurrentEmployee.profilePictureUrl == null) {
            binding.ivUserPhoto.setImageResource(R.drawable.ic_profile)
            binding.ivUserPhoto.setColorFilter(ContextCompat.getColor(requireContext(), R.color.primary))
        }
        else{
            Glide.with(this)
                .load(CurrentEmployee.profilePictureUrl)
                .circleCrop()
                .into(binding.ivUserPhoto)
        }
    }

    private fun setupRecyclerView() {
        targetAdapter = TargetAdapter(listOf())
        binding.rvTargets.adapter = targetAdapter
        binding.rvTargets.setHasFixedSize(true)

        binding.rvTargets.layoutManager =
            LinearLayoutManager(requireContext(), RecyclerView.HORIZONTAL, false)
    }

}
