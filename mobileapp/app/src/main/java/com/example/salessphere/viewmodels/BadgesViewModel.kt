package com.example.salessphere.viewmodels

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.salessphere.network.ApiService
import com.example.salessphere.model.pojo.EmployeeBadge
import com.example.salessphere.util.CurrentEmployee
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class BadgesViewModel(private val apiService: ApiService) : ViewModel() {
    private val _badges: MutableLiveData<List<EmployeeBadge>> = MutableLiveData()
    val badges: LiveData<List<EmployeeBadge>>
        get() = _badges

    init {
        getBadges()
    }

    private fun getBadges() {
        try {
            viewModelScope.launch(Dispatchers.IO) {
                val response = apiService.getEmployeeBadges()
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful) {
                        response.body()?.let {
                            _badges.postValue(it)
                        }
                    } else {
                        Log.i("BadgesViewModel", "No badges found")
                    }
                }
            }
        } catch (e: Exception) {
            Log.i("BadgesViewModel", e.message.toString())
        }
    }

}

class BadgesFactory(private val apiService: ApiService) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(BadgesViewModel::class.java)) {
            return BadgesViewModel(apiService) as T
        } else {
            throw IllegalArgumentException()
        }
    }
}