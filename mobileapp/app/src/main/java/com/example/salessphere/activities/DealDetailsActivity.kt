package com.example.salessphere.activities

import android.app.AlertDialog
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.RadioGroup
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.isVisible
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.salessphere.R
import com.example.salessphere.adapters.FinancialRecordAdapter
import com.example.salessphere.databinding.ActivityDealDetailsBinding
import com.example.salessphere.databinding.BottomSheetAddFinancialRecordBinding
import com.example.salessphere.databinding.BottomSheetCallBinding
import com.example.salessphere.databinding.BottomSheetEmailBinding
import com.example.salessphere.network.ApiState
import com.example.salessphere.network.RetrofitClient
import com.example.salessphere.model.pojo.Customer
import com.example.salessphere.model.pojo.Deal
import com.example.salessphere.model.pojo.FinancialRecord
import com.example.salessphere.util.CurrentEmployee
import com.example.salessphere.util.CustomerType
import com.example.salessphere.util.DealStatus
import com.example.salessphere.util.EmployeeRole
import com.example.salessphere.util.FinancialRecordType
import com.example.salessphere.util.PaymentMethod
import com.example.salessphere.util.Utils
import com.example.salessphere.viewmodels.DealDetailFactory
import com.example.salessphere.viewmodels.DealDetailsViewModel
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit


class DealDetailsActivity : AppCompatActivity() {

    private lateinit var binding: ActivityDealDetailsBinding
    private lateinit var financialRecordBottomSheetBinding: BottomSheetAddFinancialRecordBinding
    private lateinit var financialRecordBottomSheet: BottomSheetDialog
    private lateinit var dealDetailsViewModel: DealDetailsViewModel
    private lateinit var financialRecordAdapter: FinancialRecordAdapter
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = DataBindingUtil.setContentView(this, R.layout.activity_deal_details)


        setupViewModel()
        setupRecyclerView()
        setupFinancialRecordBottomSheet()
        setupObservers()


        binding.btnBack.setOnClickListener {
            this.finish()
        }

        binding.claimButton.setOnClickListener {
            showClaimDealDialog()
        }
        binding.closeDealButton.setOnClickListener {
            showCloseDealDialog()
        }


    }

    private fun setupViewModel() {
        val retrofitService = RetrofitClient.getInstance(this)
        val dealId = intent.getIntExtra("DEAL_ID", 0)
        val factory = DealDetailFactory(retrofitService, dealId)
        dealDetailsViewModel =
            ViewModelProvider(this, factory).get(DealDetailsViewModel::class.java)
    }

    private fun setupRecyclerView() {
        financialRecordAdapter = FinancialRecordAdapter(mutableListOf())
        binding.rvFinancialRecords.adapter = financialRecordAdapter
        binding.rvFinancialRecords.layoutManager =
            LinearLayoutManager(this, RecyclerView.VERTICAL, false)
    }

    private fun setupObservers() {
        observeDeal()
        observeFinancialRecords()
        observeFinancialSummary()
        observeAddFinancialRecordState()
        observeClaimDeal()
        observeCloseDeal()
    }


    private fun observeDeal() {
        dealDetailsViewModel.deal.observe(this) { newDeal ->
            showDealDetails(newDeal)
            binding.btnContactCustomer.setOnClickListener {
                onContactCustomerClick(newDeal.customer)
            }
            binding.btnAddFinancialRecord.setOnClickListener {
                onAddFinancialRecordClick(newDeal.status)
            }
        }
    }

    private fun onContactCustomerClick(customer : Customer){
        if (customer.preferredContactMethod) {
            showCallBottomSheet(customer.phoneNumber)
        } else {
            showEmailBottomSheet(customer.email)
        }
    }

    private fun onAddFinancialRecordClick(dealStatus: Int) {
        when (dealStatus) {
            DealStatus.OPEN.ordinal -> {
                Toast.makeText(this, "Please claim the deal first", Toast.LENGTH_SHORT)
                    .show()
            }
            else -> {
                showFinancialRecordBottomSheet()
            }
        }
    }

    private fun showDealDetails(newDeal: Deal) {
        binding.tvDealTitle.text = newDeal.title
        binding.tvDealDescription.text = newDeal.description
        binding.tvBudget.text = "$${Utils.formatMoney(newDeal.customerBudget)}"
        binding.tvExpenses.text = "$${Utils.formatMoney(newDeal.expenses)}"
        val revenue = newDeal.customerBudget - newDeal.expenses
        binding.tvExpectedRevenue.text = "$${Utils.formatMoney(revenue)}"
        binding.tvCustomerName.text = newDeal.customer.name
        binding.tvCustomerEmail.text = newDeal.customer.email
        when(newDeal.customer.type){
            CustomerType.INDIVIDUAL.ordinal -> binding.ivCustomerType.setImageResource(R.drawable.ic_badge_customer)
            CustomerType.COMPANY.ordinal -> binding.ivCustomerType.setImageResource(R.drawable.ic_business)
        }

        if(newDeal.customer.preferredContactMethod){
            binding.btnContactCustomer.setImageResource(R.drawable.ic_phone)
        }
        else{
            binding.btnContactCustomer.setImageResource(R.drawable.ic_email_customer)
        }
        val dueDate = Utils.convertToLocalDate(newDeal.dueDate)
        val dateToday = LocalDate.now()
        val daysDifference = ChronoUnit.DAYS.between(dateToday, dueDate)
        binding.chipDaysLeft.text = "$daysDifference days left"
        binding.tvDueDate.text = Utils.formatDateTime(newDeal.dueDate, "MMMM d, yyyy")

        when (newDeal.status) {
            DealStatus.OPEN.ordinal -> {
                binding.claimButton.isEnabled = true
                binding.closeDealButton.isEnabled = false
                binding.btnAddFinancialRecord.isVisible = false
                binding.chipStatus.text = "Open"
                binding.chipDaysLeft.isVisible = true
                binding.chipStatus.chipBackgroundColor =
                    ContextCompat.getColorStateList(this, R.color.bg_status_open)
                binding.chipStatus.setTextColor(ContextCompat.getColor(this, R.color.status_open))
            }

            DealStatus.CLAIMED.ordinal -> {
                binding.claimButton.isEnabled = false
                binding.closeDealButton.isEnabled = true
                binding.btnAddFinancialRecord.isVisible = true
                binding.chipStatus.text = "Claimed"
                binding.chipDaysLeft.isVisible = true
                binding.chipStatus.chipBackgroundColor =
                    ContextCompat.getColorStateList(this, R.color.bg_status_claimed)
                binding.chipStatus.setTextColor(
                    ContextCompat.getColor(
                        this,
                        R.color.status_claimed
                    )
                )
            }

            DealStatus.CLOSED_WON.ordinal -> {
                binding.claimButton.isEnabled = false
                binding.closeDealButton.isEnabled = false
                binding.btnAddFinancialRecord.isVisible = false
                binding.chipStatus.text = "Closed Won"
                binding.chipDaysLeft.isVisible = false
                binding.chipStatus.chipBackgroundColor =
                    ContextCompat.getColorStateList(this, R.color.bg_status_closed_won)
                binding.chipStatus.setTextColor(ContextCompat.getColor(this, R.color.status_closed_won))
            }

            DealStatus.CLOSED_LOST.ordinal -> {
                binding.claimButton.isEnabled = false
                binding.closeDealButton.isEnabled = false
                binding.btnAddFinancialRecord.isVisible = false
                binding.chipStatus.text = "Closed Lost"
                binding.chipDaysLeft.isVisible = false
                binding.chipStatus.chipBackgroundColor =
                    ContextCompat.getColorStateList(this, R.color.bg_status_closed_lost)
                binding.chipStatus.setTextColor(ContextCompat.getColor(this, R.color.status_closed_lost))
            }
        }

        if (CurrentEmployee.role == EmployeeRole.DEAL_OPENER.ordinal){
            binding.claimButton.isVisible = false
            binding.closeDealButton.isVisible = false
            binding.btnAddFinancialRecord.isVisible = false
        }
    }

    private fun showClaimDealDialog() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_claim_deal, null)
        val dialog =
            MaterialAlertDialogBuilder(this, R.style.CustomMaterialAlertDialog).setView(dialogView)
                .setPositiveButton("Claim Deal") { dialog, _ ->
                    dealDetailsViewModel.claimDeal()
                    dialog.dismiss()
                }.setNegativeButton("Cancel") { dialog, _ ->
                    dialog.dismiss()
                }.create().show()
    }

    private fun showCloseDealDialog() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_close_deal, null)
        val radioGroup: RadioGroup = dialogView.findViewById(R.id.dealOutcomeRadioGroup)
        val dialog =
            MaterialAlertDialogBuilder(this, R.style.CustomMaterialAlertDialog).setView(dialogView)
                .setPositiveButton("Close Deal", null).setNegativeButton("Cancel") { dialog, _ ->
                    dialog.dismiss()
                }.create()


        dialog.setOnShowListener {
            val positiveButton = dialog.getButton(AlertDialog.BUTTON_POSITIVE)
            positiveButton.setOnClickListener {
                when (radioGroup.checkedRadioButtonId) {
                    R.id.wonRadioButton -> dealDetailsViewModel.closeDeal(DealStatus.CLOSED_WON)
                    R.id.lostRadioButton -> dealDetailsViewModel.closeDeal(DealStatus.CLOSED_LOST)
                    else -> {
                        Toast.makeText(this, "Please select an outcome", Toast.LENGTH_SHORT).show()
                        return@setOnClickListener
                    }
                }
                dialog.dismiss()
            }
        }
        dialog.show()

    }

    private fun showCallBottomSheet(phoneNumber: String) {
        val bottomSheet = BottomSheetDialog(this)
        val bottomSheetBinding = BottomSheetCallBinding.inflate(layoutInflater)
        bottomSheet.setContentView(bottomSheetBinding.root)

        bottomSheetBinding.phoneNumberTv.text = phoneNumber
        bottomSheetBinding.callButton.setOnClickListener {
            val intent = Intent(Intent.ACTION_DIAL).apply {
                data = Uri.parse("tel:$phoneNumber")
            }
            startActivity(intent)
            bottomSheet.dismiss()
        }

        bottomSheetBinding.btnCancel.setOnClickListener {
            bottomSheet.dismiss()
        }

        bottomSheet.show()
    }

    private fun showEmailBottomSheet(email: String) {
        val bottomSheet = BottomSheetDialog(this)
        val bottomSheetBinding = BottomSheetEmailBinding.inflate(layoutInflater)
        bottomSheet.setContentView(bottomSheetBinding.root)

        bottomSheetBinding.tvEmail.text = email
        bottomSheetBinding.btnSendEmail.setOnClickListener {
            val emailIntent = Intent(Intent.ACTION_SENDTO).apply {
                data = Uri.parse("mailto:${email}")
            }
            startActivity(emailIntent)
            bottomSheet.dismiss()
        }

        bottomSheetBinding.btnCancel.setOnClickListener {
            bottomSheet.dismiss()
        }
        bottomSheet.show()
    }

    private fun setupFinancialRecordBottomSheet() {
        financialRecordBottomSheet = BottomSheetDialog(this)
        financialRecordBottomSheetBinding =
            BottomSheetAddFinancialRecordBinding.inflate(layoutInflater)
        financialRecordBottomSheet.setContentView(financialRecordBottomSheetBinding.root)

        val paymentMethods =
            arrayOf("Cash", "Credit Card", "Bank Transfer", "Electronic Payment", "Other")
        val methodAdapter = ArrayAdapter(this, R.layout.list_item, paymentMethods)
        financialRecordBottomSheetBinding.dropDownPaymentMethod.setAdapter(methodAdapter)

        val types = arrayOf("Income", "Expense")
        val typeAdapter = ArrayAdapter(this, R.layout.list_item, types)
        financialRecordBottomSheetBinding.dropDownType.setAdapter(typeAdapter)

        financialRecordBottomSheetBinding.btnConfirmFinancialRecord.setOnClickListener {
            if (validateFinancialRecordInputs()) {
                addFinancialRecord()
                financialRecordBottomSheet.dismiss()
            }
        }

        financialRecordBottomSheetBinding.btnCancel.setOnClickListener {
            financialRecordBottomSheet.dismiss()
        }
    }


    private fun observeAddFinancialRecordState() {
        dealDetailsViewModel.addFinancialRecordState.observe(this) { state ->
            when (state) {
                is ApiState.Success -> {
                    dealDetailsViewModel.getFinancialRecordsByDealId()
                    dealDetailsViewModel.getDealFinancialSummary()
                    Toast.makeText(this, "Record Added Successfully", Toast.LENGTH_SHORT).show()
                }

                is ApiState.Error -> {
                    Toast.makeText(this, state.error, Toast.LENGTH_SHORT).show()
                }

                ApiState.Loading -> {
                    // Add some loading indicator
                }
            }
        }
    }


    private fun observeFinancialRecords() {
        dealDetailsViewModel.financialRecords.observe(this) { newRecords ->
            financialRecordAdapter.financialRecords = newRecords.toMutableList()
            financialRecordAdapter.notifyDataSetChanged()
        }
    }

    private fun observeFinancialSummary() {
        dealDetailsViewModel.financialSummary.observe(this) { newSummary ->

            binding.tvTotalIncome.text = "$${Utils.formatMoney(newSummary.totalIncome)}"
            binding.tvTotalExpenses.text = "$${Utils.formatMoney(newSummary.totalExpenses)}"

            if (newSummary.totalIncome > newSummary.totalExpenses) {
                val profit = newSummary.totalIncome - newSummary.totalExpenses
                binding.tvNetBalance.text = "$${Utils.formatMoney(profit)}"
                binding.tvNetBalanceTitle.text = "Profit"
                binding.tvNetBalanceTitle.setTextColor(ContextCompat.getColor(this, R.color.money))
                binding.tvNetBalance.setTextColor(ContextCompat.getColor(this, R.color.money))
                binding.ivNetBalance.setImageResource(R.drawable.ic_income)
                binding.ivNetBalance.setColorFilter(ContextCompat.getColor(this, R.color.money))
                binding.cvProfit.setCardBackgroundColor(ContextCompat.getColor(this, R.color.bg_money))
            } else if (newSummary.totalIncome < newSummary.totalExpenses) {
                val loss = newSummary.totalExpenses - newSummary.totalIncome
                binding.tvNetBalance.text = "$${Utils.formatMoney(loss)}"
                binding.tvNetBalanceTitle.text = "Loss"
                binding.tvNetBalanceTitle.setTextColor(ContextCompat.getColor(this, R.color.expenses))
                binding.tvNetBalance.setTextColor(ContextCompat.getColor(this, R.color.expenses))
                binding.ivNetBalance.setImageResource(R.drawable.ic_expenses)
                binding.ivNetBalance.setColorFilter(ContextCompat.getColor(this, R.color.expenses))
                binding.cvProfit.setCardBackgroundColor(ContextCompat.getColor(this, R.color.bg_expenses))
            } else{
                binding.tvNetBalance.text = "$0"
                binding.tvNetBalanceTitle.text = "Net Balance"
                binding.tvNetBalanceTitle.setTextColor(ContextCompat.getColor(this, R.color.zero_profit))
                binding.tvNetBalance.setTextColor(ContextCompat.getColor(this, R.color.zero_profit))
                binding.ivNetBalance.setImageResource(R.drawable.ic_zero_profit)
                binding.ivNetBalance.setColorFilter(ContextCompat.getColor(this, R.color.zero_profit))
                binding.cvProfit.setCardBackgroundColor(ContextCompat.getColor(this, R.color.bg_zero_profit))
            }
        }
    }

    private fun observeClaimDeal() {
        dealDetailsViewModel.claimDealState.observe(this) { claimDealState ->
            when (claimDealState) {
                is ApiState.Success -> {
                    dealDetailsViewModel.getDealById()
                    Toast.makeText(this, claimDealState.data.message, Toast.LENGTH_SHORT).show()
                }

                is ApiState.Error -> {
                    Toast.makeText(this, claimDealState.error, Toast.LENGTH_SHORT).show()
                }

                ApiState.Loading -> {
                    // show loading effect
                }
            }
        }
    }

    private fun observeCloseDeal() {
        dealDetailsViewModel.closeDealState.observe(this) { closeDealState ->
            when (closeDealState) {
                is ApiState.Success -> {
                    dealDetailsViewModel.getDealById()
                }

                is ApiState.Error -> {
                    Toast.makeText(this, closeDealState.error, Toast.LENGTH_SHORT).show()
                }

                ApiState.Loading -> {
                    // show loading effect
                }
            }
        }
    }

    private fun validateFinancialRecordInputs(): Boolean {
        var isValid = true
        val amount = financialRecordBottomSheetBinding.tvAmount.text.toString().trim()
        val type = financialRecordBottomSheetBinding.dropDownType.text.toString().trim()
        val paymentMethod =
            financialRecordBottomSheetBinding.dropDownPaymentMethod.text.toString().trim()
        val description = financialRecordBottomSheetBinding.tvDescription.text.toString().trim()

        if (amount.isBlank()) {
            financialRecordBottomSheetBinding.textInputLayoutAmount.error = "Amount is required"
            isValid = false
        } else {
            financialRecordBottomSheetBinding.textInputLayoutAmount.error = null
        }

        if (type.isBlank()) {
            financialRecordBottomSheetBinding.textInputLayoutType.error = "Type is required"
            isValid = false
        } else {
            financialRecordBottomSheetBinding.textInputLayoutType.error = null
        }

        if (paymentMethod.isBlank()) {
            financialRecordBottomSheetBinding.textInputLayoutPaymentMethod.error =
                "Payment Method is required"
            isValid = false
        } else {
            financialRecordBottomSheetBinding.textInputLayoutPaymentMethod.error = null
        }

        if (description.isBlank()) {
            financialRecordBottomSheetBinding.textInputLayoutDescription.error =
                "Description is required"
            isValid = false
        } else {
            financialRecordBottomSheetBinding.textInputLayoutDescription.error = null
        }

        return isValid
    }

    private fun addFinancialRecord() {

        val amount = financialRecordBottomSheetBinding.tvAmount.text.toString().toDouble()
        val type = when (financialRecordBottomSheetBinding.dropDownType.text.toString()) {
            "Income" ->
                FinancialRecordType.INCOME

            else ->
                FinancialRecordType.EXPENSE
        }
        val paymentMethod =
            when (financialRecordBottomSheetBinding.dropDownPaymentMethod.text.toString()) {
                "Cash" -> PaymentMethod.CASH
                "Credit Card" -> PaymentMethod.CREDIT_CARD
                "Bank Transfer" -> PaymentMethod.BANK_TRANSFER
                "Electronic Payment" -> PaymentMethod.ELECTRONIC_PAYMENT
                else -> PaymentMethod.OTHER
            }
        val description = financialRecordBottomSheetBinding.tvDescription.text.toString()

        val dealId = intent.getIntExtra("DEAL_ID", 0)
        val transactionDate = Utils.convertDateTimeToTIMESTAMP(LocalDateTime.now())
        val financialRecord = FinancialRecord(
            amount = amount,
            type = type.ordinal,
            paymentMethod = paymentMethod.ordinal,
            dealId = dealId,
            description = description,
            transactionDate = transactionDate
        )
        dealDetailsViewModel.addFinancialRecord(financialRecord)
    }

    private fun showFinancialRecordBottomSheet() {
        clearFinancialRecordBottomSheetInputs()
        financialRecordBottomSheet.show()
    }

    private fun clearFinancialRecordBottomSheetInputs() {
        financialRecordBottomSheetBinding.tvAmount.text?.clear()
        financialRecordBottomSheetBinding.dropDownType.text?.clear()
        financialRecordBottomSheetBinding.dropDownPaymentMethod.text?.clear()
        financialRecordBottomSheetBinding.tvDescription.text?.clear()
        financialRecordBottomSheetBinding.textInputLayoutAmount.error = null
        financialRecordBottomSheetBinding.textInputLayoutType.error = null
        financialRecordBottomSheetBinding.textInputLayoutPaymentMethod.error = null
        financialRecordBottomSheetBinding.textInputLayoutDescription.error = null
    }

}