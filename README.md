# Leyla Blog — Kurulum Rehberi

Bu site artık bir **admin panele** bağlı: `/admin` üzerinden giriş yapıp
yazı, not ve proje ekleyebilir, iletişim formundan gelen mesajları
görebilirsin. Veriler **Firebase (Firestore + Authentication)** üzerinde
saklanıyor, site dosyaları ise Vercel/Netlify gibi bir yerde statik olarak
duruyor.

Aşağıdaki adımları sırayla takip et — toplam 15-20 dakika sürer.

---

## 1. Firebase projesi oluştur

1. [console.firebase.google.com](https://console.firebase.google.com) adresine git, Google hesabınla giriş yap.
2. **"Proje ekle"** butonuna tıkla, projene bir isim ver (örn. `leyla-blog`).
3. Google Analytics sorulursa kapatabilirsin, gerekli değil.
4. Proje oluşunca kontrol paneline yönlendirileceksin.

## 2. Web uygulaması ekle ve config anahtarlarını al

1. Proje kontrol panelinde sol üstteki **"</>"** (Web) ikonuna tıkla.
2. Uygulamana bir takma isim ver (örn. `leyla-web`), **"Firebase Hosting'i de kur"** kutusunu **işaretleme** (Vercel/Netlify kullanacağız).
3. Kayıt sonrası sana bir `firebaseConfig` objesi gösterilecek, şuna benzer:

```js
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_WEB_API_KEY",
  authDomain: "leyla-blog.firebaseapp.com",
  projectId: "leyla-blog",
  storageBucket: "leyla-blog.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

4. Proje klasöründeki **`.env.example`** dosyasını **`.env`** olarak kopyala ve içindeki `VITE_FIREBASE_*` değerlerini kendi Firebase değerlerinle doldur.
5. `.env` dosyası `.gitignore` içinde zaten hariç tutuluyor — gerçek anahtarları public repoya push etmemeye dikkat et.

## 3. Firestore veritabanını aktif et

1. Sol menüden **Build → Firestore Database** yoluna git.
2. **"Create database"** butonuna tıkla.
3. Konum olarak sana yakın bir bölge seç (örn. `eur3 (europe-west)`).
4. Güvenlik kuralları sorulduğunda **"Start in production mode"** seç — kuralları birazdan kendimiz yazacağız.

### Güvenlik kurallarını ayarla

Firestore ekranında üstteki **"Rules"** sekmesine geç ve içeriği şununla değiştir:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Yazılar, notlar, projeler: herkes okuyabilir, sadece giriş yapmış admin yazabilir
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /notes/{noteId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Mesajlar: herkes gönderebilir (form), sadece admin okuyup silebilir
    match /messages/{messageId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

**"Publish"** butonuna basarak yayınla. Bu kurallar sayesinde ziyaretçiler
sadece iletişim formu gönderebilir, yazı/not/proje ekleme-silme işlemleri
sadece giriş yapmış admin hesabına açık olur.

## 4. Admin giriş hesabı oluştur

1. Sol menüden **Build → Authentication** yoluna git.
2. **"Get started"** butonuna tıkla.
3. Sign-in method listesinden **"Email/Password"** seçeneğini aç (Enable) ve kaydet.
4. **"Users"** sekmesine geç, **"Add user"** butonuna tıkla.
5. Kendi e-postanı ve güçlü bir şifre gir, kaydet.

Bu e-posta/şifre ile `/admin` sayfasından giriş yapacaksın.

## 5. E-posta bildirimlerini bağla (EmailJS)

İletişim formundan gelen mesajlar Firestore'a kaydedilir (admin panelde okunur),
ayrıca isteğe bağlı olarak **EmailJS** ile gerçek bir e-postaya da dönüştürülebilir.

1. [emailjs.com](https://www.emailjs.com/) üzerinden ücretsiz hesap aç.
2. **Email Services** → bir servis ekle (örn. Gmail, `lmmdva6@gmail.com` ile bağla) → bir **Service ID** üretir.
3. **Email Templates** → **"Contact Us"** şablonunu seç, **To email** alanına `lmmdva6@gmail.com` yaz,
   içerikte `{{from_name}}`, `{{from_email}}`, `{{subject}}`, `{{message}}` değişkenlerini kullan.
   Bcc/Cc alanlarını boş bırakabilirsin. Kaydedince bir **Template ID** üretir.
4. **Account → General** sekmesinden **Public Key**'i al.
5. `.env` dosyana şu üç değeri ekle:

```
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxx
```

Bu adım atlanırsa iletişim formu yine çalışır (mesaj Firestore'a kaydedilir), sadece e-posta bildirimi gönderilmez.

## 6. Yerelde test et

Site artık Vite ile derlenen bir React uygulaması. Önce bağımlılıkları kur, sonra
geliştirme sunucusunu başlat:

```bash
cd leyla-blog
npm install
npm run dev
```

Terminalde verilen adresi aç (varsayılan `http://localhost:5173`). Admin paneli
`/admin` rotasında.

## 7. Vercel veya Netlify'e deploy et

Önce `npm run build` ile `dist/` klasörünü üret; deploy sırasında **build komutu**
`npm run build`, **output dizini** `dist` olmalı. Env değişkenlerini
(`VITE_FIREBASE_*`, `VITE_EMAILJS_*`) hosting sağlayıcısının environment variables ayarından girmeyi unutma.

**Netlify:**
1. [app.netlify.com](https://app.netlify.com) → "Add new site" → repoyu bağla veya `dist` klasörünü sürükleyip bırak.
2. Build command: `npm run build`, publish directory: `dist`.
3. Site settings → Environment variables kısmına `VITE_FIREBASE_*` ve `VITE_EMAILJS_*` değerlerini ekle.

**Vercel:**
1. Proje klasörünü bir GitHub reposuna yükle.
2. [vercel.com](https://vercel.com) → "Add New Project" → repoyu seç.
3. Framework olarak **"Vite"** otomatik algılanır; build ayarları varsayılan kalabilir.
4. Project Settings → Environment Variables kısmına `VITE_FIREBASE_*` ve `VITE_EMAILJS_*` değerlerini ekle, sonra deploy et.

> Not: Firebase web anahtarları (özellikle `apiKey`) istemci tarafında herkese açık olarak
> görünür — bu normaldir, Firebase bu anahtarları güvenlik için değil
> proje tanımlamak için kullanır. Gerçek güvenlik yukarıda yazdığımız
> **Firestore Rules** ile sağlanıyor.

## 8. Admin paneli kullan

Deploy ettikten sonra `senin-siten.com/admin` adresine git, oluşturduğun
e-posta/şifre ile giriş yap. Panelden:

- **Posts** sekmesinden blog yazısı ekle/düzenle/sil — anında `/blog` ve `/`'de görünür. Kapak görseli
  için bir link yapıştırabilir **veya** bilgisayarından bir dosya yükleyip açılan pencerede
  16:9 orana kırpabilirsin.
- **Notes** sekmesinden kısa notlar ekle — `/notes`'da görünür.
- **Projects** sekmesinden proje kartı ekle (görsel için aynı link/yükle+kırp seçeneği) — `/projects`'te görünür.
- **Messages** sekmesinden `/contact` formundan gelen mesajları oku, okundu işaretle veya sil.

---

## Sorun giderme

- **"Yazılar yüklenemedi" hatası görüyorum** → `.env` içindeki `VITE_FIREBASE_*` değerlerini doğru girdiğinden emin ol, `.env`'i değiştirdikten sonra `npm run dev`'i yeniden başlat, tarayıcı konsolunu (F12) kontrol et.
- **Admin girişi çalışmıyor** → Authentication → Users altında kullanıcının gerçekten oluştuğunu kontrol et.
- **Yazı eklendi ama sitede görünmüyor** → Firestore Rules'u yayınladığından (Publish) emin ol, sayfayı yenile.
