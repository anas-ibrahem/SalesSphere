package com.example.salessphere.model.pojo

import com.google.gson.annotations.SerializedName
data class FinancialRecord(
    @SerializedName("amount") val amount: Double,
    @SerializedName("transaction_date") val transactionDate: String,
    @SerializedName("type") val type: Int, // Income 0, Expense 1
    @SerializedName("payment_method") val paymentMethod: Int, // Cash -> 0, Credit Card -> 1, Bank Transfer -> 2, Electronic Payment -> 3
    @SerializedName("deal_id") val dealId: Int,
    @SerializedName("description") val description : String
)
