package com.example.salessphere.activities

import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.ViewModelProvider
import com.example.salessphere.R
import com.example.salessphere.databinding.ActivityAddCustomerBinding
import com.example.salessphere.model.pojo.Customer
import com.example.salessphere.network.AddCustomerRequest
import com.example.salessphere.network.ApiState
import com.example.salessphere.network.RetrofitClient
import com.example.salessphere.util.CustomerType
import com.example.salessphere.util.PreferredContactMethod
import com.example.salessphere.util.Utils
import com.example.salessphere.viewmodels.AddCustomerViewModel
import com.example.salessphere.viewmodels.AddCustomerViewModelFactory
import com.example.salessphere.viewmodels.CustomerFactory
import com.example.salessphere.viewmodels.CustomerViewModel
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import java.time.LocalDateTime

class AddCustomerActivity : AppCompatActivity() {
    private lateinit var binding : ActivityAddCustomerBinding
    private lateinit var addCustomerViewModel: AddCustomerViewModel
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = DataBindingUtil.setContentView(this, R.layout.activity_add_customer)
        setupViewModel()
        observeAddCustomerState()
        setupDropDownAdapters()
        binding.btnBack.setOnClickListener {
            this.finish()
        }
        binding.btnSaveChanges.setOnClickListener {
            showSaveChangesDialog()
        }
    }
    private fun setupDropDownAdapters() {

        val types = arrayOf("Individual", "Company")
        val typeAdapter = ArrayAdapter(this, R.layout.list_item, types)
        binding.dropDownType.setAdapter(typeAdapter)


        val preferredContactMethods = arrayOf("Email", "Phone")
        val preferredContactMethodsAdapter = ArrayAdapter(this, R.layout.list_item, preferredContactMethods)
        binding.dropDownPreferredContactMethod.setAdapter(preferredContactMethodsAdapter)

    }

    private fun setupViewModel() {
        val retrofitService = RetrofitClient.getInstance(this)
        val factory = AddCustomerViewModelFactory(retrofitService)
        addCustomerViewModel =
            ViewModelProvider(this, factory).get(AddCustomerViewModel::class.java)
    }

    private fun showSaveChangesDialog() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_add_customer, null)
        val dialog = MaterialAlertDialogBuilder(this, R.style.CustomMaterialAlertDialog)
            .setView(dialogView)
            .setPositiveButton("Yes") { dialog, _ ->
                if (validateInputs()){
                    addCustomer()
                }
                dialog.dismiss()
            }.setNegativeButton("Cancel") { dialog, _ ->
                dialog.dismiss()
            }.create()
            .show()
    }


    private fun validateInputs(): Boolean {

        val name = binding.etName.text.toString().trim()
        val email = binding.etEmail.text.toString().trim()
        val phoneNumber = binding.etPhone.text.toString().trim()
        val leadSource = binding.etLeadSource.text.toString().trim()
        val type = binding.dropDownType.text.toString().trim()
        val preferredContactMethod = binding.dropDownPreferredContactMethod.text.toString().trim()

        var isValid = true

        if (name.isBlank()) {
            binding.nameTextInputLayout.error = "Name is required"
            isValid = false
        } else {
            binding.nameTextInputLayout.error = null
        }

        if (email.isBlank()) {
            binding.emailTextInputLayout.error = "Email is required"
            isValid = false
        } else {
            binding.emailTextInputLayout.error = null
        }

        if (phoneNumber.isBlank()) {
            binding.phoneTextInputLayout.error = "Phone number is required"
            isValid = false
        } else {
            binding.phoneTextInputLayout.error = null
        }

        if (leadSource.isBlank()) {
            binding.textInputLayoutLeadSource.error = "Lead source is required"
            isValid = false
        } else {
            binding.textInputLayoutLeadSource.error = null
        }

        if (type.isBlank()) {
            binding.textInputLayoutType.error = "Type is required"
            isValid = false
        } else {
            binding.textInputLayoutType.error = null
        }

        if (preferredContactMethod.isBlank()) {
            binding.textInputLayoutPreferredContactMethod.error = "Preferred contact method is required"
            isValid = false
        } else {
            binding.textInputLayoutPreferredContactMethod.error = null
        }

        return isValid
    }


    private fun addCustomer(){
        val name = binding.etName.text.toString()
        val email = binding.etEmail.text.toString()
        val phoneNumber = binding.etPhone.text.toString()
        val address = binding.etAddress.text.toString()
        val leadSource = binding.etLeadSource.text.toString()

        val type = when (binding.dropDownType.text.toString()) {
            "Individual" -> CustomerType.INDIVIDUAL.ordinal
            else -> CustomerType.COMPANY.ordinal
        }

        val preferredContactMethod = when (binding.dropDownPreferredContactMethod.text.toString()) {
            "Email" -> PreferredContactMethod.EMAIL.value
            else -> PreferredContactMethod.PHONE.value
        }

        val registrationDate = Utils.convertDateTimeToTIMESTAMP(LocalDateTime.now())

        val addCustomerRequest = AddCustomerRequest(
            name = name,
            email = email,
            phoneNumber = phoneNumber,
            address = address,
            leadSource = leadSource,
            type = type,
            preferredContactMethod = preferredContactMethod,
            registrationDate = registrationDate
        )
        addCustomerViewModel.addCustomer(addCustomerRequest)
    }


    private fun observeAddCustomerState(){
        addCustomerViewModel.addCustomerState.observe(this) { state ->
            when (state) {
                is ApiState.Success -> {
                    Toast.makeText(this, "Customer Added Successfully", Toast.LENGTH_SHORT).show()
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