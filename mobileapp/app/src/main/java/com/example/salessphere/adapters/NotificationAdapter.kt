package com.example.salessphere.adapters

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.core.view.isVisible
import androidx.recyclerview.widget.RecyclerView
import com.example.salessphere.R
import com.example.salessphere.model.pojo.Notification
import com.example.salessphere.util.NotificationPriority
import com.example.salessphere.util.NotificationType
import com.example.salessphere.util.Utils

class NotificationAdapter(var notifications : List<Notification>) : RecyclerView.Adapter<NotificationAdapter.NotificationViewHolder>() {

    class NotificationViewHolder(val notificationItem : View) : RecyclerView.ViewHolder(notificationItem) {
        val title : TextView = notificationItem.findViewById(R.id.notificationTitleTv)
        val tvHighPriority : TextView = notificationItem.findViewById(R.id.tvHighPriority)
        val content : TextView = notificationItem.findViewById(R.id.notificationContentTv)
        val date : TextView = notificationItem.findViewById(R.id.notificationDateTv)
        val seenIndicator : View = notificationItem.findViewById(R.id.seenIndicator)
        val typeIcon : ImageView = notificationItem.findViewById(R.id.typeIcon)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): NotificationViewHolder {
        val layout = LayoutInflater.from(parent.context).inflate(R.layout.item_notification,parent,false)
        return NotificationViewHolder(layout)
    }

    override fun getItemCount(): Int {
        return notifications.size
    }

    override fun onBindViewHolder(holder: NotificationViewHolder, position: Int) {
        val currentNotification = notifications[position]

        holder.title.text = currentNotification.title
        holder.content.text = currentNotification.content
        holder.date.text = Utils.formatDateTime(currentNotification.date , "dd/MM/yyyy  hh:mm a")

        val iconRes = when(currentNotification.type){
            NotificationType.GENERAL.ordinal -> R.drawable.ic_notifications
            NotificationType.CUSTOMER.ordinal -> R.drawable.ic_badge_customer
            NotificationType.DEAL.ordinal -> R.drawable.ic_badge_open_deal
            NotificationType.DEADLINE.ordinal -> R.drawable.ic_deadline
            NotificationType.TARGET.ordinal -> R.drawable.ic_target
            NotificationType.BADGE.ordinal -> R.drawable.ic_badge
            NotificationType.FINANCE.ordinal -> R.drawable.ic_money
            else -> R.drawable.ic_notifications
        }
        holder.typeIcon.setImageResource(iconRes)
        holder.seenIndicator.isVisible = !currentNotification.seen
        if (!currentNotification.seen) {
            holder.notificationItem.setBackgroundColor(ContextCompat.getColor(holder.notificationItem.context, R.color.unread_background))
        } else {
            holder.notificationItem.setBackgroundColor(Color.WHITE)
        }

        if (currentNotification.priority == NotificationPriority.HIGH.ordinal) {
            holder.tvHighPriority.text = "(High Priority)"
        }
    }

    fun getNotificationAt(position: Int): Notification? {
        return if (position in notifications.indices) notifications[position] else null
    }
}