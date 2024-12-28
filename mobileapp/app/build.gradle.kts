plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.jetbrains.kotlin.android)
    id("kotlin-kapt")

}

android {
    namespace = "com.example.salessphere"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.salessphere"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
    buildFeatures {
        dataBinding = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.activity)
    implementation(libs.androidx.constraintlayout)
    implementation(libs.androidx.navigation.fragment.ktx)
    implementation(libs.androidx.navigation.ui.ktx)
    implementation(libs.androidx.swiperefreshlayout)
    implementation(libs.androidx.ui.desktop)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)

    //Corouines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0-RC")


    //Lottie animations
    implementation ("com.airbnb.android:lottie:6.6.0")

    //Retrofit
    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation ("com.squareup.retrofit2:converter-gson:2.11.0")

    //Gson
    implementation ("com.google.code.gson:gson:2.11.0")

    //ViewModel
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.8.7")

    //okhttp3
    implementation ("com.squareup.okhttp3:logging-interceptor:4.11.0")

    //Glide
    implementation ("com.github.bumptech.glide:glide:4.16.0")

    //Cloudinary
    implementation ("com.cloudinary:cloudinary-android:2.3.1")


}