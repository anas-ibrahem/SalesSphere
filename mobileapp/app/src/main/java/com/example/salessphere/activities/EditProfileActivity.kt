package com.example.salessphere.activities

import android.net.Uri
import android.os.Bundle
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.ViewModelProvider
import com.bumptech.glide.Glide
import com.example.salessphere.R
import com.example.salessphere.databinding.ActivityEditProfileBinding
import com.example.salessphere.network.ApiState
import com.example.salessphere.network.ProfileUpdateRequest
import com.example.salessphere.network.RetrofitClient
import com.example.salessphere.util.CurrentEmployee
import com.example.salessphere.util.Utils
import com.example.salessphere.viewmodels.EditProfileViewModel
import com.example.salessphere.viewmodels.EditProfileViewModelFactory
import com.example.salessphere.viewmodels.ProfileViewModel
import com.example.salessphere.viewmodels.ProfileViewModelFactory
import com.google.android.material.dialog.MaterialAlertDialogBuilder

class EditProfileActivity : AppCompatActivity() {
    lateinit var binding: ActivityEditProfileBinding
    private lateinit var editProfileViewModel: EditProfileViewModel
    private lateinit var profileViewModel: ProfileViewModel

    private lateinit var pickMedia: ActivityResultLauncher<PickVisualMediaRequest>


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = DataBindingUtil.setContentView(this, R.layout.activity_edit_profile)
        setupViewModel()
        setupObservers()
        setupMediaPicker()
        showEmployeePersonalInfo()

        binding.ivUserPhoto.setOnClickListener {
            pickMedia.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
        }

        binding.ivEditIcon.setOnClickListener {
            pickMedia.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly))
        }
        binding.btnBack.setOnClickListener {
            this.finish()
        }
        binding.btnSaveChanges.setOnClickListener {
            showSaveChangesDialog()
        }
    }

    private fun setupMediaPicker(){
        pickMedia = registerForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
            if (uri != null) {
                editProfileViewModel.uploadImageToCloudinary(uri,this::getRealPathFromURI)
            }
        }
    }
    private fun setupObservers(){
        observeProfileUpdateState()
        observeImageUploadStatus()
        observeProfile()
    }

    private fun observeImageUploadStatus() {
        editProfileViewModel.imageUploadStatus.observe(this) { imageUploadStatus ->
            when (imageUploadStatus) {
                is ApiState.Success -> {
                    Glide.with(this)
                        .load(imageUploadStatus.data)
                        .into(binding.ivUserPhoto)
                    CurrentEmployee.profilePictureUrl = imageUploadStatus.data
                }
                is ApiState.Error -> {
                    Toast.makeText(this, imageUploadStatus.error, Toast.LENGTH_SHORT).show()
                }
                is ApiState.Loading -> {
                    // Show loading effect
                }
            }
        }
    }

    private fun setupViewModel() {
        val retrofitService = RetrofitClient.getInstance(this)
        val factory = EditProfileViewModelFactory(retrofitService)
        val profileFactory = ProfileViewModelFactory(retrofitService)
        profileViewModel = ViewModelProvider(this ,profileFactory).get(ProfileViewModel::class.java)
        editProfileViewModel =
            ViewModelProvider(this, factory).get(EditProfileViewModel::class.java)

    }

    private fun observeProfileUpdateState() {
        editProfileViewModel.profileUpdateState.observe(this) { profileUpdateState ->
            when (profileUpdateState) {
                is ApiState.Success -> {
                    profileViewModel.getMyProfile()
                    Toast.makeText(this, profileUpdateState.data.message, Toast.LENGTH_SHORT).show()
                }

                is ApiState.Error -> {
                    Toast.makeText(this, profileUpdateState.error, Toast.LENGTH_SHORT).show()
                }

                is ApiState.Loading -> {
                    // show loading effect
                }
            }
        }
    }

    private fun showSaveChangesDialog() {
        val dialogView = layoutInflater.inflate(R.layout.dialog_save_changes, null)
        val dialog = MaterialAlertDialogBuilder(this, R.style.CustomMaterialAlertDialog)
            .setView(dialogView)
            .setPositiveButton("Yes") { dialog, _ ->
                saveChanges()
                dialog.dismiss()
            }.setNegativeButton("Cancel") { dialog, _ ->
                dialog.dismiss()
            }.create()
            .show()
    }

    private fun showEmployeePersonalInfo() {
        if (CurrentEmployee.profilePictureUrl == null) {
            binding.ivUserPhoto.setImageResource(R.drawable.ic_profile)
            binding.ivUserPhoto.setColorFilter(ContextCompat.getColor(this, R.color.primary))
        }
        else{
            Glide.with(this)
                .load(CurrentEmployee.profilePictureUrl)
                .circleCrop()
                .into(binding.ivUserPhoto)
        }
        binding.etFirstName.setText(CurrentEmployee.firstName)
        binding.etLastName.setText(CurrentEmployee.lastName)
        binding.etEmail.setText(CurrentEmployee.email)
        binding.etPhone.setText(CurrentEmployee.phoneNumber)
        binding.etAddress.setText(CurrentEmployee.address)
        binding.etBirthDate.setText(CurrentEmployee.birthDate)
        binding.etJoined.setText(CurrentEmployee.accountCreationDate)
    }

    private fun saveChanges() {
        //save changes
        val firstName = binding.etFirstName.text.toString().trim()
        val lastName = binding.etLastName.text.toString().trim()
        val email = binding.etEmail.text.toString().trim()
        val phoneNumber = binding.etPhone.text.toString().trim()
        val address = binding.etAddress.text.toString().trim()
        val profilePictureUrl = CurrentEmployee.profilePictureUrl
        if (validateInputs(firstName, lastName, email, phoneNumber)){
            val newProfile = ProfileUpdateRequest(
                firstName,
                lastName,
                email,
                phoneNumber,
                address ,
                profilePictureUrl
            )
            editProfileViewModel.saveChanges(newProfile)
        }
    }

    private fun observeProfile() {
        profileViewModel.profile.observe(this) { profile ->
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
            this.finish()
        }
    }


    private fun validateInputs(
        firstName: String,
        lastName: String,
        email: String,
        phoneNumber: String,
    ): Boolean {
        var isValid = true

        if (firstName.isBlank()) {
            binding.firstNameTextInputLayout.error = "First name is required"
            isValid = false
        } else {
            binding.lastNameTextInputLayout.error = null
        }

        if (lastName.isBlank()) {
            binding.lastNameTextInputLayout.error = "Last name is required"
        } else {
            binding.lastNameTextInputLayout.error = null
        }

        if (email.isBlank()) {
            binding.emailTextInputLayout.error = "Email is required"
            isValid = false
        } else {
            binding.emailTextInputLayout.error = null
        }

        if (phoneNumber.isBlank()) {
            binding.phoneTextInputLayout.error = "Phone number is required"
            isValid = false
        } else {
            binding.phoneTextInputLayout.error = null
        }


        return isValid
    }

    private fun getRealPathFromURI(uri: Uri): String? {
        // Use ContentResolver to get the file path from the Uri
        val cursor = contentResolver.query(uri, null, null, null, null)
        return cursor?.use {
            val index = it.getColumnIndexOrThrow("_data")
            it.moveToFirst()
            it.getString(index)
        }
    }
}