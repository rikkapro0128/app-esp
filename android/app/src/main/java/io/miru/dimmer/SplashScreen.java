package io.miru.dimmer;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.NonNull;

import android.animation.Animator;

import com.airbnb.lottie.LottieAnimationView;

import io.miru.dimmer.MainActivity;

public class SplashScreen extends AppCompatActivity {
    LottieAnimationView animationSplash;
    Intent mainScreen;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent mainScreen = new Intent(this, MainActivity.class);

        setTheme(R.style.AppTheme_NoActionBar);
        setContentView(R.layout.activity_splash_screen);

        animationSplash = findViewById(R.id.animationView);
        animationSplash.addAnimatorListener(new Animator.AnimatorListener() {

            @Override
            public void onAnimationStart(@NonNull Animator animation) {

            }

            @Override
            public void onAnimationEnd(@NonNull Animator animation) {
                // run custome animation

                startActivity(mainScreen);
                finish();
            }

            @Override
            public void onAnimationCancel(@NonNull Animator animation) {

            }

            @Override
            public void onAnimationRepeat(@NonNull Animator animation) {

            }
        });
    }
}