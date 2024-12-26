package com.example.salessphere.model.pojo

import com.google.gson.annotations.SerializedName

data class EmployeeTarget(
    @SerializedName("type") val type: Int, // 0 -> deals_open , 1 -> deals_closed , 2 -> customers_added , 3 -> revenue
    @SerializedName("goal") val goal: Int,
    @SerializedName("progress") val progress: Int,
    @SerializedName("description") val description: String,
    @SerializedName("deadline") val deadline: String,
    @SerializedName("start_date") val startDate: String,
)
