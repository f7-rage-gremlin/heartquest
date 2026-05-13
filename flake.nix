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
        
        # Core tools for development
        coreTools = [
          nodejs
          pkgs.git
          pkgs.watchman
        ];
      in
      {
        # Development shell - pure, isolated environment
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
            echo "  npm install         - Install dependencies to ./node_modules"
            echo "  npx expo start --web - Run web version"
            echo "  npx expo start      - Run with Expo Go (scan QR)"
            echo ""
          '';
        };
      }
    );
}
