package com.example.salessphere.model.summary

import com.google.gson.annotations.SerializedName

class CustomersSummary(
    @SerializedName("customers_count") val customersCount: Int
)