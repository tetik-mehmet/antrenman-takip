# Antrenman Programı Yönetim Sistemi

Spor salonu antrenman programlarını yönetmek için Next.js (App Router), MongoDB, JWT ve rol tabanlı yetkilendirme kullanan bir web uygulaması.

## Özellikler

- **Kimlik doğrulama**: E-posta + şifre, JWT (httpOnly cookie), bcrypt ile hash
- **Roller**: ADMIN ve USER
- **Admin**: Kullanıcı listesi, tüm programlar, kullanıcılara program atama
- **Kullanıcı**: Kendi programlarını görüntüleme ve oluşturma
- **Program yapısı**: Başlık, günler, her günde egzersizler (isim, set, tekrar)

## Gereksinimler

- Node.js 18+
- MongoDB (yerel veya Atlas)

## Kurulum

1. Bağımlılıklar yüklü (proje `create-next-app` ile oluşturulduysa hazır):

```bash
npm install
```

2. Ortam değişkenleri: `.env.example` dosyasını `.env.local` olarak kopyalayın ve değerleri doldurun:

```bash
cp .env.example .env.local
```

Örnek `.env.local`:

```env
MONGODB_URI=mongodb://localhost:27017/gym-app
JWT_SECRET=your-super-secret-key-min-32-chars
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Örnek veri (opsiyonel):

```bash
node scripts/seed.js
```

Bu komut bir ADMIN ve bir USER kullanıcısı ile 2 örnek program oluşturur:

- **ADMIN**: admin@example.com / admin123
- **USER**: user@example.com / user123

4. Geliştirme sunucusu:

```bash
npm run dev
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) açın. Giriş yapılmamışsa `/login` veya `/register` yönlendirilirsiniz.

## Proje yapısı

```
src/
├── app/
│   ├── (auth)/          # Giriş, kayıt
│   ├── admin/           # Admin paneli
│   ├── user/            # Kullanıcı paneli
│   ├── api/             # API route'ları
│   ├── layout.js
│   └── page.js
├── components/
│   ├── ui/              # Button, Input, Card, Alert
│   ├── forms/           # LoginForm, RegisterForm, ProgramForm
│   └── layout/          # Header, Sidebar, DashboardLayout
├── lib/
│   ├── db.js            # MongoDB bağlantısı
│   ├── auth.js          # JWT ve cookie yardımcıları
│   ├── validation.js
│   └── utils.js
├── models/              # Mongoose User, TrainingProgram
├── middleware.js        # Rota koruma ve yönlendirme
└── types/               # Sabitler
```

## Vercel ile deploy

1. Projeyi Vercel’e bağlayın.
2. Ortam değişkenlerini ekleyin: `MONGODB_URI`, `JWT_SECRET`, `NEXT_PUBLIC_APP_URL`.
3. Build komutu: `next build` (varsayılan).
4. MongoDB Atlas kullanıyorsanız `MONGODB_URI` için connection string’i girin.

## Lisans

MIT
