package com.example.salessphere.network

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitHelper {
    private val retrofit = Retrofit.Builder()
        .baseUrl("https://sales-sphere.vercel.app/api/")
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    val retrofitService : RetrofitService = retrofit.create(RetrofitService::class.java)
}