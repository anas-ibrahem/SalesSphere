package com.example.salessphere.adapters

import android.app.Activity
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.example.salessphere.R
import com.example.salessphere.activities.DealDetailsActivity
import com.example.salessphere.activities.MainActivity
import com.example.salessphere.pojo.Deal

class DealAdapter(var deals : List<Deal> , val page : Int , val activity : Activity) : RecyclerView.Adapter<DealAdapter.DealViewHolder>(){
    class DealViewHolder (val dealItem : View) :RecyclerView.ViewHolder(dealItem){
        val title : TextView = dealItem.findViewById(R.id.dealTitleTextView)
        val customerName : TextView = dealItem.findViewById(R.id.customerNameTextView)
        val expectedRevenue : TextView = dealItem.findViewById(R.id.revenueTextView)
        val deadline : TextView = dealItem.findViewById(R.id.deadlineTextView)
        val viewDetailsBtn : Button  = dealItem.findViewById(R.id.viewDetailsButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DealViewHolder {
        val layout = LayoutInflater.from(parent.context).inflate(R.layout.deal_item,parent,false)
        return DealViewHolder(layout)
    }

    override fun getItemCount(): Int {
        return deals.size
    }

    override fun onBindViewHolder(holder: DealViewHolder, position: Int) {
        val currentDeal = deals[position]
        holder.title.text = currentDeal.title
        holder.customerName.text = "Customer: ${currentDeal.customerId}"
        val revenue = currentDeal.customerBudget - currentDeal.expenses
        holder.expectedRevenue.text = "$$revenue"
        holder.deadline.text = currentDeal.dueDate
        holder.viewDetailsBtn.setOnClickListener {
            val intent = Intent(activity , DealDetailsActivity::class.java)
            intent.putExtra("DEAL_ID" , currentDeal.id)
            activity.startActivity(intent)
        }
    }
}