{ ... }:
let
  shell =
    { config, ... }:
    {
      services.operaton.port = 8080;
      services.operaton.postgresql.enable = true;

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
            # Handle config.js for all apps - serve {app}-config.js or config.js for cockpit
            @app_config {
              path_regexp config ^/operaton/app/(cockpit|tasklist|welcome|admin)/(default/)?scripts/config\.js$
            }
            handle @app_config {
              # For cockpit use config.js, for others use {app}-config.js
              @is_cockpit expression {http.regexp.config.1} == "cockpit"
              handle @is_cockpit {
                rewrite * /config.js
                file_server {
                  root ${config.devenv.root}
                }
              }
              @is_not_cockpit expression {http.regexp.config.1} != "cockpit"
              handle @is_not_cockpit {
                rewrite * /{http.regexp.config.1}-config.js
                file_server {
                  root ${config.devenv.root}
                }
              }
            }
            # Handle scripts for all apps (cockpit, tasklist, welcome, admin)
            @scripts {
              path_regexp scripts ^/operaton/app/(cockpit|tasklist|welcome|admin)/(default/)?scripts/(.*\.(js|js\.map))$
            }
            handle @scripts {
              rewrite * /{http.regexp.scripts.3}
              root * ${config.devenv.root}
              @file_exists file
              handle @file_exists {
                file_server
              }
              handle {
                rewrite * /operaton/app/{http.regexp.scripts.1}/{http.regexp.scripts.2}scripts/{http.regexp.scripts.3}
                reverse_proxy localhost:8080 {
                  header_up X-Forwarded-Host {host}
                  header_up X-Forwarded-Port {http.request.port}
                  header_up X-Forwarded-Proto {scheme}
                }
              }
            }
            # Default: proxy to backend
            handle {
              reverse_proxy localhost:8080 {
                header_up X-Forwarded-Host {host}
                header_up X-Forwarded-Port {http.request.port}
                header_up X-Forwarded-Proto {scheme}
              }
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
    { pkgs, ... }:
    {
      devcontainer.enable = true;
    };
in
{
  profiles.shell.module = {
    imports = [ shell ];
  };

  profiles.devcontainer.module = {
    imports = [ devcontainer ];
  };
}
