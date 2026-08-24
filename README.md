# Leyla Blog — Kurulum Rehberi

Bu site artık bir **admin panele** bağlı: `/admin.html` üzerinden giriş yapıp
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

4. Bu değerleri kopyala, proje klasöründeki **`js/firebase-config.js`** dosyasını aç ve `REPLACE_WITH_...` yazan yerleri kendi Firebase değerlerinle değiştir.
5. Güvenlik taramalarını temiz tutmak için bu dosyayı tekrar public repoya gerçek değerlerle push etmemeye dikkat et.

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

Bu e-posta/şifre ile `/admin.html` sayfasından giriş yapacaksın.

## 5. Yerelde test et

Tarayıcı güvenlik kısıtlamaları yüzünden dosyaları doğrudan çift tıklayarak
açmak yerine basit bir yerel sunucu ile çalıştırman gerekiyor:

```bash
cd leyla-blog
python3 -m http.server 8000
```

Sonra tarayıcıda:
- Site: `http://localhost:8000/index.html`
- Admin panel: `http://localhost:8000/admin.html`

(VS Code kullanıyorsan "Live Server" eklentisiyle de aynı işi yapabilirsin.)

## 6. Vercel veya Netlify'e deploy et

**Netlify (en basit yol):**
1. [app.netlify.com](https://app.netlify.com) → "Add new site" → "Deploy manually"
2. `leyla-blog` klasörünü doğrudan sürükleyip bırak.
3. Birkaç saniyede canlı bir URL alırsın (örn. `leyla-blog.netlify.app`).

**Vercel:**
1. Proje klasörünü bir GitHub reposuna yükle.
2. [vercel.com](https://vercel.com) → "Add New Project" → repoyu seç.
3. Framework olarak **"Other"** seç (statik site), build ayarı gerekmez.
4. Deploy et.

> Not: Firebase web anahtarları (özellikle `apiKey`) istemci tarafında herkese açık olarak
> görünür — bu normaldir, Firebase bu anahtarları güvenlik için değil
> proje tanımlamak için kullanır. Gerçek güvenlik yukarıda yazdığımız
> **Firestore Rules** ile sağlanıyor.

## 7. Admin paneli kullan

Deploy ettikten sonra `senin-siten.com/admin.html` adresine git, oluşturduğun
e-posta/şifre ile giriş yap. Panelden:

- **Yazılar** sekmesinden blog yazısı ekle/düzenle/sil — anında `blog.html` ve `index.html`'de görünür.
- **Notlar** sekmesinden kısa notlar ekle — `notes.html`'de görünür.
- **Projeler** sekmesinden proje kartı ekle — `projects.html`'de görünür.
- **Mesajlar** sekmesinden `contact.html` formundan gelen mesajları oku, okundu işaretle veya sil.

---

## Sorun giderme

- **"Yazılar yüklenemedi" hatası görüyorum** → `js/firebase-config.js` içindeki anahtarları doğru girdiğinden emin ol, tarayıcı konsolunu (F12) kontrol et.
- **Admin girişi çalışmıyor** → Authentication → Users altında kullanıcının gerçekten oluştuğunu kontrol et.
- **Yazı eklendi ama sitede görünmüyor** → Firestore Rules'u yayınladığından (Publish) emin ol, sayfayı yenile.
- **CORS / dosya açma hatası** → Dosyaları çift tıklayarak değil, adım 5'teki gibi yerel sunucu üzerinden aç.
