package com.example.salessphere.network

import com.example.salessphere.pojo.Deal
import com.example.salessphere.pojo.Employee
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Query

interface RetrofitService {
    @GET("employee")
    suspend fun getAllEmployees() : Response<List<Employee>>

    @GET("deal")
    suspend fun getAllDeals() : Response<List<Deal>>

    @GET("deal")        // will look like this "deal?id=123"
    suspend fun getDealById(@Query("id")id : Int) : Response<Deal>


}