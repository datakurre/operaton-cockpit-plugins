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
               		# Handle scripts for all apps (cockpit, tasklist, welcome, admin)
               		@scripts {
               		  path_regexp ^/operaton/app/(cockpit|tasklist|welcome|admin)/scripts/(.*\.(js|js\.map))$
                		}
                		handle @scripts {
                		  rewrite * /{http.regexp.scripts.2}
                		  root * ${config.devenv.root}
                		  @file_exists file
                		  handle @file_exists {
                		    file_server
                		  }
                		  handle {
                		    rewrite * /operaton/app/{http.regexp.scripts.1}/scripts/{http.regexp.scripts.2}
                		    reverse_proxy localhost:8080 {
                		      header_up X-Forwarded-Host {host}
                		      header_up X-Forwarded-Port {http.request.port}
                		      header_up X-Forwarded-Proto {scheme}
                		    }
                		  }
                		}
                		# Handle config.js for cockpit - serve config.js as-is
                		@cockpit_config {
                		  path /operaton/app/cockpit/scripts/config.js
                		}
                		handle @cockpit_config {
                		  rewrite * /config.js
                		  root * ${config.devenv.root}
                		  @file_exists file
                		  handle @file_exists {
                		    file_server
                		  }
                		  handle {
                		    rewrite * /operaton/app/cockpit/scripts/config.js
                		    reverse_proxy localhost:8080 {
                		      header_up X-Forwarded-Host {host}
                		      header_up X-Forwarded-Port {http.request.port}
                		      header_up X-Forwarded-Proto {scheme}
                		    }
                		  }
                		}
                		# Handle config.js for tasklist - serve tasklist-config.js as config.js
                		@tasklist_config {
                		  path /operaton/app/tasklist/scripts/config.js
                		}
                		handle @tasklist_config {
                		  rewrite * /tasklist-config.js
                		  root * ${config.devenv.root}
                		  @file_exists file
                		  handle @file_exists {
                		    file_server
                		  }
                		  handle {
                		    rewrite * /operaton/app/tasklist/scripts/config.js
                		    reverse_proxy localhost:8080 {
                		      header_up X-Forwarded-Host {host}
                		      header_up X-Forwarded-Port {http.request.port}
                		      header_up X-Forwarded-Proto {scheme}
                		    }
                		  }
                		}
                		# Handle config.js for welcome - serve welcome-config.js as config.js
                		@welcome_config {
                		  path /operaton/app/welcome/scripts/config.js
                		}
                		handle @welcome_config {
                		  rewrite * /welcome-config.js
                		  root * ${config.devenv.root}
                		  @file_exists file
                		  handle @file_exists {
                		    file_server
                		  }
                		  handle {
                		    rewrite * /operaton/app/welcome/scripts/config.js
                		    reverse_proxy localhost:8080 {
                		      header_up X-Forwarded-Host {host}
                		      header_up X-Forwarded-Port {http.request.port}
                		      header_up X-Forwarded-Proto {scheme}
                		    }
                		  }
                		}
                		# Handle config.js for admin - serve admin-config.js as config.js
                		@admin_config {
                		  path /operaton/app/admin/scripts/config.js
                		}
                		handle @admin_config {
                		  rewrite * /admin-config.js
                		  root * ${config.devenv.root}
                		  @file_exists file
                		  handle @file_exists {
                		    file_server
                		  }
                		  handle {
                		    rewrite * /operaton/app/admin/scripts/config.js
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
