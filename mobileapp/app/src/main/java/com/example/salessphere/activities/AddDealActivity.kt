package com.example.salessphere.activities

import android.app.DatePickerDialog
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.ViewModelProvider
import com.example.salessphere.R
import com.example.salessphere.databinding.ActivityAddDealBinding
import com.example.salessphere.model.pojo.Customer
import com.example.salessphere.model.pojo.Deal
import com.example.salessphere.network.ApiState
import com.example.salessphere.network.OpenDealRequest
import com.example.salessphere.network.RetrofitClient
import com.example.salessphere.util.CustomerType
import com.example.salessphere.util.PreferredContactMethod
import com.example.salessphere.util.Utils
import com.example.salessphere.viewmodels.AddDealViewModel
import com.example.salessphere.viewmodels.AddDealViewModelFactory
import com.example.salessphere.viewmodels.CustomerFactory
import com.example.salessphere.viewmodels.CustomerViewModel
import com.google.android.material.datepicker.MaterialDatePicker
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import java.text.SimpleDateFormat
import java.time.LocalDateTime
import java.util.Calendar
import java.util.Date
import java.util.Locale
import java.util.TimeZone

class AddDealActivity : AppCompatActivity() {
    private lateinit var binding: ActivityAddDealBinding
    private lateinit var datePicker: MaterialDatePicker<Long>
    private lateinit var addDealViewModel: AddDealViewModel
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = DataBindingUtil.setContentView(this, R.layout.activity_add_deal)
        setupViewModel()
        addDealViewModel.getAllCustomers()
        observeCustomers()
        observeOpenDealStatus()
        setupDatePickerDialog()

        binding.etDueDate.setOnClickListener {
            showDatePickerDialog()
        }
        binding.btnBack.setOnClickListener {
            this.finish()
        }
    }

    private fun setupViewModel() {
        val retrofitService = RetrofitClient.getInstance(this)
        val factory = AddDealViewModelFactory(retrofitService)
        addDealViewModel = ViewModelProvider(this, factory).get(AddDealViewModel::class.java)
    }

    private fun observeCustomers(){
        addDealViewModel.customers.observe(this) { customers ->
            if (customers.isNotEmpty()){
                val customerNames = customers.map { it.name }
                val adapter = ArrayAdapter(this, R.layout.list_item, customerNames)
                binding.etCustomer.setAdapter(adapter)
                binding.btnSaveChanges.setOnClickListener {
                    showSaveChangesDialog(customers)
                }
            }
        }
    }

    private fun showSaveChangesDialog(customers : List<Customer>) {
        val dialogView = layoutInflater.inflate(R.layout.dialog_open_deal, null)
        val dialog = MaterialAlertDialogBuilder(this, R.style.CustomMaterialAlertDialog)
            .setView(dialogView)
            .setPositiveButton("Yes") { dialog, _ ->
                if (validateInputs()) {
                    addDeal(customers)
                }
                dialog.dismiss()
            }.setNegativeButton("Cancel") { dialog, _ ->
                dialog.dismiss()
            }.create()
            .show()
    }

    private fun validateInputs(): Boolean {

        val title = binding.etTitle.text.toString().trim()
        val description = binding.etDescription.text.toString().trim()
        val customerBudget = binding.etCustomerBudget.text.toString().trim()
        val expenses = binding.etExpenses.text.toString().trim()
        val dueDate = binding.etDueDate.text.toString().trim()
         val customerName = binding.etCustomer.text.toString().trim()

        var isValid = true

        if (title.isBlank()) {
            binding.textInputLayoutTitle.error = "Title is required"
            isValid = false
        } else {
            binding.textInputLayoutTitle.error = null
        }

        if (description.isBlank()) {
            binding.textInputLayoutDescription.error = "Description is required"
            isValid = false
        } else {
            binding.textInputLayoutDescription.error = null
        }

        if (customerBudget.isBlank()) {
            binding.textInputLayoutBudget.error = "Customer Budget is required"
            isValid = false
        } else {
            binding.textInputLayoutBudget.error = null
        }

        if (expenses.isBlank()) {
            binding.textInputLayoutExpenses.error = "Expenses is required"
            isValid = false
        } else {
            binding.textInputLayoutExpenses.error = null
        }

        if (dueDate.isBlank()) {
            binding.textInputLayoutDueDate.error = "Due Date is required"
            isValid = false
        } else {
            binding.textInputLayoutDueDate.error = null
        }

        if (customerName.isBlank()) {
            binding.textInputLayoutCustomer.error = "Customer Name is required"
            isValid = false
        }
        else {
            binding.textInputLayoutCustomer.error = null
        }
        return isValid
    }

    private fun addDeal(customers : List<Customer>) {
        val customerName = binding.etCustomer.text.toString().trim()
        val customerId = customers.find { it.name == customerName }?.id

        if (customerId == null){
            binding.textInputLayoutCustomer.error = "Customer not found"
            return
        }
        binding.textInputLayoutCustomer.error = null
        val title = binding.etTitle.text.toString()
        val description = binding.etDescription.text.toString()
        val customerBudget = binding.etCustomerBudget.text.toString().toDouble()
        val expenses = binding.etExpenses.text.toString().toDouble()


        val dueDate = binding.etDueDate.text.toString()
        val dbDate = Utils.covertDateToDBDate(dueDate, "dd/MM/yyyy")

        val openDealRequest = OpenDealRequest(
            title = title ,
            description = description,
            customerBudget = customerBudget,
            expenses = expenses,
            customerId = customerId,
            dueDate = dbDate!!
        )
        addDealViewModel.openDeal(openDealRequest)
    }

    private fun setupDatePickerDialog() {
        datePicker = MaterialDatePicker.Builder.datePicker()
            .setTitleText("Select Date")
            .setSelection(MaterialDatePicker.todayInUtcMilliseconds())
            .build()

        datePicker.addOnPositiveButtonClickListener { selection ->
            val date = Date(selection)
            val displayedFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
            val displayedDate = displayedFormat.format(date)
            binding.etDueDate.setText(displayedDate)
        }
    }

    private fun showDatePickerDialog() {
        datePicker.show(supportFragmentManager, "MATERIAL_DATE_PICKER")
    }

    private fun observeOpenDealStatus(){
        addDealViewModel.openDealStatus.observe(this) { state ->
            when (state) {
                is ApiState.Success -> {
                    Toast.makeText(this, "Deal Added Successfully", Toast.LENGTH_SHORT).show()
                    this.finish()
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
}

