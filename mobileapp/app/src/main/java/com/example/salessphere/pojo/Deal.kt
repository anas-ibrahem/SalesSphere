package com.example.salessphere.pojo

import com.google.gson.annotations.SerializedName

data class Deal(
    @SerializedName("id") val id: Int,
    @SerializedName("title") val title: String,
    @SerializedName("description") val description: String,
    @SerializedName("status") val status: String,
    @SerializedName("customer_id") val customerId: Int,
    @SerializedName("customer_budget") val customerBudget: Float,
    @SerializedName("expenses") val expenses: Float,
    @SerializedName("date_claimed") val dateClaimed: String?,
    @SerializedName("date_closed") val dateClosed: String?,
    @SerializedName("date_opened") val dateOpened: String,
    @SerializedName("due_date") val dueDate: String,
    @SerializedName("deal_executor") val dealExecutor: Int?,
    @SerializedName("deal_opener") val dealOpener: Int,
)