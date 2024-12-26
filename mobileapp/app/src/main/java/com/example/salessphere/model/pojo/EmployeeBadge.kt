package com.example.salessphere.model.pojo

import com.google.gson.annotations.SerializedName
data class EmployeeBadge(
    @SerializedName("name") val name : String,
    @SerializedName("description") val description : String,
    @SerializedName("type") val type : Int, // 0 -> deals_open , 1 -> deals_closed , 2 -> customers_added
    @SerializedName("date_awarded") val dateAwarded : String,
    @SerializedName("required_points") val requiredPoints : Int
)