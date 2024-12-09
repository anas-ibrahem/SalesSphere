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
    private val _openDeals : MutableLiveData<List<Deal>> = MutableLiveData()
    val openDeals : LiveData<List<Deal>>
        get() = _openDeals

    private val _claimedDeals : MutableLiveData<List<Deal>> = MutableLiveData()
    val claimedDeals : LiveData<List<Deal>>
        get() = _claimedDeals


    init {
        getClaimedDeals()
        getOpenDeals()
    }

    fun getOpenDeals(){
        viewModelScope.launch(Dispatchers.IO){
            val deals = apiService.getOpenDeals().body()
            withContext(Dispatchers.Main){
                if (!deals.isNullOrEmpty()){
                    _openDeals.postValue(deals!!)
                }
                else{
                    Log.i("elablkash" , "elablkash")
                }
            }
        }
    }
    fun getClaimedDeals(){
        viewModelScope.launch(Dispatchers.IO){
            val deals = apiService.getClaimedDeals().body()
            withContext(Dispatchers.Main){
                if (!deals.isNullOrEmpty()){
                    _claimedDeals.postValue(deals!!)
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