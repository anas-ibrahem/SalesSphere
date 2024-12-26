package com.example.salessphere.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.salessphere.R
import com.example.salessphere.model.pojo.EmployeeBadge
import com.example.salessphere.util.BadgeType
import com.example.salessphere.util.Utils
import com.google.android.material.chip.Chip

class BadgeAdapter(var employeeBadges : List<EmployeeBadge>) : RecyclerView.Adapter<BadgeAdapter.BadgeViewHolder>() {

    class BadgeViewHolder(val badgeItem : View) : RecyclerView.ViewHolder(badgeItem) {
        val badgeName : TextView = badgeItem.findViewById(R.id.tvBadgeName)
        val badgeDescription : TextView = badgeItem.findViewById(R.id.tvBadgeDescription)
        val badgeIcon : ImageView = badgeItem.findViewById(R.id.ivBadgeIcon)
        val statusChip : Chip = badgeItem.findViewById(R.id.chipBadgeType)
        val dateAwarded : TextView = badgeItem.findViewById(R.id.tvDateAwarded)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BadgeViewHolder {
        val layout = LayoutInflater.from(parent.context).inflate(R.layout.item_badge,parent,false)
        return BadgeViewHolder(layout)
    }

    override fun getItemCount(): Int {
        return employeeBadges.size
    }

    override fun onBindViewHolder(holder: BadgeViewHolder, position: Int) {
        val currentBadge = employeeBadges[position]

        holder.badgeName.text = currentBadge.name
        holder.badgeDescription.text = currentBadge.description

        val dateAwarded = Utils.formatDateTime(currentBadge.dateAwarded , "dd/MM/yyyy")
        holder.dateAwarded.text = dateAwarded
        when(currentBadge.type){
            BadgeType.DEALS_OPENED.ordinal -> {
                holder.statusChip.text = "${currentBadge.requiredPoints} Deals"
                holder.badgeIcon.setImageResource(R.drawable.ic_badge_open_deal)
            }
            BadgeType.DEALS_CLOSED.ordinal -> {
                holder.statusChip.text = "${currentBadge.requiredPoints} Deals"
                holder.badgeIcon.setImageResource(R.drawable.ic_badge_close_deal)
            }
            BadgeType.CUSTOMERS_ADDED.ordinal -> {
                holder.statusChip.text = "${currentBadge.requiredPoints} Customers"
                holder.badgeIcon.setImageResource(R.drawable.ic_badge_customer)
            }
            BadgeType.REVENUE_GENERATED.ordinal -> {
                holder.statusChip.text = "$${currentBadge.requiredPoints} Revenue"
                holder.badgeIcon.setImageResource(R.drawable.ic_badge_revenue)
            }
            BadgeType.BADGES_EARNED.ordinal -> {
                holder.statusChip.text = "${currentBadge.requiredPoints} Badges"
                holder.badgeIcon.setImageResource(R.drawable.ic_badge_badge)
            }
        }
    }
}