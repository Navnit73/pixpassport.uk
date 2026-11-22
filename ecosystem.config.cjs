/**
 * PM2 process definition for pixpassport.uk.
 * scripts/deploy.sh runs `pm2 startOrReload` on this file, so the first deploy
 * creates the process and later deploys reload it with the same name and port.
 * Port 3007 must match APP_PORT in scripts/deploy.sh and the nginx upstream.
 */
module.exports = {
  apps: [
    {
      name: "pixpassport-uk",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3007",
      cwd: __dirname,
      env: {
        NODE_ENV: "production",
        PORT: "3007",
      },
      max_memory_restart: "700M",
      kill_timeout: 5000,
    },
  ],
};
