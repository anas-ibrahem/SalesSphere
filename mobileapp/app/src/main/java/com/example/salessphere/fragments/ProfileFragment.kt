package com.example.salessphere.fragments

import android.content.Intent
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.content.ContextCompat
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.ViewModelProvider
import com.bumptech.glide.Glide
import com.example.salessphere.R
import com.example.salessphere.activities.BadgesEarnedActivity
import com.example.salessphere.activities.LoginActivity
import com.example.salessphere.activities.NotificationsActivity
import com.example.salessphere.activities.EditProfileActivity
import com.example.salessphere.databinding.FragmentProfileBinding
import com.example.salessphere.network.RetrofitClient
import com.example.salessphere.util.CurrentEmployee
import com.example.salessphere.util.EmployeeRole
import com.example.salessphere.util.Utils
import com.example.salessphere.viewmodels.ProfileViewModel
import com.example.salessphere.viewmodels.ProfileViewModelFactory
import com.google.android.material.dialog.MaterialAlertDialogBuilder

class ProfileFragment : Fragment() {
    private lateinit var binding: FragmentProfileBinding
    private lateinit var profileViewModel: ProfileViewModel

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        // Inflate the layout for this fragment
        binding = DataBindingUtil.inflate(inflater, R.layout.fragment_profile, container, false)
        return binding.root
    }

    override fun onResume() {
        super.onResume()
        profileViewModel.getMyProfile()
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupViewModel()
        observeProfile()
        binding.personalInfoCV.setOnClickListener {
            navigateToPersonalInfoActivity()
        }
        binding.badgesCv.setOnClickListener {
            navigateToBadgesEarnedActivity()
        }
        binding.notificationsCV.setOnClickListener {
            navigateToNotificationsActivity()
        }
        binding.logoutCV.setOnClickListener {
            showLogOutDialog()
        }
    }

    private fun navigateToBadgesEarnedActivity() {
        val intent = Intent(requireContext(), BadgesEarnedActivity::class.java)
        startActivity(intent)
    }

    private fun navigateToPersonalInfoActivity() {
        val intent = Intent(requireContext(), EditProfileActivity::class.java)
        startActivity(intent)
    }

    private fun navigateToNotificationsActivity() {
        val intent = Intent(requireContext(), NotificationsActivity::class.java)
        startActivity(intent)
    }

    private fun showEmployeeInfo() {
        if (CurrentEmployee.profilePictureUrl == null) {
            binding.userPhotoIV.setImageResource(R.drawable.ic_profile)
            binding.userPhotoIV.setColorFilter(ContextCompat.getColor(requireContext(), R.color.white))
        }
        else{
            Glide.with(this)
                .load(CurrentEmployee.profilePictureUrl)
                .circleCrop()
                .into(binding.userPhotoIV)
        }
        binding.nameTv.text = "${CurrentEmployee.firstName} ${CurrentEmployee.lastName}"
        when (CurrentEmployee.role) {
            EmployeeRole.DEAL_OPENER.ordinal -> {
                binding.roleTv.text = "Deal Opener"
            }

            EmployeeRole.DEAL_CLOSER.ordinal -> {
                binding.roleTv.text = "Deal Executor"
            }
        }
    }

    private fun showLogOutDialog() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_logout, null)
        val dialog = MaterialAlertDialogBuilder(requireContext(), R.style.CustomMaterialAlertDialog)
            .setView(dialogView)
            .setPositiveButton("Log Out") { dialog, _ ->
                logout()
                dialog.dismiss()
            }.setNegativeButton("Cancel") { dialog, _ ->
                dialog.dismiss()
            }.create()
            .show()
    }

    private fun logout() {
        Utils.clearToken(requireContext())
        val intent = Intent(requireContext(), LoginActivity::class.java)
        startActivity(intent)
        requireActivity().finish()
    }

    private fun setupViewModel(){
        val retrofitService = RetrofitClient.getInstance(requireContext())
        val profileFactory = ProfileViewModelFactory(retrofitService)
        profileViewModel = ViewModelProvider(this ,profileFactory).get(ProfileViewModel::class.java)

    }

    private fun observeProfile() {
        profileViewModel.profile.observe(viewLifecycleOwner) { profile ->
            CurrentEmployee.id = profile.id
            CurrentEmployee.email = profile.email
            CurrentEmployee.role = profile.role
            CurrentEmployee.firstName = profile.firstName
            CurrentEmployee.lastName = profile.lastName
            CurrentEmployee.birthDate = Utils.formatDateTime(profile.birthDate , "dd/MM/yyyy")
            CurrentEmployee.phoneNumber = profile.phoneNumber
            CurrentEmployee.profilePictureUrl = profile.profilePictureUrl
            CurrentEmployee.address = profile.address
            CurrentEmployee.accountCreationDate =Utils.formatDateTime(profile.accountCreationDate , "dd/MM/yyyy")
            showEmployeeInfo()
        }
    }
}