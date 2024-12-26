package com.example.salessphere.viewmodels

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.salessphere.model.pojo.Customer
import com.example.salessphere.network.AddCustomerResponse
import com.example.salessphere.network.ApiService
import com.example.salessphere.network.ApiState
import com.example.salessphere.util.Utils
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class CustomerViewModel(val apiService: ApiService) : ViewModel() {

    private val _customers : MutableLiveData<List<Customer>> = MutableLiveData()
    val customers: LiveData<List<Customer>>
        get() = _customers

    fun getAllCustomers() {
        try {
            viewModelScope.launch(Dispatchers.IO) {
                val response = apiService.getAllCustomers()
                withContext(Dispatchers.Main){
                    if (response.isSuccessful && response.body() != null) {
                        _customers.postValue(response.body())
                    } else {
                        Log.i("CustomerViewModel" , "No customers found")
                    }
                }
            }
        } catch (e: Exception) {
            Log.i("CustomerViewModel", e.message.toString())
        }
    }
}


class CustomerFactory(private val apiService: ApiService) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(CustomerViewModel::class.java)) {
            return CustomerViewModel(apiService) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}