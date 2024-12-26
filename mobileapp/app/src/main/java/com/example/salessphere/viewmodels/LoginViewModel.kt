package com.example.salessphere.viewmodels

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.salessphere.network.ApiService
import com.example.salessphere.network.ApiState
import com.example.salessphere.network.LoginRequest
import com.example.salessphere.network.LoginResponse
import com.example.salessphere.model.pojo.Employee
import com.example.salessphere.util.Utils
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext


class LoginViewModel(private val apiService: ApiService) : ViewModel() {
    private val _loginState : MutableLiveData<ApiState<LoginResponse>> = MutableLiveData()
    val loginState : LiveData<ApiState<LoginResponse>>
        get() = _loginState


    fun login(email: String, password: String){
        viewModelScope.launch(Dispatchers.IO){
            _loginState.postValue(ApiState.Loading)
            try {
                val response = apiService.login(LoginRequest(email , password))
                withContext(Dispatchers.Main){
                    if (response.isSuccessful && response.body() != null){
                        _loginState.postValue(ApiState.Success(response.body()!!))
                    }
                    else{
                        val error = Utils.extractErrorMessage(response.errorBody()?.string()!!)
                        _loginState.postValue(ApiState.Error(error))
                    }
                }
            }catch (e : Exception){
                Log.i("LoginViewModel", e.message.toString())
                _loginState.postValue(ApiState.Error("Something unexpected went wrong!"))
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