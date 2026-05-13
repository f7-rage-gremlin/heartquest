{
  description = "HeartQuest - Sci-Fi Fantasy RPG Dating Game";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        # Node.js version for Expo SDK 54
        nodejs = pkgs.nodejs_20;
        
        # Core development tools
        coreTools = [
          nodejs
          pkgs.git
          pkgs.watchman  # Better file watching for React Native
        ];

        # Additional useful tools
        extraTools = [
          pkgs.bash
          pkgs.curl
          pkgs.wget
        ];

      in {
        # Development shell - pure, isolated environment
        devShells.default = pkgs.mkShell {
          name = "heartquest-dev";
          
          buildInputs = coreTools ++ extraTools;

          # Environment variables
          shellHook = ''
            echo "🎮 HeartQuest Development Environment"
            echo "====================================="
            echo "Node: $(node --version)"
            echo "npm:  $(npm --version)"
            echo ""
            echo "Commands:"
            echo "  npm install    - Install dependencies"
            echo "  npx expo start - Start dev server"
            echo "  npx expo start --tunnel - Start with tunnel (for phone)"
            echo ""
            
            # Auto-install dependencies if node_modules doesn't exist
            if [ ! -d "node_modules" ]; then
              echo "📦 Installing dependencies..."
              npm install
            fi
          '';
        };

        # For building a production Android APK
        devShells.build = pkgs.mkShell {
          name = "heartquest-build";
          
          buildInputs = coreTools ++ [
            pkgs.jdk17          # For Android builds
            pkgs.gradle         # Build system
          ];

          shellHook = ''
            echo "🏗️ HeartQuest Build Environment"
            echo "==============================="
            echo "Node: $(node --version)"
            echo "Java: $(java --version | head -1)"
            echo ""
            echo "To build Android APK:"
            echo "  eas build --platform android --local"
            echo ""
          '';
        };

        # Packages for easy access
        packages.default = pkgs.symlinkJoin {
          name = "heartquest-env";
          paths = coreTools;
        };
      }
    );
}
