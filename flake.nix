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
        
        # Node.js version compatible with Expo SDK 54
        nodejs = pkgs.nodejs_20;
        
        # Android SDK packages
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
        
        # Core tools for development
        coreTools = [
          nodejs
          pkgs.git
          pkgs.watchman
        ];
        
        # Android build tools
        androidTools = [
          androidComposition.androidsdk
          jdk
          pkgs.gradle
        ];
      in
      {
        # Development shell - pure, isolated environment
        devShells.default = pkgs.mkShell {
          buildInputs = coreTools ++ androidTools;
          
          # Android SDK paths
          ANDROID_HOME = "${androidComposition.androidsdk}/libexec/android-sdk";
          ANDROID_SDK_ROOT = "${androidComposition.androidsdk}/libexec/android-sdk";
          JAVA_HOME = "${jdk}";
          
          shellHook = ''
            echo ""
            echo "🎮 HeartQuest Development Environment"
            echo "====================================="
            echo ""
            echo "Node: $(node --version)"
            echo "NPM:  $(npm --version)"
            echo "Java: $(java --version 2>&1 | head -1)"
            echo ""
            echo "Commands:"
            echo "  npm install            - Install dependencies to ./node_modules"
            echo "  npx expo start --web   - Run web version"
            echo "  npx expo start         - Run with Expo Go (scan QR)"
            echo "  npx expo run:android   - Build and run on device/emulator"
            echo ""
            echo "📱 To build APK for phone:"
            echo "  1. Connect phone with USB debugging enabled"
            echo "  2. Run: npx expo run:android"
            echo "  Or for emulator: npx expo run:android --device emulator-5554"
            echo ""
          '';
        };
      }
    );
}
