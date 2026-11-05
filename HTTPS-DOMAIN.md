# HTTPS & Custom Domain (Search Console)

Google braucht ein gültiges Zertifikat **für pulseneon.de**, nicht nur für `*.github.io`.

## Schritte (GitHub Pages)

1. Repo → **Settings → Pages**
2. Source: Deploy from branch `main` / root
3. **Custom domain:** `pulseneon.de` speichern (CNAME-Datei im Repo enthält bereits `pulseneon.de`)
4. DNS beim Domain-Anbieter:
   - **Apex** `pulseneon.de`: GitHub A-Records  
     `185.199.108.153`  
     `185.199.109.153`  
     `185.199.110.153`  
     `185.199.111.153`
   - **www**: CNAME → `DEIN-USER.github.io`
5. In Pages warten bis „DNS check successful“
6. **Enforce HTTPS** aktivieren (Checkbox) – GitHub stellt dann ein Let’s-Encrypt-Zertifikat **für pulseneon.de** aus
7. 5–60 Minuten warten, dann im Browser prüfen: Schloss-Symbol bei `https://pulseneon.de`

Wenn das Zertifikat nur `*.github.io` zeigt, ist Enforce HTTPS noch nicht aktiv oder DNS zeigt nicht auf GitHub.

## Search Console

- Property als **URL-Präfix** `https://pulseneon.de/` anlegen (nicht nur http)
- Sitemap: `https://pulseneon.de/sitemap.xml`
- Indexierung erst testen, wenn HTTPS ohne Warnung läuft
