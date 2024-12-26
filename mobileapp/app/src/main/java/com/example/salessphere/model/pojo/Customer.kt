package com.example.salessphere.model.pojo

import com.google.gson.annotations.SerializedName
data class Customer(
    @SerializedName("id") val id: Int,
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
