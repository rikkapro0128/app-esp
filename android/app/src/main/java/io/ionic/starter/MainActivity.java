package io.ionic.starter;

import android.content.Intent;
import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Intent splashScreen = new Intent(this, SplashScreen.class);
        startActivity(splashScreen);
        overridePendingTransition(0, 0);
    }
}
