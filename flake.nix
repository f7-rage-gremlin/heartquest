{
  description = "HeartQuest - Sci-Fi Fantasy RPG Dating Game";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        
        # Node.js for Vite/Capacitor
        nodejs = pkgs.nodejs_20;
        
        # Android SDK for APK builds
        androidComposition = pkgs.androidenv.composePackages {
          platformTools = true;
          buildTools = [ "35.0.0" ];
          platforms = [ "35" ];
          cmdlineTools = "latest";
          emulator = true;
          ndk = "latest";
        };
        
        # JDK for Android builds
        jdk = pkgs.jdk17;
        
        # Core tools
        coreTools = [
          nodejs
          pkgs.git
        ];
        
        # Android build tools
        androidTools = [
          androidComposition.androidsdk
          jdk
          pkgs.gradle
        ];
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = coreTools ++ androidTools;
          
          ANDROID_HOME = "${androidComposition.androidsdk}/libexec/android-sdk";
          ANDROID_SDK_ROOT = "${androidComposition.androidsdk}/libexec/android-sdk";
          JAVA_HOME = "${jdk}";
          
          shellHook = ''
            echo ""
            echo "🎮 HeartQuest Development Environment (Capacitor)"
            echo "================================================="
            echo ""
            echo "Node: $(node --version)"
            echo "NPM:  $(npm --version)"
            echo "Java: $(java --version 2>&1 | head -1)"
            echo ""
            echo "Commands:"
            echo "  npm start              - Run web dev server"
            echo "  npm run build          - Build for production"
            echo "  npx cap add android    - Add Android platform"
            echo "  npx cap sync android   - Sync to Android"
            echo "  npx cap open android   - Open in Android Studio"
            echo ""
            echo "📱 To build APK:"
            echo "  cd android && ./gradlew assembleRelease"
            echo "  APK: android/app/build/outputs/apk/release/"
            echo ""
          '';
        };
      }
    );
}
