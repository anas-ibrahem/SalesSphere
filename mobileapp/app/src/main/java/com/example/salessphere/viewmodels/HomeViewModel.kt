package com.example.salessphere.viewmodels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.salessphere.network.ApiService
import com.example.salessphere.pojo.Employee
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class HomeViewModel(val apiService: ApiService) : ViewModel() {
    private val _employees : MutableLiveData<List<Employee>> = MutableLiveData()
    val employees : LiveData<List<Employee>>
        get() = _employees

    init {
        getAllEmployees()
    }


     private fun getAllEmployees(){
        viewModelScope.launch(Dispatchers.IO){
            val myEmployees = apiService.getAllEmployees().body()
            withContext(Dispatchers.Main){
                if (!myEmployees.isNullOrEmpty()){
                    _employees.postValue(myEmployees!!)
                }
            }

        }
    }
}

class HomeFactory(val apiService: ApiService) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(HomeViewModel::class.java)) {
            return HomeViewModel(apiService) as T
        } else {
            throw IllegalArgumentException()
        }
    }
}