package com.example.salessphere.viewmodels

import android.net.Uri
import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.salessphere.network.DefaultResponse
import com.example.salessphere.network.ApiService
import com.example.salessphere.network.ApiState
import com.example.salessphere.network.ProfileUpdateRequest
import com.example.salessphere.model.pojo.Employee
import com.example.salessphere.util.Utils
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.asRequestBody
import org.json.JSONObject
import java.io.File

class EditProfileViewModel(private val apiService: ApiService) : ViewModel() {
    private val _profileUpdateState: MutableLiveData<ApiState<DefaultResponse>> = MutableLiveData()
    val profileUpdateState: LiveData<ApiState<DefaultResponse>>
        get() = _profileUpdateState

    private val _imageUploadStatus = MutableLiveData<ApiState<String>>()
    val imageUploadStatus: LiveData<ApiState<String>>
        get() = _imageUploadStatus


    private val cloudName = "dgmq83jx3"
    private val uploadPreset = "ml_default"

    fun saveChanges(newProfile : ProfileUpdateRequest) {
        viewModelScope.launch(Dispatchers.IO) {
            try {
                val response = apiService.updateEmployee(newProfile)
                withContext(Dispatchers.Main) {
                    if (response.isSuccessful && response.body() != null) {
                        _profileUpdateState.postValue(ApiState.Success(response.body()!!))
                    } else {
                        val error = Utils.extractErrorMessage(response.errorBody()?.string()!!)
                        _profileUpdateState.postValue(ApiState.Error(error))
                    }
                }
            } catch (e: Exception) {
                Log.i("PersonalInfoViewModel", e.message.toString())
                _profileUpdateState.postValue(ApiState.Error("Something unexpected went wrong!"))
            }
        }
    }

    fun uploadImageToCloudinary(imageUri: Uri, getRealPath: (Uri) -> String?) {
        val filePath = getRealPath(imageUri)
        if (filePath == null) {
            _imageUploadStatus.postValue(ApiState.Error("Failed to get file path"))
            return
        }

        val file = File(filePath)
        val requestBody = MultipartBody.Builder()
            .setType(MultipartBody.FORM)
            .addFormDataPart("file", file.name, file.asRequestBody("image/*".toMediaTypeOrNull()))
            .addFormDataPart("upload_preset", uploadPreset)
            .build()

        val client = OkHttpClient.Builder().build()

        val request = Request.Builder()
            .url("https://api.cloudinary.com/v1_1/$cloudName/image/upload")
            .post(requestBody)
            .build()

        viewModelScope.launch(Dispatchers.IO) {
            try {
                val response = client.newCall(request).execute()
                if (!response.isSuccessful) {
                    _imageUploadStatus.postValue(ApiState.Error("Upload failed: ${response.message}"))
                    return@launch
                }

                response.body?.let { body ->
                    val responseBody = body.string()
                    val json = JSONObject(responseBody)
                    val secureUrl = json.optString("secure_url", "")
                    if (secureUrl.isNotEmpty()) {
                        _imageUploadStatus.postValue(ApiState.Success(secureUrl))
                    } else {
                        _imageUploadStatus.postValue(ApiState.Error("Upload failed: No URL returned"))
                    }
                }
            } catch (e: Exception) {
                _imageUploadStatus.postValue(ApiState.Error("Upload failed: ${e.message}"))
            }
        }
    }

}

class EditProfileViewModelFactory(private val apiService: ApiService) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(EditProfileViewModel::class.java)) {
            return EditProfileViewModel(apiService) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}