package com.example.salessphere.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.example.salessphere.R
import com.example.salessphere.model.pojo.FinancialRecord
import com.example.salessphere.util.FinancialRecordType
import com.example.salessphere.util.PaymentMethod
import com.example.salessphere.util.Utils

class FinancialRecordAdapter(var financialRecords: MutableList<FinancialRecord>) :
    RecyclerView.Adapter<FinancialRecordAdapter.FinancialRecordViewHolder>() {
    class FinancialRecordViewHolder(val financialRecordItem: View) :
        RecyclerView.ViewHolder(financialRecordItem) {
        val ivType: ImageView = financialRecordItem.findViewById(R.id.ivType)
        val tvAmount: TextView = financialRecordItem.findViewById(R.id.tvAmount)
        val tvTypeAndPaymentMethod: TextView =
            financialRecordItem.findViewById(R.id.tvTypeAndPaymentMethod)
        val tvDate: TextView = financialRecordItem.findViewById(R.id.tvDate)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): FinancialRecordViewHolder {
        val layout = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_financial_record, parent, false)
        return FinancialRecordViewHolder(layout)
    }

    override fun getItemCount(): Int {
        return financialRecords.size
    }

    override fun onBindViewHolder(holder: FinancialRecordViewHolder, position: Int) {
        val currentFinancialRecord = financialRecords[position]


            val type = when (currentFinancialRecord.type) {
                FinancialRecordType.INCOME.ordinal -> {
                    holder.tvAmount.text = "+$${Utils.formatMoney(currentFinancialRecord.amount)}"
                    holder.tvAmount.setTextColor(ContextCompat.getColor(holder.financialRecordItem.context, R.color.money))
                    holder.ivType.backgroundTintList = ContextCompat.getColorStateList(holder.financialRecordItem.context, R.color.money)
                    holder.ivType.setBackgroundResource(R.drawable.ic_income)
                     "Income"
                }

                FinancialRecordType.EXPENSE.ordinal -> {
                    holder.tvAmount.text = "-$${Utils.formatMoney(currentFinancialRecord.amount)}"
                    holder.tvAmount.setTextColor(ContextCompat.getColor(holder.financialRecordItem.context, R.color.expenses))
                    holder.ivType.backgroundTintList = ContextCompat.getColorStateList(holder.financialRecordItem.context, R.color.expenses)
                    holder.ivType.setBackgroundResource(R.drawable.ic_expenses)
                    "Expense"
                }
                else -> "Other"
        }
        val paymentMethod = when (currentFinancialRecord.paymentMethod) {
            PaymentMethod.CASH.ordinal -> "Cash"
            PaymentMethod.CREDIT_CARD.ordinal -> "Credit Card"
            PaymentMethod.BANK_TRANSFER.ordinal -> "Bank Transfer"
            PaymentMethod.ELECTRONIC_PAYMENT.ordinal -> "Electronic Payment"
            else -> "Other"
        }


        holder.tvTypeAndPaymentMethod.text = "$type - $paymentMethod"
        holder.tvDate.text = Utils.formatDateTime(currentFinancialRecord.transactionDate , "MMMM d, yyyy")

    }
}