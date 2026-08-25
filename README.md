# Next Frame — App

تطبيق ويب شغال بالكامل (Next.js + Supabase) لشركة Next Frame. فيه:

- تسجيل دخول / حساب جديد حقيقي (Supabase Auth)
- الصفحة الرئيسية: تقديم مشروع جديد + متابعة حالة مشاريعك
- مجتمع: بوستات، لايك، تعليقات
- بروفايل لكل مستخدم + متابعة/إلغاء متابعة
- رسائل مباشرة بين المستخدمين
- داش بورد أدمن منفصل (كلمة سر بس، مش حساب Supabase) — عرض كل المشاريع، تغيير الحالة، إضافة ملاحظة للعميل

الهوية البصرية (الألوان + الخطوط: Anton / Inter / JetBrains Mono) متطبقة زي البراند بوك بالظبط.

---

## 1) اعمل مشروع Supabase مجاني

1. روح على https://supabase.com وسجل حساب (مجاني).
2. اعمل **New Project**.
3. من **Project Settings -> API** خد:
   - `Project URL`
   - `anon public key`
4. من **SQL Editor** جوه المشروع، افتح **New query**، الصق محتوى ملف
   `supabase/schema.sql` الموجود في المشروع ده، واضغط **Run**.
   ده هيعمل كل الجداول (profiles, projects, posts, follows, messages...)
   مع كل صلاحيات الأمان (Row Level Security).

### تعطيل تأكيد الإيميل (اختياري، للتجربة بسرعة)

افتراضيًا Supabase بيبعت إيميل تأكيد لما حد يعمل حساب. عشان تجرب بسرعة من غير
ما تتعامل مع الإيميلات:

**Authentication -> Providers -> Email -> "Confirm email"** اعمله Disable.

(لو سايبها شغالة، المستخدم هيحتاج يأكد إيميله الأول قبل ما يقدر يسجل دخول.)

### تخلي حسابك أدمن (بيانات فقط، مش داش بورد الأدمن اللي بكلمة السر)

لو عايز مستخدم معين يظهر كـ admin جوه جدول profiles (مش مطلوب لداش بورد
الأدمن بتاعنا لأنه بيشتغل بكلمة سر منفصلة، بس ممكن تستخدمه لاحقًا):

```sql
update profiles set is_admin = true
where id = (select id from auth.users where email = 'you@example.com');
```

---

## 2) شغّل المشروع على جهازك

```bash
cp .env.local.example .env.local
# افتح .env.local واملأ NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY
# وحط كلمة سر قوية في ADMIN_PASSWORD

npm install
npm run dev
```

افتح http://localhost:3000

- داش بورد الأدمن: http://localhost:3000/admin/login (كلمة السر اللي حطيتها في ADMIN_PASSWORD)

---

## 3) النشر (Deploy) مجانًا

أسهل طريقة: [Vercel](https://vercel.com) (عندهم Free tier كويس لمشروع زي ده).

1. ارفع الكود على GitHub repo.
2. من Vercel: **New Project** -> اختار الـ repo.
3. في **Environment Variables** ضيف نفس المتغيرات اللي في `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_PASSWORD`
4. Deploy.

Supabase الفري تير بيدّيك: قاعدة بيانات Postgres، Auth، وحتى 500MB تخزين —
كافي جدًا للـ MVP والاختبار الأول مع عملاء حقيقيين من غير ما تدفع حاجة.

---

## البنية

```
app/
  page.tsx                    الرئيسية (هبوط + مشاريعي)
  login/, signup/             الدخول والتسجيل
  community/                  فيد المجتمع
  profile/[username]/         بروفايل + متابعة
  messages/, messages/[username]/   الرسائل
  admin/login/, admin/        داش بورد الأدمن
lib/
  supabase/                   عملاء Supabase (browser/server/middleware)
  actions/                    كل الـ server actions (auth, projects, posts, follows, messages, admin)
  status.ts                   حالات المشروع
components/                   مكونات مشتركة (Navbar, Forms, Cards...)
supabase/schema.sql           سكيما قاعدة البيانات كاملة
```

## حالة المشروع الحالية (MVP شغال بالكامل، اتعمل له build نضيف بدون أخطاء)

تم فعليًا — مش مجرد تصميم:
- Auth حقيقي (signup/login/logout) عبر Supabase
- تقديم ومتابعة المشاريع (متربط بقاعدة بيانات حقيقية)
- مجتمع: بوست/لايك/كومنت شغالين فعليًا
- متابعة/إلغاء متابعة بين المستخدمين
- رسائل مباشرة (Direct messages) متخزنة وقابلة للقراءة
- داش بورد أدمن بكلمة سر منفصلة، بيقدر يغيّر حالة أي مشروع ويبعت ملاحظة

باقي (اختياري للمراحل الجاية):
- رفع صور للبوستات/المشاريع (يحتاج Supabase Storage bucket)
- إشعارات لحظية (Realtime) للرسائل بدل الريفريش
- تطبيق موبايل حقيقي (iOS/Android) — الحالي ويب-أب شغال على الموبايل والديسكتوب من المتصفح مباشرة، وممكن نحوله لـ PWA أو نغلفه بـ Capacitor لاحقًا
