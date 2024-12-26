package com.example.salessphere.viewmodels

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.salessphere.network.ApiService
import com.example.salessphere.model.pojo.Deal
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class DealViewModel(val apiService: ApiService) : ViewModel() {

    private val _salehOpenDeals : MutableLiveData<List<Deal>> = MutableLiveData()
    val salehOpenDeals : LiveData<List<Deal>>
        get() = _salehOpenDeals

    private val _salehClaimedDeals : MutableLiveData<List<Deal>> = MutableLiveData()
    val salehClaimedDeals : LiveData<List<Deal>>
        get() = _salehClaimedDeals

    private val _salehClosedDeals : MutableLiveData<List<Deal>> = MutableLiveData()
    val salehClosedDeals : LiveData<List<Deal>>
        get() = _salehClosedDeals

    private val _openDeals : MutableLiveData<List<Deal>> = MutableLiveData()
    val openDeals : LiveData<List<Deal>>
        get() = _openDeals

    private val _employeeClaimedDeals : MutableLiveData<List<Deal>> = MutableLiveData()
    val employeeClaimedDeals : LiveData<List<Deal>>
        get() = _employeeClaimedDeals

    private val _employeeClosedDeals : MutableLiveData<List<Deal>> = MutableLiveData()
    val employeeClosedDeals : LiveData<List<Deal>>
        get() = _employeeClosedDeals


    fun getSalehOpenDeals(){
        viewModelScope.launch(Dispatchers.IO){
            try{
                val response = apiService.getSalehOpenDeals()
                withContext(Dispatchers.Main) {
                    if(response.isSuccessful && response.body() != null){
                        _salehOpenDeals.postValue(response.body()!!)
                    }
                    else{
                        Log.i("DealViewModel" , "No open deals found")
                    }
                }
            }catch (e : Exception){
                Log.i("DealViewModel", e.message.toString())
            }
        }
    }

    fun getSalehClaimedDeals(){
        viewModelScope.launch(Dispatchers.IO){
            try{
                val response = apiService.getSalehClaimedDeals()
                withContext(Dispatchers.Main) {
                    if(response.isSuccessful && response.body() != null){
                        _salehClaimedDeals.postValue(response.body()!!)
                    }
                    else{
                        Log.i("DealViewModel" , "No claimed deals found")
                    }
                }
            }catch (e : Exception){
                Log.i("DealViewModel", e.message.toString())
            }
        }
    }

    fun getSalehClosedDeals(){
        viewModelScope.launch(Dispatchers.IO){
            try{
                val response = apiService.getSalehClosedDeals()
                withContext(Dispatchers.Main) {
                    if(response.isSuccessful && response.body() != null){
                        _salehClosedDeals.postValue(response.body()!!)
                    }
                    else{
                        Log.i("DealViewModel" , "No closed deals found")
                    }
                }
            }catch (e : Exception){
                Log.i("DealViewModel", e.message.toString())
            }
        }
    }


    fun getAllOpenDeals(){
        viewModelScope.launch(Dispatchers.IO){
            try{
                val response = apiService.getAllOpen()
                withContext(Dispatchers.Main) {
                    if(response.isSuccessful && response.body() != null){
                        _openDeals.postValue(response.body()!!)
                    }
                    else{
                        Log.i("DealViewModel" , "No open deals found")
                    }
                }
            }catch (e : Exception){
                Log.i("DealViewModel", e.message.toString())
            }
        }
    }
    fun getEmployeeClaimedDeals(){
        viewModelScope.launch(Dispatchers.IO){
            try{
                val response = apiService.getEmployeeClaimedDeals()
                withContext(Dispatchers.Main) {
                    if(response.isSuccessful && response.body() != null){
                        _employeeClaimedDeals.postValue(response.body()!!)
                    }
                    else{
                        Log.i("DealViewModel" , "No claimed deals found")
                    }
                }
            }catch (e : Exception){
                Log.i("DealViewModel", e.message.toString())
            }
        }
    }

    fun getEmployeeClosedDeals(){
        viewModelScope.launch(Dispatchers.IO){
            try{
                val response = apiService.getEmployeeClosedDeals()
                withContext(Dispatchers.Main) {
                    if(response.isSuccessful && response.body() != null){
                        _employeeClosedDeals.postValue(response.body()!!)
                    }
                    else{
                        Log.i("DealViewModel" , "No closed deals found")
                    }
                }
            }catch (e : Exception){
                Log.i("DealViewModel", e.message.toString())
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