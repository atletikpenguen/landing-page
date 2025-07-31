# Analist Ligi - Landing Page

Türkiye'nin ilk performans tescilli analist platformu için ön kayıt sayfası.

## 🚀 Vercel Deployment

### 1. GitHub'a Push
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Vercel'e Deploy
1. [vercel.com](https://vercel.com) hesabı oluşturun
2. "New Project" → GitHub repo'nuzu seçin
3. Build ayarları otomatik gelecek
4. Deploy'a tıklayın

### 3. Email Toplama
- Formlar Netlify/Vercel forms ile çalışacak
- Gelen email'ler dashboard'da görünecek

## 🌐 Custom Domain Bağlama

### Vercel'de Domain Ayarları:
1. Project Settings → Domains
2. Domain'inizi ekleyin: `analistligi.com`
3. DNS ayarlarını güncelleyin:

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.61
```

### Subdomain için:
```
Type: CNAME
Name: app (veya istediğiniz subdomain)
Value: cname.vercel-dns.com
```

## 📧 Email Notifications
Vercel dashboard'dan email notification'ları aktif edebilirsiniz.

## 🛠️ Local Development
```bash
npm install
npm start
```

## 📋 Özellikler
- ✅ Responsive design
- ✅ Email form validation
- ✅ Vercel deployment ready
- ✅ SEO optimized
- ✅ Custom domain ready
- ✅ No MetaMask dependencies