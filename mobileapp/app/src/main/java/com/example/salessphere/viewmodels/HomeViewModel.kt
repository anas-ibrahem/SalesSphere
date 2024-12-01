package com.example.salessphere.viewmodels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.salessphere.network.RetrofitService
import com.example.salessphere.pojo.Employee
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class HomeViewModel(val retrofitService: RetrofitService) : ViewModel() {
    private val _employees : MutableLiveData<List<Employee>> = MutableLiveData()
    val employees : LiveData<List<Employee>>
        get() = _employees


     fun getAllEmployees(){
        viewModelScope.launch(Dispatchers.IO){
            val myEmployees = retrofitService.getAllEmployees().body()
            withContext(Dispatchers.Main){
                if (!myEmployees.isNullOrEmpty()){
                    _employees.postValue(myEmployees!!)
                }
            }

        }
    }
}

class HomeFactory(val retrofitService: RetrofitService) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(HomeViewModel::class.java)) {
            return HomeViewModel(retrofitService) as T
        } else {
            throw IllegalArgumentException()
        }
    }
}