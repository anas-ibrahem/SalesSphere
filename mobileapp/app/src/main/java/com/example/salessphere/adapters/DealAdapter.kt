package com.example.salessphere.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.example.salessphere.R
import com.example.salessphere.pojo.Deal

class DealAdapter(var deals : List<Deal> , val page : Int) : RecyclerView.Adapter<DealAdapter.DealViewHolder>(){
    class DealViewHolder (val dealItem : View) :RecyclerView.ViewHolder(dealItem){
        val title : TextView = dealItem.findViewById(R.id.dealTitle)
        val customerName : TextView = dealItem.findViewById(R.id.customerName)
        val expectedRevenue : TextView = dealItem.findViewById(R.id.expectedRevenue)
        val deadline : TextView = dealItem.findViewById(R.id.deadline)
        val button : Button  = dealItem.findViewById(R.id.claimDealButton)

    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DealViewHolder {
        val layout = LayoutInflater.from(parent.context).inflate(R.layout.deal_item,parent,false)
        return DealViewHolder(layout)
    }

    override fun getItemCount(): Int {
        return deals.size
    }

    override fun onBindViewHolder(holder: DealViewHolder, position: Int) {
        holder.dealItem.setOnClickListener {
            Toast.makeText(holder.dealItem.context,"Hello nigga",Toast.LENGTH_SHORT).show()
        }
        val currentDeal = deals[position]
        holder.title.text = currentDeal.title
        holder.customerName.text = "Customer: ${currentDeal.customerId}"
        val revenue = currentDeal.customerBudget - currentDeal.expenses
        holder.expectedRevenue.text = "Revenue: $$revenue"
        holder.deadline.text = "Deadline: ${currentDeal.dueDate}"
        holder.button.text = if (page == 0) "Claim Deal" else "Close Deal"
        holder.button.setOnClickListener {
            holder.button.text = if (page == 0) "Deal Claimed" else "Deal Closed"
            val color = ContextCompat.getColor(holder.dealItem.context, R.color.nav_item_unselected)
            holder.button.setBackgroundColor(color)
        }
    }
}