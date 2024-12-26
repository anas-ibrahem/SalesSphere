package com.example.salessphere.network

import com.google.gson.annotations.SerializedName

data class LoginRequest(
    val email: String,
    val password: String
)

data class CloseDealRequest(
    val id: Int,
    val status: Int
)

data class ClaimDealRequest(
    val id: Int
)

data class ProfileUpdateRequest(
    @SerializedName("first_name") val firstName: String,
    @SerializedName("last_name") val lastName: String,
    @SerializedName("email") val email: String,
    @SerializedName("phone_number") val phoneNumber: String,
    @SerializedName("address") val address: String?,
    @SerializedName("profile_picture_url") val profilePictureUrl: String?
)

data class OpenDealRequest(
    @SerializedName("title") val title: String,
    @SerializedName("description") val description: String,
    @SerializedName("customer_budget") val customerBudget: Double,
    @SerializedName("expenses") val expenses: Double,
    @SerializedName("customer_id") val customerId: Int,
    @SerializedName("due_date") val dueDate: String,
)

data class AddCustomerRequest(
    @SerializedName("name") val name: String,
    @SerializedName("phone_number") val phoneNumber: String,
    @SerializedName("address") val address: String,
    @SerializedName("lead_source") val leadSource: String,
    @SerializedName("email") val email: String,
    @SerializedName("type") val type: Int, // 0 -> individual, 1 -> company
    @SerializedName("preferred_contact_method")
    val preferredContactMethod: Boolean, // false for email, true for phone
    @SerializedName("registration_date") val registrationDate: String
)









