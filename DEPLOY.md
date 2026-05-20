# SKYLONZE — WHM/cPanel + PM2 deploy

Full-stack Next.js app (Node server + MySQL). Runs on port **6060**,
reverse-proxied to your domain.

## 0. Prerequisites (one time, as root or via WHM)
- Node.js 18+ and npm available for the `skylonze` user
  (WHM » "Manage Node.js" / or NodeSource install)
- PM2 installed globally: `npm i -g pm2`
- MySQL DB `skylonze` reachable with the creds in `.env.local`

## 1. Upload
Put `skylonze-deploy.zip` inside `/home/skylonze/public_html/` and extract:

```bash
cd /home/skylonze/public_html
unzip -o skylonze-deploy.zip
rm -f skylonze-deploy.zip
```

After extraction these must exist: `package.json`, `.env.local`,
`ecosystem.config.js`, `app/`, `lib/`, `components/`, `scripts/`, `public/`.

## 2. Install + build (on the server)
```bash
cd /home/skylonze/public_html
npm ci
npm run build
```

## 3. Initialize the database (first deploy only)
Creates tables + seeds the admin. Safe to re-run (idempotent).
```bash
cd /home/skylonze/public_html
node --env-file=.env.local scripts/init-db.mjs
```

## 4. Start with PM2
```bash
cd /home/skylonze/public_html
pm2 start ecosystem.config.js
pm2 save
pm2 startup    # run the command it prints, to survive reboots
```

App now listening on `127.0.0.1:6060`.

## 5. Reverse proxy domain → 6060
In WHM use **Apache mod_proxy** (or a cPanel "Application Manager" entry).
Add to the domain's Apache include / .htaccess in public_html:

```apache
RewriteEngine On
RewriteRule ^$ http://127.0.0.1:6060/ [P,L]
RewriteRule ^(.*)$ http://127.0.0.1:6060/$1 [P,L]
```

(Requires mod_proxy + mod_proxy_http enabled in EasyApache.)

## Updating later
```bash
cd /home/skylonze/public_html
# upload new zip, then:
unzip -o skylonze-deploy.zip && rm -f skylonze-deploy.zip
npm ci
npm run build
pm2 restart skylonze
```

## Useful PM2 commands
```bash
pm2 status
pm2 logs skylonze
pm2 restart skylonze
pm2 stop skylonze
```

## Admin
- URL: `https://YOURDOMAIN/admin`
- Email/password: from `.env.local` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- Change the password after first login.

## Port
Default **6060**. To change: edit `ecosystem.config.js` (`args` + `PORT`)
and the reverse-proxy target, then `pm2 restart skylonze`.
