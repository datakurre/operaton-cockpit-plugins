{ config, ... }:
{
  profiles = {
    full-vim.module = {
      services.devcontainer.enable-vscode = true;
      services.devcontainer.enable-vscode-vim = true;
      services.devcontainer.enable-podman = true;
    };
  };

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
}
