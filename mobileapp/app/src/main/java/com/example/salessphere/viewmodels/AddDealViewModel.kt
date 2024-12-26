package com.example.salessphere.viewmodels

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.salessphere.model.pojo.Customer
import com.example.salessphere.network.ApiService
import com.example.salessphere.network.ApiState
import com.example.salessphere.network.OpenDealRequest
import com.example.salessphere.network.OpenDealResponse
import com.example.salessphere.util.Utils
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class AddDealViewModel(private val apiService: ApiService) : ViewModel() {

    private val _openDealStatus : MutableLiveData<ApiState<OpenDealResponse>> = MutableLiveData()
    val openDealStatus : LiveData<ApiState<OpenDealResponse>>
        get() = _openDealStatus

    private val _customers : MutableLiveData<List<Customer>> = MutableLiveData()
    val customers: LiveData<List<Customer>>
        get() = _customers

    fun openDeal(openDealRequest : OpenDealRequest){
        try{
            viewModelScope.launch(Dispatchers.IO){
                val response = apiService.openDeal(openDealRequest)
                withContext(Dispatchers.Main){
                    if (response.isSuccessful && response.body() != null){
                        _openDealStatus.postValue(ApiState.Success(response.body()!!))
                    }else{
                        val error = Utils.extractErrorMessage(response.errorBody()?.string()!!)
                        _openDealStatus.postValue(ApiState.Error(error))
                    }
                }
            }
        }catch (e: Exception){
            Log.i("AddDealViewModel", e.message.toString())
            _openDealStatus.postValue(ApiState.Error("Something unexpected went wrong!"))
        }
    }

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

class AddDealViewModelFactory(val apiService: ApiService) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(AddDealViewModel::class.java)) {
            return AddDealViewModel(apiService) as T
        } else {
            throw IllegalArgumentException()
        }
    }
}