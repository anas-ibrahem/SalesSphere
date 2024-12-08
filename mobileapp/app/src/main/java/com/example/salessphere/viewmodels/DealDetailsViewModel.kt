package com.example.salessphere.viewmodels

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


class DealDetailsViewModel(private val apiService: ApiService, private  val dealId : Int) : ViewModel() {
    private val _deal : MutableLiveData<Deal> = MutableLiveData()
    val deal : LiveData<Deal>
        get() = _deal

    init {
        getDealById()
    }
    private fun getDealById(){
        viewModelScope.launch(Dispatchers.IO){
            val myDeal = apiService.getDealById(dealId).body()
            withContext(Dispatchers.Main){
                if (myDeal != null)
                    _deal.postValue(myDeal!!)
            }
        }
    }
}

class DealDetailFactory(val apiService: ApiService, val dealId : Int) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(DealDetailsViewModel::class.java)) {
            return DealDetailsViewModel(apiService , dealId) as T
        } else {
            throw IllegalArgumentException()
        }
    }
}