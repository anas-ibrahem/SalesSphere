package com.example.salessphere.model.pojo

import com.google.gson.annotations.SerializedName
data class Employee(
    @SerializedName("id") val id : Int,
    @SerializedName("email") val email : String,
    @SerializedName("role") val role : Int, // 0 -> deal_opener, 1 -> deal_closer
    @SerializedName("first_name") val firstName : String,
    @SerializedName("last_name") val lastName : String,
    @SerializedName("birth_date") val birthDate : String,
    @SerializedName("phone_number") val phoneNumber : String,
    @SerializedName("profile_picture_url") val profilePictureUrl : String?,
    @SerializedName("address") val address : String?,
    @SerializedName("account_creation_date") val accountCreationDate : String
)