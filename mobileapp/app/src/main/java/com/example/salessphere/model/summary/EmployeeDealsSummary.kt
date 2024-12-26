package com.example.salessphere.model.summary

import com.google.gson.annotations.SerializedName

data class EmployeeDealsSummary(
    @SerializedName("open_deals_count")
    val openDealsCount: Int,

    @SerializedName("claimed_deals_count")
    val claimedDealsCount: Int,

    @SerializedName("closed_won_deals_count")
    val closedWonDealsCount: Int,

    @SerializedName("closed_lost_deals_count")
    val closedLostDealsCount: Int
)
