# Leyla Blog & Portfolio

Bu proje, kişisel blog yazılarımı, projelerimi ve notlarımı paylaştığım statik web sitemin kaynak kodlarını içerir. İçerik yönetimi için özel olarak geliştirilmiş bir admin paneline sahiptir.

##  Teknolojiler ve Mimari

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript
*   **Backend & Veritabanı:** Firebase (Firestore, Authentication)
*   **Deployment:** Vercel / Netlify

## Temel Özellikler

*   **Dinamik İçerik Yönetimi:** Blog yazıları, projeler ve notlar Firestore üzerinden çekilir.
*   **Custom CMS (Yönetim Paneli):** İçerik ekleme/silme ve iletişim mesajlarını okuma işlemleri için Firebase Auth ile korunan özel bir arayüz.
*   **İletişim Formu:** Ziyaretçilerin gönderdiği mesajlar doğrudan Firestore'a kaydedilir.
*   **Güvenlik:** Firestore Rules ile yetkisiz okuma/yazma işlemleri engellenmiştir (Sadece admin yazabilir, ziyaretçiler sadece okuyabilir ve form gönderebilir).

##  Geliştirme Ortamı (Local Development)

Projeyi yerelde incelemek için bir HTTP sunucusu kullanılması gerekmektedir (CORS politikaları nedeniyle doğrudan dosya açmak Firebase bağlantısında sorun yaratabilir).

Python kullanarak başlatmak için:
```bash
python3 -m http.server 8000
