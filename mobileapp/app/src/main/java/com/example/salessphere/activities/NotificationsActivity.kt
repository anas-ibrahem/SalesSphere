package com.example.salessphere.activities

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.databinding.DataBindingUtil
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.ItemTouchHelper
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.salessphere.R
import com.example.salessphere.util.SwipeToMarkAsReadCallback
import com.example.salessphere.adapters.NotificationAdapter
import com.example.salessphere.databinding.ActivityNotificationsBinding
import com.example.salessphere.network.RetrofitClient
import com.example.salessphere.viewmodels.NotificationsFactory
import com.example.salessphere.viewmodels.NotificationsViewModel

class NotificationsActivity : AppCompatActivity() {
    private lateinit var binding: ActivityNotificationsBinding
    private lateinit var notificationAdapter: NotificationAdapter
    private lateinit var notificationsViewModel: NotificationsViewModel
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        binding = DataBindingUtil.setContentView(this, R.layout.activity_notifications)
        setupRecyclerView()
        binding.tvNoNotificationsTitle.visibility = View.GONE
        binding.tvNoNotificationsSubtitle.visibility = View.GONE
        setupViewModel()
        observeNotifications()
        observeMarkAsReadState()

        binding.btnMarkAllRead.setOnClickListener {
            notificationsViewModel.markAllAsRead()
        }
        binding.btnBack.setOnClickListener {
            this.finish()
        }
    }

    private fun setupRecyclerView() {
        notificationAdapter = NotificationAdapter(listOf())
        binding.notificationsRv.adapter = notificationAdapter
        binding.notificationsRv.layoutManager =
            LinearLayoutManager(this, RecyclerView.VERTICAL, false)


        val swipeHandler = SwipeToMarkAsReadCallback(notificationAdapter) { position ->
            markNotificationAsRead(position)
        }

        val itemTouchHelper = ItemTouchHelper(swipeHandler)
        itemTouchHelper.attachToRecyclerView(binding.notificationsRv)
    }

    private fun markNotificationAsRead(position: Int) {
        val notification = notificationAdapter.getNotificationAt(position)
        if (notification != null)
            notificationsViewModel.markAsRead(notification.id)
    }

    private fun setupViewModel() {
        val retrofitService = RetrofitClient.getInstance(this)
        val factory = NotificationsFactory(retrofitService)
        notificationsViewModel =
            ViewModelProvider(this, factory).get(NotificationsViewModel::class.java)
    }

    private fun observeNotifications() {
        notificationsViewModel.notifications.observe(this) { newNotifications ->
            if (newNotifications.isEmpty()) {
                binding.tvNoNotificationsTitle.visibility = View.VISIBLE
                binding.tvNoNotificationsSubtitle.visibility = View.VISIBLE
            } else {
                binding.tvNoNotificationsTitle.visibility = View.GONE
                binding.tvNoNotificationsSubtitle.visibility = View.GONE
            }
            notificationAdapter.notifications = newNotifications
            notificationAdapter.notifyDataSetChanged()
        }
    }


    private fun observeMarkAsReadState() {
        notificationsViewModel.markAsReadState.observe(this) {
            notificationsViewModel.getNotifications()
        }
    }
}
