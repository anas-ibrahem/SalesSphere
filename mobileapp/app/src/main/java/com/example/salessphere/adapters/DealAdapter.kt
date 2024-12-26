package com.example.salessphere.adapters

import android.app.Activity
import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.salessphere.R
import com.example.salessphere.activities.DealDetailsActivity
import com.example.salessphere.model.pojo.Deal
import com.example.salessphere.util.CustomerType
import com.example.salessphere.util.Utils

class DealAdapter(var deals : List<Deal>, private val activity : Activity) : RecyclerView.Adapter<DealAdapter.DealViewHolder>(){
    class DealViewHolder (dealItem : View) :RecyclerView.ViewHolder(dealItem){
        val title : TextView = dealItem.findViewById(R.id.dealTitleTextView)
        val customerName : TextView = dealItem.findViewById(R.id.customerNameTextView)
        val customerType : ImageView = dealItem.findViewById(R.id.ivCustomerType)
        val expectedRevenue : TextView = dealItem.findViewById(R.id.revenueTextView)
        val deadline : TextView = dealItem.findViewById(R.id.deadlineTextView)
        val viewDetailsBtn : Button  = dealItem.findViewById(R.id.viewDetailsButton)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): DealViewHolder {
        val layout = LayoutInflater.from(parent.context).inflate(R.layout.item_deal,parent,false)
        return DealViewHolder(layout)
    }

    override fun getItemCount(): Int {
        return deals.size
    }

    override fun onBindViewHolder(holder: DealViewHolder, position: Int) {
        val currentDeal = deals[position]

        holder.title.text = currentDeal.title
        holder.customerName.text = "${currentDeal.customer.name}"
        when(currentDeal.customer.type){
            CustomerType.INDIVIDUAL.ordinal -> holder.customerType.setImageResource(R.drawable.ic_badge_customer)
            CustomerType.COMPANY.ordinal -> holder.customerType.setImageResource(R.drawable.ic_business)
        }
        val revenue = currentDeal.customerBudget - currentDeal.expenses
        holder.expectedRevenue.text = "$${Utils.formatMoney(revenue)}"
        holder.deadline.text = Utils.formatDateTime(currentDeal.dueDate , "MMMM d , yyyy")
        holder.viewDetailsBtn.setOnClickListener {
            val intent = Intent(activity , DealDetailsActivity::class.java)
            intent.putExtra("DEAL_ID" , currentDeal.id)
            activity.startActivity(intent)
        }
    }
}