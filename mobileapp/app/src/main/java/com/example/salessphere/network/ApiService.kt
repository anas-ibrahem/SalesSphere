package com.example.salessphere.network

import com.example.salessphere.model.pojo.Customer
import com.example.salessphere.model.pojo.Deal
import com.example.salessphere.model.summary.DealFinancialSummary
import com.example.salessphere.model.pojo.Employee
import com.example.salessphere.model.pojo.EmployeeBadge
import com.example.salessphere.model.summary.EmployeeFinancialSummary
import com.example.salessphere.model.summary.EmployeeSummary
import com.example.salessphere.model.pojo.EmployeeTarget
import com.example.salessphere.model.pojo.FinancialRecord
import com.example.salessphere.model.pojo.Notification
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.Path

interface ApiService {

    //Authentication
    @POST("auth/login") // Replace with your actual login endpoint path
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>


    //Employee
    @GET("me")
    suspend fun getMe() : Response<Employee>

    @PATCH("employee")
    suspend fun updateEmployee(@Body employee: ProfileUpdateRequest) : Response<DefaultResponse>

    @GET("employee/summary/{id}")
    suspend fun getEmployeeSummary(@Path("id") id : Int) : Response<EmployeeSummary>


    //Target
    @GET("target/employee/{id}/active")
    suspend fun getEmployeeActiveTargets(@Path("id") id : Int) : Response<List<EmployeeTarget>>

    //Badges
    @GET("badge")
    suspend fun getEmployeeBadges() : Response<List<EmployeeBadge>>

    //Deals
    @GET("deal/open/saleh")
    suspend fun getSalehOpenDeals() : Response<List<Deal>>

    @GET("deal/claimed/saleh")
    suspend fun getSalehClaimedDeals() : Response<List<Deal>>

    @GET("deal/closed/saleh")
    suspend fun getSalehClosedDeals() : Response<List<Deal>>

    @GET("deal/open")
    suspend fun getAllOpen() : Response<List<Deal>>

    @GET("deal/claimed")
    suspend fun getEmployeeClaimedDeals() : Response<List<Deal>>

    @GET("deal/closed")
    suspend fun getEmployeeClosedDeals() : Response<List<Deal>>

    @GET("deal/{id}")
    suspend fun getDealById(@Path("id")id : Int) : Response<Deal>

    @POST("deal/claim")
    suspend fun claimDeal(@Body claimDealRequest: ClaimDealRequest) : Response<DefaultResponse>

    @POST("deal/close")
    suspend fun closeDeal(@Body closeDealRequest: CloseDealRequest) : Response<CloseDealResponse>

    @POST("deal")
    suspend fun openDeal(@Body openDealRequest: OpenDealRequest) : Response<OpenDealResponse>



    //Finance
    @GET("finance/deal/{id}")
    suspend fun getDealFinancialRecords(@Path("id") id : Int) : Response<List<FinancialRecord>>

    @POST("finance")
    suspend fun addFinancialRecord(@Body financialRecord: FinancialRecord) : Response<FinancialRecord>

    @GET("finance/deal/summary/{id}")
    suspend fun getDealFinancialSummary(@Path("id") id : Int) : Response<DealFinancialSummary>

    @GET("finance/employee/summary")
    suspend fun getEmployeeFinancialSummary() : Response<EmployeeFinancialSummary>



    //Notifications
    @GET("notification")
    suspend fun getNotifications() : Response<List<Notification>>

    @GET("notification/unread/count")
    suspend fun getUnreadNotificationCount() : Response<Int>

    @PATCH("notification/seen/{id}")
    suspend fun markAsRead(@Path("id") id : Int) : Response<NotificationResponse>

    @PATCH("notification/seen/all")
    suspend fun markAllAsRead() : Response<NotificationResponse>



    //Customers
    @POST("customer")
    suspend fun addCustomer(@Body addCustomerRequest: AddCustomerRequest) : Response<AddCustomerResponse>


    @GET("customer")
    suspend fun getAllCustomers() : Response<List<Customer>>




}