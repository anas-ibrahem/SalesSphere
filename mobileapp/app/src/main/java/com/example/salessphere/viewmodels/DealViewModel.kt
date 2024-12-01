package com.example.salessphere.viewmodels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.salessphere.network.RetrofitService
import com.example.salessphere.pojo.Deal
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class DealViewModel(val retrofitService: RetrofitService) : ViewModel() {
    private val _deals : MutableLiveData<List<Deal>> = MutableLiveData()
    val deals : LiveData<List<Deal>>
        get() = _deals

    fun getAllDeals(){
        viewModelScope.launch(Dispatchers.IO){
            val myDeals = retrofitService.getAllDeals().body()
            withContext(Dispatchers.Main){
                if (!myDeals.isNullOrEmpty()){
                    _deals.postValue(myDeals!!)
                }
            }
        }
    }
}


class DealFactory(val retrofitService: RetrofitService) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(DealViewModel::class.java)) {
            return DealViewModel(retrofitService) as T
        } else {
            throw IllegalArgumentException()
        }
    }
}