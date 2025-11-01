ТЗ

**TASK 1. Налаштування поштового сервісу (Brevo + Nodemailer)**

1. Зареєструйте акаунт на [brevo.com](https://www.brevo.com/). (якщо ще не реєструвались)
2. Створіть утиліту для відправки пошти `src/utils/sendMail.js`, яка використовує `nodemailer` і підключається до SMTP-сервера Brevo.
3. У `.env` додайте змінні з чутливими даними для SMTP:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM`

  

**TASK 2. Надсилання email для скидання паролю**

1. Створіть роут POST `/auth/request-reset-email`.
2. Створіть валідаційну схему `requestResetEmailSchema`.
3. Додайте контролер `requestResetEmail`, який:

- шукає користувача за `email`, повертає `404 User not found`, якщо його немає;
- генерує JWT-токен (`sub`, `email`) із життям 20 хв;
- формує HTML-лист із шаблону за допомогою `handlebars`;
- відправляє лист з посиланням на фронтенд:

```js 
<FRONTEND_DOMAIN>/reset-password?token=<jwt-token> 
```

- у випадку помилки надсилання повертає `500 Failed to send the email`;
- у випадку успіху повертає `{ message: 'Password reset email sent successfully' }`.

  

**TASK 3. Скидання паролю**

1. Створіть роут POST `/auth/reset-password`.
2. Створіть валідаційну схему `resetPasswordSchema`.
3. Додайте контролер `resetPassword`, який:

- перевіряє токен (`401 Invalid or expired token` при помилці);
- шукає користувача за даними з токена (`404 User not found`, якщо немає);
- хешує новий пароль через **bcrypt** і оновлює в базі;
- повертає відповідь:

```js 
{ "message": "Password reset successfully" } 
```

  

**TASK 4. Налаштування Cloudinary**

1. Зареєструйте акаунт на [cloudinary.com](https://cloudinary.com/). (якщо ще не зареєстровані)
2. Додайте у `.env` налаштування для Cloudinary:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

  

**TASK 5. Модель користувача (оновлення для аватара)**

1. У `src/models/user.js` додайте поле `avatar` (String, required).
2. У хук `pre('save')` додайте дефолтне значення для `avatar`:

```js 
https://ac.goit.global/fullstack/react/default-avatar.jpg 
```

  

**TASK 6. Завантаження аватара**

1. Створіть роут PATCH `/users/me/avatar`.
2. Додайте middleware `upload`, який:

- використовує `memoryStorage`;
- обмежує файл до **2MB**;
- дозволяє лише `image/*`;
- повертає помилку "Only images allowed" у разі невідповідності.

1. Створіть утиліту `saveFileToCloudinary`, яка завантажує буфер файлу у Cloudinary.
2. Додайте контролер `updateUserAvatar`, який:

- перевіряє наявність файлу (`400 No file` при відсутності);
- завантажує його в Cloudinary;
- оновлює `avatar` користувача в БД;
- повертає:

```js 
{ "url": "<посилання_на_аватар>" } 
```