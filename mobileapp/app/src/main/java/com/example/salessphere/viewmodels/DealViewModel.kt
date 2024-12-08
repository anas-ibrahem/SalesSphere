package com.example.salessphere.viewmodels

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.salessphere.network.ApiService
import com.example.salessphere.pojo.Deal
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class DealViewModel(val apiService: ApiService) : ViewModel() {
    private val _deals : MutableLiveData<List<Deal>> = MutableLiveData()
    val deals : LiveData<List<Deal>>
        get() = _deals

    init {
        getAllDeals()
    }
    private fun getAllDeals(){
        viewModelScope.launch(Dispatchers.IO){
            val myDeals = apiService.getAllDeals().body()
            withContext(Dispatchers.Main){
                if (!myDeals.isNullOrEmpty()){
                    _deals.postValue(myDeals!!)
                }
                else{
                    Log.i("elablkash" , "elablkash")
                }
            }
        }
    }
}

class DealFactory(val apiService: ApiService) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(DealViewModel::class.java)) {
            return DealViewModel(apiService) as T
        } else {
            throw IllegalArgumentException()
        }
    }
}