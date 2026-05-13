{
  description = "HeartQuest - Sci-Fi Fantasy RPG Dating Game";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    dream2nix = {
      url = "github:dream2nix/dream2nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = inputs @ { self, nixpkgs, dream2nix, ... }:
    let
      system = "x86_64-linux";
      
      # dream2nix setup
      dream2nixOutputs = dream2nix.lib.makeFlakeOutputs2 {
        inherit self;
        inherit system;
        config = {
          projectRoot = ./.;
        };
        projects = {
          heartquest = {
            name = "heartquest";
            relPath = ".";
            subsystem = "nodejs";
            translator = "package-lock";
            subsystemInfo.nodejs = "20";
            fetchedSource = ./.;
          };
        };
        packageSets = {
          nodejs = nixpkgs.legacyPackages.${system}.nodejs_20.pkgs;
        };
      };
      
      pkgs = nixpkgs.legacyPackages.${system};
      
    in {
      # Inherit packages from dream2nix
      packages.${system} = dream2nixOutputs.packages.${system} or {};
      
      # Custom dev shell with node_modules from Nix store
      devShells.${system}.default = pkgs.mkShell {
        name = "heartquest-dev";
        
        buildInputs = [
          pkgs.nodejs_20
          pkgs.git
          pkgs.watchman
          pkgs.curl
        ];
        
        shellHook = ''
          echo "🎮 HeartQuest - Pure Nix Environment"
          echo "===================================="
          echo "Node: $(node --version)"
          echo ""
          
          # Use node_modules from Nix store if built
          if [ -n "${dream2nixOutputs.packages.${system}.heartquest or ""}" ]; then
            echo "✅ node_modules available from Nix store"
          else
            echo "⚠️  Run 'nix build' to build node_modules into Nix store"
            echo "   Or run 'npm install' for local development"
          fi
          
          echo ""
          echo "Commands:"
          echo "  npx expo start --web  - Start in browser"
          echo "  npx expo start        - Start dev server"
          echo "  nix build             - Build all to Nix store"
          echo ""
        '';
      };
    };
}
