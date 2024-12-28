package com.example.salessphere.adapters

import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.example.salessphere.R
import com.example.salessphere.databinding.BottomSheetCallBinding
import com.example.salessphere.databinding.BottomSheetEmailBinding
import com.example.salessphere.model.pojo.Customer
import com.example.salessphere.util.CustomerType
import com.google.android.material.bottomsheet.BottomSheetDialog

class CustomerAdapter(var customers : List<Customer> , private val activity : Activity ) : RecyclerView.Adapter<CustomerAdapter.CustomerViewHolder>(){
    class CustomerViewHolder (customerItem : View) : RecyclerView.ViewHolder(customerItem){
        val tvCustomerName : TextView = customerItem.findViewById(R.id.tvCustomerName)
        val tvCustomerEmail : TextView = customerItem.findViewById(R.id.tvCustomerEmail)
        val ivCustomerType : ImageView = customerItem.findViewById(R.id.ivCustomerType)
        val btnContactCustomer : ImageButton = customerItem.findViewById(R.id.btnContactCustomer)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CustomerViewHolder {
        val layout = LayoutInflater.from(parent.context).inflate(R.layout.item_customer,parent,false)
        return CustomerViewHolder(layout)
    }

    override fun getItemCount(): Int {
        return customers.size
    }

    override fun onBindViewHolder(holder: CustomerViewHolder, position: Int) {
        val currentCustomer = customers[position]

        holder.tvCustomerName.text = currentCustomer.name
        holder.tvCustomerEmail.text = currentCustomer.email
        when(currentCustomer.type) {
            CustomerType.INDIVIDUAL.ordinal -> holder.ivCustomerType.setImageResource(R.drawable.ic_badge_customer)
            CustomerType.COMPANY.ordinal -> holder.ivCustomerType.setImageResource(R.drawable.ic_business)
        }
        if(currentCustomer.preferredContactMethod){
            holder.btnContactCustomer.setImageResource(R.drawable.ic_phone)
        }
        else{
            holder.btnContactCustomer.setImageResource(R.drawable.ic_email_customer)
        }

        holder.btnContactCustomer.setOnClickListener {
            onContactCustomerClick(currentCustomer)
        }
    }

    private fun onContactCustomerClick(customer: Customer) {
        if (customer.preferredContactMethod) {
            showCallBottomSheet(customer.name , customer.phoneNumber)
        } else {
            showEmailBottomSheet(customer.name, customer.email)
        }
    }

    private fun showCallBottomSheet(name : String, phoneNumber: String) {
        val bottomSheet = BottomSheetDialog(activity)
        val bottomSheetBinding = BottomSheetCallBinding.inflate(activity.layoutInflater)
        bottomSheet.setContentView(bottomSheetBinding.root)

        bottomSheetBinding.tvCustomerName.text = "Call $name"
        bottomSheetBinding.phoneNumberTv.text = phoneNumber
        bottomSheetBinding.callButton.setOnClickListener {
            val intent = Intent(Intent.ACTION_DIAL).apply {
                data = Uri.parse("tel:$phoneNumber")
            }
            activity.startActivity(intent)
            bottomSheet.dismiss()
        }

        bottomSheetBinding.btnCancel.setOnClickListener {
            bottomSheet.dismiss()
        }

        bottomSheet.show()
    }

    private fun showEmailBottomSheet(name : String, email: String) {
        val bottomSheet = BottomSheetDialog(activity)
        val bottomSheetBinding = BottomSheetEmailBinding.inflate(activity.layoutInflater)
        bottomSheet.setContentView(bottomSheetBinding.root)

        bottomSheetBinding.tvCustomerName.text = "Email $name"
        bottomSheetBinding.tvEmail.text = email
        bottomSheetBinding.btnSendEmail.setOnClickListener {
            val emailIntent = Intent(Intent.ACTION_SENDTO).apply {
                data = Uri.parse("mailto:${email}")
            }
            activity.startActivity(emailIntent)
            bottomSheet.dismiss()
        }

        bottomSheetBinding.btnCancel.setOnClickListener {
            bottomSheet.dismiss()
        }
        bottomSheet.show()
    }
}