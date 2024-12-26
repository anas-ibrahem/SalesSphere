package com.example.salessphere.activities

import android.os.Bundle
import android.view.View
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.salessphere.R
import com.example.salessphere.adapters.BadgeAdapter
import com.example.salessphere.databinding.ActivityBadgesEarnedBinding
import com.example.salessphere.network.RetrofitClient
import com.example.salessphere.viewmodels.BadgesFactory
import com.example.salessphere.viewmodels.BadgesViewModel

class BadgesEarnedActivity : AppCompatActivity() {
    private lateinit var binding: ActivityBadgesEarnedBinding
    private lateinit var badgeAdapter: BadgeAdapter
    private lateinit var badgesViewModel: BadgesViewModel
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = DataBindingUtil.setContentView(this, R.layout.activity_badges_earned)
        binding.tvNoBadgesTitle.visibility = View.GONE
        binding.tvNoBadgesSubtitle.visibility = View.GONE
        setupRecyclerView()
        setupViewModel()
        observeBadges()

        binding.btnBack.setOnClickListener {
            this.finish()
        }
    }

    private fun setupViewModel() {
        val retrofitService = RetrofitClient.getInstance(this)
        val factory = BadgesFactory(retrofitService)
        badgesViewModel = ViewModelProvider(this, factory).get(BadgesViewModel::class.java)
    }

    private fun observeBadges() {
        badgesViewModel.badges.observe(this) { badges ->
            if(badges.isEmpty()){
                binding.tvNoBadgesTitle.visibility = View.VISIBLE
                binding.tvNoBadgesSubtitle.visibility = View.VISIBLE
            }
            else{
                binding.tvNoBadgesTitle.visibility = View.GONE
                binding.tvNoBadgesSubtitle.visibility = View.GONE
            }
            badgeAdapter.employeeBadges = badges
            badgeAdapter.notifyDataSetChanged()
        }
    }

    private fun setupRecyclerView() {
        badgeAdapter = BadgeAdapter(listOf())
        binding.rvBadges.adapter = badgeAdapter
        binding.rvBadges.layoutManager =
            LinearLayoutManager(this, RecyclerView.VERTICAL, false)

    }
}