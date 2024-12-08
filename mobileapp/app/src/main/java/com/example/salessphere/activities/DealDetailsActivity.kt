package com.example.salessphere.activities

import android.app.AlertDialog
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.widget.RadioGroup
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.ViewModelProvider
import com.example.salessphere.R
import com.example.salessphere.databinding.ActivityDealDetailsBinding
import com.example.salessphere.databinding.BottomSheetCallBinding
import com.example.salessphere.network.RetrofitClient
import com.example.salessphere.pojo.Deal
import com.example.salessphere.viewmodels.DealDetailFactory
import com.example.salessphere.viewmodels.DealDetailsViewModel
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.dialog.MaterialAlertDialogBuilder


class DealDetailsActivity : AppCompatActivity() {

    private lateinit var binding: ActivityDealDetailsBinding
    private lateinit var dealDetailsViewModel: DealDetailsViewModel
    private var dealStatus = 0 // 0 -> opened , 1 -> claimed , 2-> Closed Won , 3-> Closed Lost

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = DataBindingUtil.setContentView(this, R.layout.activity_deal_details)
        setupViewModel()

        binding.statusChip.text =
            when (dealStatus) {
                0 -> {
                    binding.closeDealButton.isEnabled = false
                    "Opened"
                }

                1 -> {
                    binding.claimButton.isEnabled = false
                    "Claimed"
                }

                2 -> {
                    binding.claimButton.isEnabled = false
                    binding.closeDealButton.isEnabled = false
                    "Closed Won"
                }

                3 -> {
                    binding.claimButton.isEnabled = false
                    binding.closeDealButton.isEnabled = false
                    "Closed Lost"
                }

                else -> ""
            }
        binding.customerPhoneIcon.setOnClickListener {
            showCallBottomSheet("01025599324") // Replace with actual phone number

        }
        binding.backButton.setOnClickListener {
            this.finish()
        }

        binding.claimButton.setOnClickListener {
            showClaimDealDialog()
        }
        binding.closeDealButton.setOnClickListener {
            showCloseDealDialog()
        }
    }

    private fun setupViewModel() {
        val retrofitService = RetrofitClient.getInstance(this)
        val dealId = intent.getIntExtra("DEAL_ID", 0)
        val factory = DealDetailFactory(retrofitService, dealId)
        dealDetailsViewModel =
            ViewModelProvider(this, factory).get(DealDetailsViewModel::class.java)
        dealDetailsViewModel.deal.observe(this) { newDeal ->
                showDealDetails(newDeal)
        }

    }

    private fun showDealDetails(newDeal: Deal) {
        binding.dealTitleText.text = newDeal.title
        binding.dealDescriptionText.text = newDeal.description
        binding.statusChip.text = newDeal.status
        binding.budgetText.text = newDeal.customerBudget.toString()
        binding.expensesText.text = newDeal.expenses.toString()
        binding.revenueText.text = (newDeal.customerBudget - newDeal.expenses).toString()
        binding.customerNameText.text = newDeal.customerId.toString()
        // TODO dsfsfjlksdjfklsjdlfkjlkjsldkfjsklfjslkfjslkjflskdjflk
    }

    private fun showClaimDealDialog() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_claim_deal, null)
        val dialog = MaterialAlertDialogBuilder(this, R.style.CustomMaterialAlertDialog)
            .setView(dialogView)
            .setPositiveButton("Claim Deal") { dialog, _ ->
                claimDeal()
                dialog.dismiss()
            }.setNegativeButton("Cancel") { dialog, _ ->
                dialog.dismiss()
            }.create()
            .show()
    }

    private fun showCloseDealDialog() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_close_deal, null)
        val radioGroup: RadioGroup = dialogView.findViewById(R.id.dealOutcomeRadioGroup)
        val dialog = MaterialAlertDialogBuilder(this, R.style.CustomMaterialAlertDialog)
            .setView(dialogView)
            .setPositiveButton("Close Deal", null)
            .setNegativeButton("Cancel") { dialog, _ ->
                dialog.dismiss()
            }.create()


        dialog.setOnShowListener {
            val positiveButton = dialog.getButton(AlertDialog.BUTTON_POSITIVE)
            positiveButton.setOnClickListener {
                when (radioGroup.checkedRadioButtonId) {
                    R.id.wonRadioButton -> closeDeal("Won")
                    R.id.lostRadioButton -> closeDeal("Lost")
                    else -> {
                        Toast.makeText(this, "Please select an outcome", Toast.LENGTH_SHORT).show()
                        return@setOnClickListener
                    }
                }
                dialog.dismiss()
            }
        }
        dialog.show()

    }

    private fun claimDeal() {
        dealStatus = 1
        binding.claimButton.isEnabled = false
        binding.closeDealButton.isEnabled = true
        binding.statusChip.text = "Claimed"
        Toast.makeText(this, "Deal Claimed", Toast.LENGTH_SHORT).show()

    }

    private fun closeDeal(outcome: String) {
        dealStatus = if (outcome == "Won") 2 else 3
        binding.claimButton.isEnabled = false
        binding.closeDealButton.isEnabled = false
        binding.statusChip.text = "Closed $outcome"
        Toast.makeText(this, "Deal marked as $outcome", Toast.LENGTH_SHORT).show()
    }

    private fun showCallBottomSheet(phoneNumber: String) {
        val bottomSheet = BottomSheetDialog(this)
        val bottomSheetBinding = BottomSheetCallBinding.inflate(layoutInflater)
        bottomSheet.setContentView(bottomSheetBinding.root)

        bottomSheetBinding.phoneNumberText.text = phoneNumber
        bottomSheetBinding.callButton.setOnClickListener {
            val intent = Intent(Intent.ACTION_DIAL).apply {
                data = Uri.parse("tel:$phoneNumber")
            }
            startActivity(intent)
            bottomSheet.dismiss()
        }

        bottomSheetBinding.cancelButton.setOnClickListener {
            bottomSheet.dismiss()
        }

        bottomSheet.show()


    }


}