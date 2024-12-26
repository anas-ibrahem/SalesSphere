package com.example.salessphere.viewmodels

import com.example.salessphere.util.DealStatus
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.salessphere.network.DefaultResponse
import com.example.salessphere.network.ApiService
import com.example.salessphere.network.ApiState
import com.example.salessphere.network.ClaimDealRequest
import com.example.salessphere.network.CloseDealRequest
import com.example.salessphere.network.CloseDealResponse
import com.example.salessphere.model.pojo.Deal
import com.example.salessphere.model.summary.DealFinancialSummary
import com.example.salessphere.model.pojo.FinancialRecord
import com.example.salessphere.util.Utils
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext


class DealDetailsViewModel(private val apiService: ApiService, private  val dealId : Int) : ViewModel() {
    private val _deal: MutableLiveData<Deal> = MutableLiveData()
    val deal: LiveData<Deal>
        get() = _deal

    private val _financialRecords: MutableLiveData<List<FinancialRecord>> = MutableLiveData()
    val financialRecords: LiveData<List<FinancialRecord>>
        get() = _financialRecords

    private val _financialSummary: MutableLiveData<DealFinancialSummary> = MutableLiveData()
    val financialSummary: LiveData<DealFinancialSummary>
        get() = _financialSummary


    private val _addFinancialRecordState: MutableLiveData<ApiState<FinancialRecord>> = MutableLiveData()
    val addFinancialRecordState: LiveData<ApiState<FinancialRecord>>
        get() = _addFinancialRecordState


    private val _claimDealState : MutableLiveData<ApiState<DefaultResponse>> = MutableLiveData()
    val claimDealState : LiveData<ApiState<DefaultResponse>>
        get() = _claimDealState

    private val _closeDealState : MutableLiveData<ApiState<CloseDealResponse>> = MutableLiveData()
    val closeDealState : LiveData<ApiState<CloseDealResponse>>
        get() = _closeDealState

    init {
        getDealById()
        getFinancialRecordsByDealId()
        getDealFinancialSummary()
    }

    fun getDealById() {
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val response = apiService.getDealById(dealId)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        _deal.postValue(response.body()!!)
                    } else {
                        Log.i("DealDetailsViewModel", response.message())
                    }
                }
            } catch (e: Exception) {
                Log.i("DealDetailsViewModel", e.message.toString())
            }
        }
    }

    fun claimDeal() {
        viewModelScope.launch(Dispatchers.IO) {
            _claimDealState.postValue(ApiState.Loading)
            try {
                val response = apiService.claimDeal(ClaimDealRequest(dealId))
                if(response.isSuccessful && response.body() != null){
                    _claimDealState.postValue((ApiState.Success(response.body()!!)))
                }
                else{
                    val error = Utils.extractErrorMessage(response.errorBody()?.string()!!)
                    _claimDealState.postValue(ApiState.Error(error))
                }
            } catch (e: Exception) {
                Log.i("DealDetailsViewModel", e.message.toString())
                _claimDealState.postValue(ApiState.Error("Something unexpected went wrong!"))
            }
        }
    }


    fun closeDeal(status: DealStatus){
        viewModelScope.launch(Dispatchers.IO) {
            _closeDealState.postValue(ApiState.Loading)
            try {
                val response = apiService.closeDeal(CloseDealRequest(dealId, status.ordinal))
                if(response.isSuccessful && response.body() != null){
                    _closeDealState.postValue((ApiState.Success(response.body()!!)))
                }
                else{
                    val error = Utils.extractErrorMessage(response.errorBody()?.string()!!)
                    _closeDealState.postValue(ApiState.Error(error))
                }
            } catch (e: Exception) {
                Log.i("DealDetailsViewModel", e.message.toString())
                _closeDealState.postValue(ApiState.Error("Something unexpected went wrong!"))
            }
        }
    }

    fun addFinancialRecord(financialRecord : FinancialRecord){
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val response = apiService.addFinancialRecord(financialRecord)
                if (response.isSuccessful && response.body() != null) {
                    _addFinancialRecordState.postValue(ApiState.Success(response.body()!!))
                }
                else{
                    val error = Utils.extractErrorMessage(response.errorBody()?.string()!!)
                    _addFinancialRecordState.postValue(ApiState.Error(error))
                }
            } catch (e: Exception) {
                Log.i("DealDetailsViewModel", e.message.toString())
                _addFinancialRecordState.postValue(ApiState.Error("Something unexpected went wrong!"))
            }
        }
    }

    fun getFinancialRecordsByDealId(){
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val response = apiService.getDealFinancialRecords(dealId)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        _financialRecords.postValue(response.body()!!)
                    } else {
                        Log.i("DealDetailsViewModel", response.message())
                    }
                }
            } catch (e: Exception) {
                Log.i("DealDetailsViewModel", e.message.toString())
            }
        }
    }

    fun getDealFinancialSummary(){
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val response = apiService.getDealFinancialSummary(dealId)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                       _financialSummary.postValue(response.body()!!)
                    } else {
                        Log.i("DealDetailsViewModel", response.message())
                    }
                }
            } catch (e: Exception) {
                Log.i("DealDetailsViewModel", e.message.toString())
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