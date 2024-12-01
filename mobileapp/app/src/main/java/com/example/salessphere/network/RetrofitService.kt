package com.example.salessphere.network

import com.example.salessphere.pojo.Deal
import com.example.salessphere.pojo.Employee
import retrofit2.Response
import retrofit2.http.GET

interface RetrofitService {
    @GET("employee")
    suspend fun getAllEmployees() : Response<List<Employee>>

    @GET("deal")
    suspend fun getAllDeals() : Response<List<Deal>>

}