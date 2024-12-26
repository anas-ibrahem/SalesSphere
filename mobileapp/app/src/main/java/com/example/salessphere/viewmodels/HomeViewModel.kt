package com.example.salessphere.viewmodels

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.salessphere.network.ApiService
import com.example.salessphere.model.summary.CustomersSummary
import com.example.salessphere.model.summary.EmployeeDealsSummary
import com.example.salessphere.model.summary.EmployeeFinancialSummary
import com.example.salessphere.model.pojo.EmployeeTarget
import com.example.salessphere.model.summary.EmployeeSummary
import com.example.salessphere.util.CurrentEmployee
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class HomeViewModel(private val apiService: ApiService) : ViewModel() {

    private val _unseenNotificationsCount : MutableLiveData<Int> = MutableLiveData()
    val unseenNotificationsCount : LiveData<Int>
        get() = _unseenNotificationsCount

    private val _targets : MutableLiveData<List<EmployeeTarget>> = MutableLiveData()
    val targets : LiveData<List<EmployeeTarget>>
        get() = _targets


    private val _employeeFinancialSummary : MutableLiveData<EmployeeFinancialSummary> = MutableLiveData()
    val employeeFinancialSummary : LiveData<EmployeeFinancialSummary>
        get() = _employeeFinancialSummary

    private val _employeeSummary : MutableLiveData<EmployeeSummary> = MutableLiveData()
    val employeeSummary : LiveData<EmployeeSummary>
        get() = _employeeSummary


    fun getUnseenNotificationsCount(){
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val response = apiService.getUnreadNotificationCount()
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        _unseenNotificationsCount.postValue(response.body())
                    } else {
                        Log.i("HomeVewModel", response.message())
                    }
                }
            } catch (e: Exception) {
                Log.i("HomeVewModel", e.message.toString())
            }
        }
    }

    fun getEmployeeSummary(){
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val response = apiService.getEmployeeSummary(CurrentEmployee.id!!)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        response.body()?.let {
                            _employeeSummary.postValue(it)
                        }
                    } else {
                        Log.i("HomeVewModel", response.message())
                    }
                }
            } catch (e: Exception) {
                Log.i("HomeVewModel", e.message.toString())
            }
        }
    }

    fun getEmployeeFinancialSummary(){
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val response = apiService.getEmployeeFinancialSummary()
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        response.body()?.let {
                            _employeeFinancialSummary.postValue(it)
                        }
                    } else {
                        Log.i("HomeVewModel", response.message())
                    }
                }
            } catch (e: Exception) {
                Log.i("HomeVewModel", e.message.toString())
            }
        }
    }

    fun getEmployeeActiveTargets() {
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val response = apiService.getEmployeeActiveTargets(CurrentEmployee.id!!)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        response.body()?.let {
                            _targets.postValue(it)
                        }
                    } else {
                        Log.i("HomeVewModel", response.message())
                    }
                }
            } catch (e: Exception) {
                Log.i("HomeVewModel", e.message.toString())
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