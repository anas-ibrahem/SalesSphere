package com.example.salessphere.viewmodels

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.salessphere.model.pojo.Employee
import com.example.salessphere.network.ApiService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class ProfileViewModel(private val apiService: ApiService) : ViewModel() {
    private val _profile : MutableLiveData<Employee> = MutableLiveData()
    val profile : LiveData<Employee>
        get() = _profile

    fun getMyProfile(){
        try {
            viewModelScope.launch(Dispatchers.IO){
                val response = apiService.getMe()
                withContext(Dispatchers.Main){
                    if (response.isSuccessful && response.body() != null){
                        _profile.postValue(response.body())
                    }
                    else{
                        Log.i("HomeVewModel", response.message())
                    }
                }
            }
        } catch (e: Exception) {
            Log.i("HomeVewModel", e.message.toString())
        }
    }
}

class ProfileViewModelFactory(val apiService: ApiService) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(ProfileViewModel::class.java)) {
            return ProfileViewModel(apiService) as T
        } else {
            throw IllegalArgumentException()
        }
    }
}