package com.example.salessphere.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.example.salessphere.R
import com.example.salessphere.model.pojo.EmployeeTarget
import com.example.salessphere.util.TargetType
import com.example.salessphere.util.Utils
import com.google.android.material.chip.Chip
import com.google.android.material.progressindicator.LinearProgressIndicator
import java.time.LocalDate
import java.time.temporal.ChronoUnit

class TargetAdapter(var employeeTargets : List<EmployeeTarget>) : RecyclerView.Adapter<TargetAdapter.TargetViewHolder>() {

    class TargetViewHolder(targetItem : View) : RecyclerView.ViewHolder(targetItem) {
        val tvTargetDescription : TextView = targetItem.findViewById(R.id.tvTargetDescription)
        val progressBar : LinearProgressIndicator = targetItem.findViewById(R.id.progressBar)
        val tvProgressNumber : TextView = targetItem.findViewById(R.id.tvProgressNumber)
        val tvProgressPercentage : TextView = targetItem.findViewById(R.id.tvProgressPercentage)
        val chipDaysLeft : Chip = targetItem.findViewById(R.id.chipDaysLeft)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TargetViewHolder {
        val layout = LayoutInflater.from(parent.context).inflate(R.layout.item_target,parent,false)
        return TargetViewHolder(layout)
    }

    override fun getItemCount(): Int {
        return employeeTargets.size
    }

    override fun onBindViewHolder(holder: TargetViewHolder, position: Int) {
        val currentTarget = employeeTargets[position]

        val deadline = Utils.convertToLocalDate(currentTarget.deadline)
        val dateToday = LocalDate.now()
        val daysDifference = ChronoUnit.DAYS.between(dateToday, deadline)

        holder.tvTargetDescription.text = currentTarget.description
        holder.chipDaysLeft.text = "$daysDifference days left"
        val progressPercentage = ((currentTarget.progress.toFloat() / currentTarget.goal.toFloat()) * 100).toInt()
        holder.progressBar.max = currentTarget.goal

        if (currentTarget.progress >= currentTarget.goal) {
            holder.progressBar.setIndicatorColor(
                ContextCompat.getColor(
                    holder.itemView.context,
                    R.color.status_closed_won
                )
            )
            holder.progressBar.progress = currentTarget.goal
            holder.tvProgressPercentage.text = "100%"
        }
        else{
            holder.progressBar.progress = currentTarget.progress
            holder.tvProgressPercentage.text = "$progressPercentage%"
        }

        if (currentTarget.type == TargetType.REVENUE_GENERATED.ordinal){
            holder.tvProgressNumber.text = "$${Utils.formatMoney(currentTarget.progress.toDouble()) } / $${Utils.formatMoney(currentTarget.goal.toDouble())}"
        }
        else{
            holder.tvProgressNumber.text = "${currentTarget.progress} / ${currentTarget.goal}"
        }

    }
}