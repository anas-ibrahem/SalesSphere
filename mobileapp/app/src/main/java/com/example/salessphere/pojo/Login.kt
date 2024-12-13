package com.example.salessphere.pojo

data class LoginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val token: String
)

sealed class LoginState {
    data object Loading : LoginState()
    data class Success(val response: LoginResponse) : LoginState()
    data class Error(val message: String) : LoginState()
}

