package com.example.salessphere.model.summary

import com.google.gson.annotations.SerializedName

data class EmployeeFinancialSummary(
    @SerializedName("income") val totalIncome : Double,
    @SerializedName("expenses") val totalExpenses : Double,
    @SerializedName("net_balance") val netBalance : Double
)
