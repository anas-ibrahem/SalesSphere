package com.example.salessphere.network

import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitHelper {
    private val retrofit = Retrofit.Builder()
        .baseUrl("https://fb67-154-238-254-181.ngrok-free.app/api/")
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    val retrofitService : RetrofitService = retrofit.create(RetrofitService::class.java)
}