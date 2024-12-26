package com.example.salessphere.network


sealed class ApiState<out T> {
    data class Success<out T>(val data: T) : ApiState<T>()
    data class Error(val error: String) : ApiState<Nothing>()
    data object Loading : ApiState<Nothing>()
}
