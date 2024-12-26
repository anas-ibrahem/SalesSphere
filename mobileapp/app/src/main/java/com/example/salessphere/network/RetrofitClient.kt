package com.example.salessphere.network

import AuthInterceptor
import android.content.Context
import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object RetrofitClient {
    private const val BASE_URL = "https://sales-sphere.vercel.app/api/"

    private var retrofit : Retrofit? = null
    fun getInstance(context: Context) : ApiService{
        if (retrofit == null){
            val loggingInterceptor = HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            }
            val client = OkHttpClient.Builder()
                .addInterceptor(AuthInterceptor(context)) // Add the AuthInterceptor
                .addInterceptor(loggingInterceptor)
                .build()
            val gson = GsonBuilder()
                .create()
            retrofit = Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create(gson))
                .build()

        }
        return retrofit!!.create(ApiService::class.java)
    }

}
