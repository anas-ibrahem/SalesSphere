import android.content.Context
import com.example.salessphere.util.Utils
import okhttp3.Interceptor
import okhttp3.Response

class AuthInterceptor(private val context: Context) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()
        val token = Utils.getToken(context) // Retrieve the token from SharedPreferences

        val newRequest = if (token != null) {
            originalRequest.newBuilder()
                .header("Authorization", token)
                .build()
        } else {
            originalRequest
        }

        return chain.proceed(newRequest)
    }

}
