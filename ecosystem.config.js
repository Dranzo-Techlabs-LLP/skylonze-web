// PM2 process config for SKYLONZE (Next.js full-stack).
// Runs `next start` on port 6060. Next.js auto-loads .env.local.
module.exports = {
  apps: [
    {
      name: "skylonze",
      cwd: "/home/skylonze/public_html",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 6060",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "6060",
        HOSTNAME: "127.0.0.1",
      },
    },
  ],
};
