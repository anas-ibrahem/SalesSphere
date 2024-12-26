package com.example.salessphere.util

import android.content.Context
import android.util.Log
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale

object Utils {
    fun getToken(context: Context): String? {
        val sharedPreferences = context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)
        return sharedPreferences.getString("jwt_token", null)
    }

    fun saveToken(token: String, context: Context) {
        val sharedPreferences = context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)
        sharedPreferences.edit().putString("jwt_token", token).apply()
    }

    fun clearToken(context: Context) {
        val sharedPreferences = context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)
        sharedPreferences.edit().remove("jwt_token").apply()
    }

    //Converts dbDate to a human readable date
    fun formatDateTime(date : String, pattern : String) : String{
        val utcTime = ZonedDateTime.parse(date)
        val utcPlusTwoTime = utcTime.withZoneSameInstant(ZoneId.of("UTC+2"))
        val outputFormatter = DateTimeFormatter.ofPattern(pattern)
        return utcPlusTwoTime.format(outputFormatter)
    }

    //Converts human readable date to dbDate
    fun covertDateToDBDate(date : String , pattern: String) : String?{
        val inputFormat = SimpleDateFormat(pattern, Locale.getDefault())
        val outputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.getDefault())
        val parsedDate = inputFormat.parse(date)
        val formattedDate = parsedDate?.let { outputFormat.format(it) }
        return formattedDate
    }

    //Converts LocalDateTime date to dbDate
    fun convertDateTimeToTIMESTAMP(date : LocalDateTime) : String{
        val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        return date.format(formatter)
    }



    fun convertToLocalDate(dateTimeString: String): LocalDate {
        // Define the formatter for the input string
        val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")

        // Parse the string into a LocalDateTime
        val localDateTime = LocalDateTime.parse(dateTimeString, formatter)

        // Convert LocalDateTime to LocalDate
        return localDateTime.toLocalDate()
    }

    fun formatMoney(amount : Double) : String{
        val formatter = java.text.DecimalFormat("#,###")
        return formatter.format(amount)
    }

    fun extractErrorMessage(jsonResponse: String)  : String{
        return try {
            val jsonObject = JSONObject(jsonResponse)
            jsonObject.getString("error") // Extract the error message
        }
        catch (e : Exception){
            Log.i("Utils", e.message.toString())
            "Something unexpected went wrong"
        }


    }
}