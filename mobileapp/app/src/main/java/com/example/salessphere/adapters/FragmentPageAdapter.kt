package com.example.salessphere.adapters

import androidx.fragment.app.Fragment

import androidx.viewpager2.adapter.FragmentStateAdapter
import com.example.salessphere.fragments.ClaimedDealsFragment
import com.example.salessphere.fragments.ClosedDealsFragment
import com.example.salessphere.fragments.OpenDealsFragment

class FragmentPageAdapter(fragment: Fragment) : FragmentStateAdapter(fragment) {
    override fun getItemCount() = 3

    override fun createFragment(position: Int): Fragment {
        return when (position) {
            0 -> OpenDealsFragment()
            1 -> ClaimedDealsFragment()
            else -> ClosedDealsFragment()
        }
    }
}