package com.example.salessphere.network

data class LoginResponse(
    val token: String
)

data class DefaultResponse(
    val message : String
)

data class CloseDealResponse(
    val status: Int
)

data class NotificationResponse(
    val success : Boolean
)

data class AddCustomerResponse(
    val id : Int
)

data class OpenDealResponse(
    val id : Int
)