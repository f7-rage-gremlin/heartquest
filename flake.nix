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
        
        # Core tools
        coreTools = [
          nodejs
          pkgs.git
          pkgs.nodePackages.npm
        ];
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = coreTools;
          
          shellHook = ''
            echo ""
            echo "🎮 HeartQuest Development Environment"
            echo "====================================="
            echo ""
            echo "Node: $(node --version)"
            echo "NPM:  $(npm --version)"
            echo ""
            echo "Commands:"
            echo "  npm install   - Install dependencies"
            echo "  npm run dev   - Start web dev server"
            echo "  npm run build - Build for production"
            echo ""
            echo "📱 For Android APK:"
            echo "  npm run build"
            echo "  npx cap add android"
            echo "  npx cap sync android"
            echo "  npx cap open android  # Opens Android Studio"
            echo ""
            echo "  Then build APK from Android Studio or:"
            echo "  cd android && ./gradlew assembleDebug"
            echo ""
          '';
        };
      }
    );
}
