package com.example.salessphere.activities

import android.app.AlertDialog
import android.content.Intent
import android.os.Bundle
import android.widget.ProgressBar
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.ViewModelProvider
import com.example.salessphere.R
import com.example.salessphere.databinding.ActivityLoginBinding
import com.example.salessphere.network.ApiState
import com.example.salessphere.network.RetrofitClient
import com.example.salessphere.util.CurrentEmployee
import com.example.salessphere.util.EmployeeRole
import android.net.Uri

import com.example.salessphere.util.Utils
import com.example.salessphere.viewmodels.LoginViewModel
import com.example.salessphere.viewmodels.LoginViewModelFactory
import com.example.salessphere.viewmodels.ProfileViewModel
import com.example.salessphere.viewmodels.ProfileViewModelFactory
import com.google.android.material.dialog.MaterialAlertDialogBuilder

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    private lateinit var loginViewModel: LoginViewModel
    private lateinit var profileViewModel: ProfileViewModel
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = DataBindingUtil.setContentView(this, R.layout.activity_login)
        //checkIfAlreadyLoggedIn()
        binding.progressBar.visibility = ProgressBar.INVISIBLE
        setupViewModel()
        observeLoginState()
        observeProfile()
        binding.loginBtn.setOnClickListener {
            onLoginClick()
        }
    }

    private fun navigateToMainActivity() {
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        this.finish()
    }

    private fun checkIfAlreadyLoggedIn() {
        if (Utils.getToken(this) != null) {
            navigateToMainActivity()
        }
    }


    private fun validateInputs(email: String, password: String): Boolean {
        var isValid = true
        if (email.isBlank()) {
            binding.textInputLayout1.error = "Email address is required"
            isValid = false
        } else {
            binding.textInputLayout1.error = null
        }
        if (password.isBlank()) {
            binding.textInputLayout2.error = "Password is required"
            isValid = false
        } else {
            binding.textInputLayout2.error = null
        }
        return isValid
    }

    private fun onLoginClick() {
        val email =
            binding.etEmail.text.toString().trim()  //removes leading and trailing whitespaces
        val password = binding.etPass.text.toString()
        if (validateInputs(email, password))
            loginViewModel.login(email, password)
    }

    private fun observeLoginState() {
        loginViewModel.loginState.observe(this) { state ->
            when (state) {
                is ApiState.Loading -> {
                    binding.progressBar.visibility = ProgressBar.VISIBLE
                }

                is ApiState.Success -> {
                    val token = state.data.token
                    Utils.saveToken(token, this)
                    profileViewModel.getMyProfile()
                }

                is ApiState.Error -> {
                    binding.progressBar.visibility = ProgressBar.INVISIBLE
                    Toast.makeText(this, state.error, Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun observeProfile() {
        profileViewModel.profile.observe(this) { profile ->
            CurrentEmployee.id = profile.id
            CurrentEmployee.email = profile.email
            CurrentEmployee.role = profile.role
            CurrentEmployee.firstName = profile.firstName
            CurrentEmployee.lastName = profile.lastName
            CurrentEmployee.birthDate = Utils.formatDateTime(profile.birthDate, "dd/MM/yyyy")
            CurrentEmployee.phoneNumber = profile.phoneNumber
            CurrentEmployee.profilePictureUrl = profile.profilePictureUrl
            CurrentEmployee.address = profile.address
            CurrentEmployee.accountCreationDate =
                Utils.formatDateTime(profile.accountCreationDate, "dd/MM/yyyy")
            binding.progressBar.visibility = ProgressBar.INVISIBLE

            if (profile.role == EmployeeRole.MANAGER.ordinal) {
                showAccessRestrictedDialog()
            } else {
                Toast.makeText(this, "Login Successful", Toast.LENGTH_SHORT).show()
                navigateToMainActivity()
            }
        }
    }

    private fun setupViewModel() {
        val retrofitService = RetrofitClient.getInstance(this)
        val loginFactory = LoginViewModelFactory(retrofitService)
        val profileFactory = ProfileViewModelFactory(retrofitService)
        loginViewModel = ViewModelProvider(this, loginFactory).get(LoginViewModel::class.java)
        profileViewModel = ViewModelProvider(this, profileFactory).get(ProfileViewModel::class.java)
    }


    private fun showAccessRestrictedDialog() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_access_restricted, null)
        val dialog = MaterialAlertDialogBuilder(this, R.style.CustomMaterialAlertDialog)
            .setView(dialogView)
            .setPositiveButton("Visit Website") { dialog, _ ->
                openWebsite("https://sales-sphere-site.vercel.app")
                dialog.dismiss()
            }.setNegativeButton("Cancel") { dialog, _ ->
                dialog.dismiss()
                Toast.makeText(this, "Access denied for managers.", Toast.LENGTH_SHORT).show()
            }.setCancelable(false)

            .create()
            .show()
    }

    private fun openWebsite(url: String) {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
        startActivity(intent)
    }

}