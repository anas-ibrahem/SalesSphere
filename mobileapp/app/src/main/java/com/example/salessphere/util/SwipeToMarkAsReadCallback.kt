package com.example.salessphere.util

import android.graphics.Canvas
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import androidx.recyclerview.widget.ItemTouchHelper
import androidx.recyclerview.widget.RecyclerView
import com.example.salessphere.adapters.NotificationAdapter

class SwipeToMarkAsReadCallback(
    private val notificationAdapter: NotificationAdapter,
    private val onMarkAsRead: (Int) -> Unit
) : ItemTouchHelper.SimpleCallback(0, ItemTouchHelper.RIGHT) {

    override fun onMove(
        recyclerView: RecyclerView,
        viewHolder: RecyclerView.ViewHolder,
        target: RecyclerView.ViewHolder
    ): Boolean = false

    override fun onSwiped(viewHolder: RecyclerView.ViewHolder, direction: Int) {
        val position = viewHolder.adapterPosition
        onMarkAsRead(position)
    }

    // Optional: Add swipe animation with background color
    override fun onChildDraw(
        c: Canvas,
        recyclerView: RecyclerView,
        viewHolder: RecyclerView.ViewHolder,
        dX: Float,
        dY: Float,
        actionState: Int,
        isCurrentlyActive: Boolean
    ) {
        val itemView = viewHolder.itemView
        val background = ColorDrawable()
        background.color = Color.parseColor("#E8E8E8") // Light gray background

        if (dX > 0) { // Swiping to the right
            background.setBounds(
                itemView.left,
                itemView.top,
                itemView.left + dX.toInt(),
                itemView.bottom
            )
        } else { // Swiping to the left
            background.setBounds(
                itemView.right + dX.toInt(),
                itemView.top,
                itemView.right,
                itemView.bottom
            )
        }

        background.draw(c)
        super.onChildDraw(c, recyclerView, viewHolder, dX, dY, actionState, isCurrentlyActive)
    }

    override fun getSwipeDirs(
        recyclerView: RecyclerView,
        viewHolder: RecyclerView.ViewHolder
    ): Int {
        val position = viewHolder.adapterPosition
        val notification = notificationAdapter.getNotificationAt(position)
        return notification?.let{
            if (!it.seen) super.getSwipeDirs(recyclerView, viewHolder) else 0
        } ?: 0
    }
}