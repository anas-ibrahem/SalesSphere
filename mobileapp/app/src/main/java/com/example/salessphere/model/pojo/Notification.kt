package com.example.salessphere.model.pojo


data class Notification(
    val id: Int,
    val title: String,
    val content: String,
    val date: String,
    val type: Int, // 0 -> general , 1 -> customer_added , 2 -> deal_opened , 3 -> deadline , 4 -> target , 5 -> badge
    val priority : Int, // 0 -> low , 1 -> high
    val recipient: Int,
    var seen: Boolean // Whether the notification has been seen
)
