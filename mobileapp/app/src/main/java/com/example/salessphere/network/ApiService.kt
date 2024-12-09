package com.example.salessphere.network

import com.example.salessphere.pojo.Deal
import com.example.salessphere.pojo.Employee
import com.example.salessphere.pojo.LoginRequest
import com.example.salessphere.pojo.LoginResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface ApiService {
    @GET("employee")
    suspend fun getAllEmployees() : Response<List<Employee>>

    @GET("deal")
    suspend fun getOpenDeals() : Response<List<Deal>>

    @GET("deal")
    suspend fun getClaimedDeals() : Response<List<Deal>>

    @POST("auth/login") // Replace with your actual login endpoint path
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @GET("deal")        // will look like this "deal?id=123"
    suspend fun getDealById(@Query("id")id : Int) : Response<Deal>

}