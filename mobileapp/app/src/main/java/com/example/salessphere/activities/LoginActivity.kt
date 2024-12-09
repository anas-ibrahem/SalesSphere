package com.example.salessphere.activities

import android.content.Context
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
import com.example.salessphere.network.RetrofitClient
import com.example.salessphere.pojo.LoginState
import com.example.salessphere.viewmodels.LoginViewModel
import com.example.salessphere.viewmodels.LoginViewModelFactory

class LoginActivity : AppCompatActivity() {
    private lateinit var binding : ActivityLoginBinding
    private lateinit var loginViewModel: LoginViewModel
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = DataBindingUtil.setContentView(this, R.layout.activity_login)
        //checkIfAlreadyLoggedIn()
        binding.progressBar.visibility = ProgressBar.GONE
        setupViewModel()
        observeLoginState()
        binding.loginBtn.setOnClickListener {
            onLoginClick()
        }
    }

    private fun navigateToMainActivity(){
        val intent = Intent(this, MainActivity::class.java)
        startActivity(intent)
        this.finish()
    }

    private fun checkIfAlreadyLoggedIn(){
        if (getToken() != null){
            navigateToMainActivity()
        }
    }

    private fun onLoginClick(){
        val email = binding.etEmail.text.toString().trim()  //removes leading and trailing whitespaces
        val password = binding.etPass.text.toString().trim()
        if (email.isBlank() && password.isBlank()){
            binding.textInputLayout1.error = "Please Enter Email"
            binding.textInputLayout2.error = "Please Enter Password"
        }
        else if (email.isBlank()){
            binding.textInputLayout1.error = "Please Enter Email"
            binding.textInputLayout2.error = null
        }
        else if (password.isBlank()){
            binding.textInputLayout2.error = "Please Enter Password"
            binding.textInputLayout1.error = null
        }
        else{
            binding.textInputLayout1.error = null
            binding.textInputLayout2.error = null
            loginViewModel.login(email , password)
        }
    }
    private fun observeLoginState() {
        loginViewModel.loginState.observe(this) { loginState ->
            when (loginState) {
                is LoginState.Loading -> {
                    binding.progressBar.visibility = ProgressBar.VISIBLE
                }
                is LoginState.Success -> {
                    val token = loginState.response.token
                    saveToken(token)
                    binding.progressBar.visibility = ProgressBar.GONE
                    navigateToMainActivity()
                }
                is LoginState.Error -> {
                    binding.progressBar.visibility = ProgressBar.GONE
                    Toast.makeText(this, loginState.message, Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    private fun setupViewModel(){
        val retrofitService = RetrofitClient.getInstance(this)
        val factory = LoginViewModelFactory(retrofitService)
        loginViewModel = ViewModelProvider(this, factory).get(LoginViewModel::class.java)
    }

    private fun saveToken(token: String) {
        val sharedPreferences = getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)
        sharedPreferences.edit().putString("jwt_token", token).apply()
    }

    private fun getToken(): String? {
        val sharedPreferences = getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)
        return sharedPreferences.getString("jwt_token", null)
    }

}