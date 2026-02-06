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
               		# Handle config.js for cockpit - serve config.js as-is
               		@cockpit_config {
               		  path_regexp ^/operaton/app/cockpit/(default/)?scripts/config\.js$
               		}
               		handle @cockpit_config {
               		  rewrite * /config.js
               		  root * ${config.devenv.root}
               		  @file_exists file
               		  handle @file_exists {
               		    file_server
               		  }
               		  handle {
               		    rewrite * /operaton/app/cockpit/{http.regexp.cockpit_config.1}scripts/config.js
               		    reverse_proxy localhost:8080 {
               		      header_up X-Forwarded-Host {host}
               		      header_up X-Forwarded-Port {http.request.port}
               		      header_up X-Forwarded-Proto {scheme}
               		    }
               		  }
               		}
               		# Handle config.js for tasklist - serve tasklist-config.js as config.js
               		@tasklist_config {
               		  path_regexp ^/operaton/app/tasklist/(default/)?scripts/config\.js$
               		}
               		handle @tasklist_config {
               		  rewrite * /tasklist-config.js
               		  root * ${config.devenv.root}
               		  @file_exists file
               		  handle @file_exists {
               		    file_server
               		  }
               		  handle {
               		    rewrite * /operaton/app/tasklist/{http.regexp.tasklist_config.1}scripts/config.js
               		    reverse_proxy localhost:8080 {
               		      header_up X-Forwarded-Host {host}
               		      header_up X-Forwarded-Port {http.request.port}
               		      header_up X-Forwarded-Proto {scheme}
               		    }
               		  }
               		}
               		# Handle config.js for welcome - serve welcome-config.js as config.js
               		@welcome_config {
               		  path_regexp ^/operaton/app/welcome/(default/)?scripts/config\.js$
               		}
               		handle @welcome_config {
               		  rewrite * /welcome-config.js
               		  root * ${config.devenv.root}
               		  @file_exists file
               		  handle @file_exists {
               		    file_server
               		  }
               		  handle {
               		    rewrite * /operaton/app/welcome/{http.regexp.welcome_config.1}scripts/config.js
               		    reverse_proxy localhost:8080 {
               		      header_up X-Forwarded-Host {host}
               		      header_up X-Forwarded-Port {http.request.port}
               		      header_up X-Forwarded-Proto {scheme}
               		    }
               		  }
               		}
               		# Handle config.js for admin - serve admin-config.js as config.js
               		@admin_config {
               		  path_regexp ^/operaton/app/admin/(default/)?scripts/config\.js$
               		}
               		handle @admin_config {
               		  rewrite * /admin-config.js
               		  root * ${config.devenv.root}
               		  @file_exists file
               		  handle @file_exists {
               		    file_server
               		  }
               		  handle {
               		    rewrite * /operaton/app/admin/{http.regexp.admin_config.1}scripts/config.js
                		    reverse_proxy localhost:8080 {
                		      header_up X-Forwarded-Host {host}
                		      header_up X-Forwarded-Port {http.request.port}
                		      header_up X-Forwarded-Proto {scheme}
                		    }
                		  }
                		}
               		# Handle scripts for all apps (cockpit, tasklist, welcome, admin)
               		@scripts {
               		  path_regexp ^/operaton/app/(cockpit|tasklist|welcome|admin)/(default/)?scripts/(.*\.(js|js\.map))$
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
