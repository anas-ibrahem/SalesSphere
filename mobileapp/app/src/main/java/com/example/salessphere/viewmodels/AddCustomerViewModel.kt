package com.example.salessphere.viewmodels

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.salessphere.model.pojo.Customer
import com.example.salessphere.network.AddCustomerRequest
import com.example.salessphere.network.AddCustomerResponse
import com.example.salessphere.network.ApiService
import com.example.salessphere.network.ApiState
import com.example.salessphere.network.OpenDealRequest
import com.example.salessphere.network.OpenDealResponse
import com.example.salessphere.util.Utils
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class AddCustomerViewModel(private val apiService: ApiService) : ViewModel() {

    private val _addCustomerStatus: MutableLiveData<ApiState<AddCustomerResponse>> = MutableLiveData()
    val addCustomerState: LiveData<ApiState<AddCustomerResponse>>
        get() = _addCustomerStatus

    fun addCustomer(addCustomerRequest: AddCustomerRequest) {
        try {
            viewModelScope.launch(Dispatchers.IO) {
                val response = apiService.addCustomer(addCustomerRequest)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        _addCustomerStatus.postValue(ApiState.Success(response.body()!!))
                    } else {
                        val error = Utils.extractErrorMessage(response.errorBody()?.string()!!)
                        _addCustomerStatus.postValue(ApiState.Error(error))
                    }
                }
            }
        } catch (e: Exception) {
            Log.i("CustomerViewModel", e.message.toString())
            _addCustomerStatus.postValue(ApiState.Error("Something unexpected went wrong!"))
        }
    }

}

class AddCustomerViewModelFactory(val apiService: ApiService) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(AddCustomerViewModel::class.java)) {
            return AddCustomerViewModel(apiService) as T
        } else {
            throw IllegalArgumentException()
        }
    }
}