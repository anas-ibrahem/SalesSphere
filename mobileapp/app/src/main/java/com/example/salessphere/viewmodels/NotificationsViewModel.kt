package com.example.salessphere.viewmodels

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.salessphere.network.ApiService
import com.example.salessphere.model.pojo.Notification
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class NotificationsViewModel(val apiService: ApiService) : ViewModel() {
    private val _notifications: MutableLiveData<List<Notification>> = MutableLiveData()
    val notifications: LiveData<List<Notification>>
        get() = _notifications

    private val _markAsReadState : MutableLiveData<Boolean> = MutableLiveData()
    val markAsReadState : LiveData<Boolean>
        get() = _markAsReadState



    init {
        getNotifications()
    }

    fun getNotifications(){
        viewModelScope.launch(Dispatchers.IO){
            try{
                val response = apiService.getNotifications()
                withContext(Dispatchers.Main) {
                    if(response.isSuccessful && response.body() != null){
                        _notifications.postValue(response.body()!!)
                    }
                    else{
                        Log.i("NotificationsViewModel" , "No notifications found")
                    }
                }
            }catch (e : Exception){
                Log.i("NotificationsViewModel", e.message.toString())
            }
        }
    }

    fun markAsRead(id : Int){
        viewModelScope.launch(Dispatchers.IO){
            try{
                val response = apiService.markAsRead(id)
                if (response.isSuccessful && response.body() != null){
                    _markAsReadState.postValue(true)
                }
            }catch (e : Exception){
                Log.i("NotificationsViewModel", e.message.toString())
            }
        }
    }

    fun markAllAsRead(){
        viewModelScope.launch(Dispatchers.IO){
            try{
                val response = apiService.markAllAsRead()
                if (response.isSuccessful && response.body() != null){
                    _markAsReadState.postValue(true)
                }
            }catch (e : Exception){
                Log.i("NotificationsViewModel", e.message.toString())
            }
        }
    }



}

class NotificationsFactory(val apiService: ApiService) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(NotificationsViewModel::class.java)) {
            return NotificationsViewModel(apiService) as T
        } else {
            throw IllegalArgumentException()
        }
    }
}