package com.example.salessphere.model.summary

import com.google.gson.annotations.SerializedName


data class DealFinancialSummary(
    @SerializedName("total_earned") val totalIncome: Double,
    @SerializedName("total_spent") val totalExpenses: Double,
)
