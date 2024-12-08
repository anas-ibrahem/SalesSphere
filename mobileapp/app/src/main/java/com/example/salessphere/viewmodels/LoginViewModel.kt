package com.example.salessphere.viewmodels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.salessphere.network.ApiService
import com.example.salessphere.pojo.LoginRequest
import com.example.salessphere.pojo.LoginResponse
import com.example.salessphere.pojo.LoginState
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext


class LoginViewModel(private val apiService: ApiService) : ViewModel() {
    private val _loginState : MutableLiveData<LoginState> = MutableLiveData()
    val loginState : LiveData<LoginState>
        get() = _loginState



    fun login(email: String, password: String){
        viewModelScope.launch(Dispatchers.IO){
            _loginState.postValue(LoginState.Loading)
            try {
                val myResponse = apiService.login(LoginRequest(email , password))
                withContext(Dispatchers.Main){
                    if (myResponse.isSuccessful){
                        _loginState.postValue(LoginState.Success(myResponse.body()!!))
                    }
                    else{
                        _loginState.postValue(LoginState.Error("Invalid Email or Password"))
                    }
                }
            }catch (e : Exception){
                _loginState.postValue(LoginState.Error("Something went wrong"))
            }

        }
    }

}

class LoginViewModelFactory(val apiService: ApiService) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(LoginViewModel::class.java)) {
            return LoginViewModel(apiService) as T
        } else {
            throw IllegalArgumentException()
        }
    }
}