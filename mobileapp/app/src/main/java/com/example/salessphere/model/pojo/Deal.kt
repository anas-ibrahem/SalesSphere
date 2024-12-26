package com.example.salessphere.model.pojo


import com.google.gson.annotations.SerializedName
data class Deal(
    @SerializedName("id") val id: Int,
    @SerializedName("title") val title: String,
    @SerializedName("description") val description: String,
    @SerializedName("status") val status: Int, // 0 -> open, 1 -> claimed, 2 -> closed_won, 3 -> closed_lost
    @SerializedName("customer") val customer: Customer,
    @SerializedName("customer_budget") val customerBudget: Double,
    @SerializedName("expenses") val expenses: Double,
    @SerializedName("date_opened") val dateOpened: String,
    @SerializedName("date_claimed") val dateClaimed: String?,
    @SerializedName("date_closed") val dateClosed: String?,
    @SerializedName("due_date") val dueDate: String
)