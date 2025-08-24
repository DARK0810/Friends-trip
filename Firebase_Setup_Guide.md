# 🔥 دليل إعداد Firebase لمنظم رحلة الأصدقاء

## الخطوة 1: إنشاء مشروع Firebase جديد

### 1.1 الذهاب إلى Firebase Console
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. قم بتسجيل الدخول بحساب Google الخاص بك
3. اضغط على "Create a project" أو "إنشاء مشروع"

### 1.2 تكوين المشروع
1. **اسم المشروع**: ادخل اسم مناسب مثل "Friends Trip Organizer"
2. **معرف المشروع**: سيتم إنشاؤه تلقائياً (يمكنك تعديله)
3. **Google Analytics**: اختر ما إذا كنت تريد تفعيله (اختياري)
4. اضغط "Create project"

## الخطوة 2: تكوين Firestore Database

### 2.1 إنشاء قاعدة البيانات
1. في لوحة التحكم، اذهب إلى "Build" > "Firestore Database"
2. اضغط "Create database"
3. **وضع الأمان**: اختر "Start in test mode" للبداية
4. **الموقع**: اختر أقرب موقع جغرافي لك
5. اضغط "Done"

### 2.2 تكوين قواعد الأمان الأساسية
في تبويب "Rules"، استخدم هذه القواعد للبداية:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // السماح بالقراءة والكتابة لجميع المستخدمين (للاختبار فقط)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ تحذير**: هذه القواعد للاختبار فقط. ستحتاج لتحديثها لاحقاً لتكون أكثر أماناً.

## الخطوة 3: تكوين Firebase Authentication

### 3.1 تفعيل المصادقة
1. اذهب إلى "Build" > "Authentication"
2. اضغط "Get started"
3. في تبويب "Sign-in method":
   - فعّل "Email/Password"
   - فعّل "Anonymous" (للمستخدمين الضيوف)
   - يمكنك إضافة Google، Facebook، إلخ حسب الحاجة

## الخطوة 4: الحصول على إعدادات المشروع

### 4.1 إضافة تطبيق ويب
1. في صفحة المشروع الرئيسية، اضغط على أيقونة "</>"
2. ادخل اسم التطبيق: "Friends Trip Organizer Web"
3. **لا تحتاج** لتفعيل Firebase Hosting الآن
4. اضغط "Register app"

### 4.2 نسخ إعدادات Firebase
ستحصل على كود مشابه لهذا:

```javascript
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

**📋 احفظ هذه المعلومات** - ستحتاجها في الخطوة التالية!

## الخطوة 5: تحديث ملف HTML

الآن ستحتاج لاستبدال المفاتيح الوهمية في ملف `Friends_Trip_Organizer.html` بالمفاتيح الحقيقية.

### ابحث عن هذا القسم في الملف:
```javascript
// إعدادات Firebase (يجب استبدالها بإعداداتك الحقيقية)
const firebaseConfig = {
    apiKey: "your-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    // ... باقي الإعدادات
};
```

### واستبدله بالإعدادات الحقيقية من Firebase Console.

## الخطوة 6: اختبار الاتصال

1. احفظ الملف بعد التحديث
2. افتح `Friends_Trip_Organizer.html` في المتصفح
3. افتح Developer Tools (F12)
4. تحقق من عدم وجود أخطاء في Console
5. جرب إنشاء رحلة جديدة

## الخطوة 7: تحسين قواعد الأمان (مهم!)

بعد التأكد من عمل كل شيء، حدّث قواعد Firestore لتكون أكثر أماناً:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // السماح بالوصول للرحلات فقط
    match /trips/{tripId} {
      allow read, write: if true;
    }
    
    // منع الوصول لأي مجموعات أخرى
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## نصائح مهمة:

1. **احتفظ بنسخة احتياطية** من مفاتيح Firebase في مكان آمن
2. **لا تشارك** مفاتيح API مع أي شخص
3. **راقب الاستخدام** في Firebase Console لتجنب تجاوز الحدود المجانية
4. **حدّث قواعد الأمان** بانتظام حسب احتياجاتك

## استكشاف الأخطاء:

- **خطأ في الاتصال**: تأكد من صحة مفاتيح API
- **خطأ في الأذونات**: تحقق من قواعد Firestore
- **بطء في التحميل**: تأكد من اتصال الإنترنت

---

**🎉 تهانينا!** الآن لديك مشروع Firebase مكتمل وجاهز للاستخدام مع منظم رحلة الأصدقاء!