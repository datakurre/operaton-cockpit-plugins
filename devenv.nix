{ ... }:
let
  shell =
    { config, ... }:
    {
      package.operaton.port = 8080;

      services.caddy = {
        enable = true;
        config = ''
          	      {
          		admin off
          		log {
          		  output stdout
          		}
          	      }
          	      :8000 {
          		@scripts {
          		  path_regexp ^/operaton/app/([^/]+)/scripts/(.*\.(js|js\.map))$
          		}
          		handle @scripts {
          		  rewrite * /{http.regexp.scripts.2}
          		  root * ${config.devenv.root}
          		  file_server
          		}
          		handle {
          		  reverse_proxy localhost:8080
          		}
          	      }
          	    '';
      };

      languages.javascript = {
        enable = true;
        npm.enable = true;
        yarn.enable = true;
      };
    };
  devcontainer =
    { ... }:
    {
      devcontainer.enable = true;
      devcontainer.settings.customizations.vscode.extensions = [
        "GitHub.copilot"
        "GitHub.copilot-chat"
        "bbenoist.Nix"
        "eamodio.gitlens"
        "mkhl.direnv"
        "ms-vscode.makefile-tools"
      ];
    };
in
{
  profiles.shell.module = {
    imports = [ shell ];
  };

  profiles.devcontainer.module = {
    imports = [ devcontainer ];
  };

  profiles.devcontainer-rhel.module = {
    imports = [ devcontainer ];
    devcontainer.tweaks = [
      "vscode"
      "gpg-agent"
    ];
    devcontainer.settings.customizations.vscode.extensions = [
      "vscodevim.vim"
    ];
  };

  profiles.devcontainer-nixos.module = {
    imports = [ devcontainer ];
    devcontainer.tweaks = [
      "podman"
      "vscode"
      "gpg-agent"
    ];
    devcontainer.settings.customizations.vscode.extensions = [
      "vscodevim.vim"
    ];
  };
}
