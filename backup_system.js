// نظام النسخ الاحتياطي وإدارة البيانات المتقدم
// Friends Trip Organizer - Advanced Backup System

class BackupManager {
    constructor() {
        this.backupInterval = null;
        this.autoBackupEnabled = true;
        this.maxBackups = 10;
        this.backupFrequency = 5 * 60 * 1000; // 5 دقائق
    }

    // بدء النسخ الاحتياطي التلقائي
    startAutoBackup() {
        if (this.backupInterval) {
            clearInterval(this.backupInterval);
        }

        this.backupInterval = setInterval(() => {
            if (this.autoBackupEnabled && currentTripId) {
                this.createBackup();
            }
        }, this.backupFrequency);

        console.log('تم تفعيل النسخ الاحتياطي التلقائي');
    }

    // إيقاف النسخ الاحتياطي التلقائي
    stopAutoBackup() {
        if (this.backupInterval) {
            clearInterval(this.backupInterval);
            this.backupInterval = null;
        }
        console.log('تم إيقاف النسخ الاحتياطي التلقائي');
    }

    // إنشاء نسخة احتياطية
    async createBackup() {
        if (!currentTripId || !tripData) {
            console.warn('لا توجد بيانات للنسخ الاحتياطي');
            return false;
        }

        try {
            const timestamp = new Date().toISOString();
            const backupData = {
                tripId: currentTripId,
                tripName: currentTripName,
                data: tripData,
                timestamp: timestamp,
                version: '1.0',
                userId: currentUser ? currentUser.uid : 'anonymous',
                userEmail: currentUser ? currentUser.email : null
            };

            // حفظ النسخة الاحتياطية محلياً
            const backupKey = `backup_${currentTripId}_${Date.now()}`;
            localStorage.setItem(backupKey, JSON.stringify(backupData));

            // حفظ قائمة النسخ الاحتياطية
            this.updateBackupList(backupKey, backupData);

            // تنظيف النسخ القديمة
            this.cleanOldBackups();

            console.log('تم إنشاء نسخة احتياطية:', backupKey);
            return true;
        } catch (error) {
            console.error('خطأ في إنشاء النسخة الاحتياطية:', error);
            return false;
        }
    }

    // تحديث قائمة النسخ الاحتياطية
    updateBackupList(backupKey, backupData) {
        try {
            let backupList = JSON.parse(localStorage.getItem('backupList') || '[]');
            
            backupList.push({
                key: backupKey,
                tripId: backupData.tripId,
                tripName: backupData.tripName,
                timestamp: backupData.timestamp,
                itemCount: backupData.data.length
            });

            // ترتيب حسب التاريخ (الأحدث أولاً)
            backupList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            localStorage.setItem('backupList', JSON.stringify(backupList));
        } catch (error) {
            console.error('خطأ في تحديث قائمة النسخ الاحتياطية:', error);
        }
    }

    // تنظيف النسخ القديمة
    cleanOldBackups() {
        try {
            let backupList = JSON.parse(localStorage.getItem('backupList') || '[]');
            
            if (backupList.length > this.maxBackups) {
                // حذف النسخ الزائدة
                const toDelete = backupList.slice(this.maxBackups);
                
                toDelete.forEach(backup => {
                    localStorage.removeItem(backup.key);
                });

                // تحديث القائمة
                backupList = backupList.slice(0, this.maxBackups);
                localStorage.setItem('backupList', JSON.stringify(backupList));

                console.log(`تم حذف ${toDelete.length} نسخة احتياطية قديمة`);
            }
        } catch (error) {
            console.error('خطأ في تنظيف النسخ القديمة:', error);
        }
    }

    // استرداد نسخة احتياطية
    async restoreBackup(backupKey) {
        try {
            const backupData = localStorage.getItem(backupKey);
            if (!backupData) {
                throw new Error('النسخة الاحتياطية غير موجودة');
            }

            const backup = JSON.parse(backupData);
            
            // استرداد البيانات
            currentTripId = backup.tripId;
            currentTripName = backup.tripName;
            tripData = backup.data || [];

            // تحديث التخزين المحلي
            localStorage.setItem('currentTripId', currentTripId);
            localStorage.setItem('currentTripName', currentTripName);
            localStorage.setItem('tripData_' + currentTripId, JSON.stringify(tripData));

            // تحديث الواجهة
            updateTripInfo();
            renderTable();
            updateStats();

            console.log('تم استرداد النسخة الاحتياطية بنجاح');
            return true;
        } catch (error) {
            console.error('خطأ في استرداد النسخة الاحتياطية:', error);
            return false;
        }
    }

    // الحصول على قائمة النسخ الاحتياطية
    getBackupList() {
        try {
            return JSON.parse(localStorage.getItem('backupList') || '[]');
        } catch (error) {
            console.error('خطأ في قراءة قائمة النسخ الاحتياطية:', error);
            return [];
        }
    }

    // حذف نسخة احتياطية
    deleteBackup(backupKey) {
        try {
            localStorage.removeItem(backupKey);
            
            let backupList = this.getBackupList();
            backupList = backupList.filter(backup => backup.key !== backupKey);
            localStorage.setItem('backupList', JSON.stringify(backupList));

            console.log('تم حذف النسخة الاحتياطية:', backupKey);
            return true;
        } catch (error) {
            console.error('خطأ في حذف النسخة الاحتياطية:', error);
            return false;
        }
    }

    // تصدير جميع البيانات
    exportAllData() {
        try {
            const allData = {
                currentTrip: {
                    tripId: currentTripId,
                    tripName: currentTripName,
                    data: tripData
                },
                backups: this.getBackupList().map(backup => {
                    const backupData = localStorage.getItem(backup.key);
                    return backupData ? JSON.parse(backupData) : null;
                }).filter(Boolean),
                exportDate: new Date().toISOString(),
                version: '1.0'
            };

            const dataStr = JSON.stringify(allData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `friends_trip_backup_${new Date().toISOString().split('T')[0]}.json`;
            link.click();

            console.log('تم تصدير جميع البيانات');
            return true;
        } catch (error) {
            console.error('خطأ في تصدير البيانات:', error);
            return false;
        }
    }

    // استيراد البيانات
    async importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    
                    // التحقق من صحة البيانات
                    if (!importedData.version || !importedData.currentTrip) {
                        throw new Error('ملف البيانات غير صحيح');
                    }

                    // استرداد الرحلة الحالية
                    if (importedData.currentTrip.tripId) {
                        currentTripId = importedData.currentTrip.tripId;
                        currentTripName = importedData.currentTrip.tripName;
                        tripData = importedData.currentTrip.data || [];

                        localStorage.setItem('currentTripId', currentTripId);
                        localStorage.setItem('currentTripName', currentTripName);
                        localStorage.setItem('tripData_' + currentTripId, JSON.stringify(tripData));
                    }

                    // استرداد النسخ الاحتياطية
                    if (importedData.backups && Array.isArray(importedData.backups)) {
                        importedData.backups.forEach(backup => {
                            const backupKey = `backup_${backup.tripId}_${Date.now()}_imported`;
                            localStorage.setItem(backupKey, JSON.stringify(backup));
                            this.updateBackupList(backupKey, backup);
                        });
                    }

                    // تحديث الواجهة
                    updateTripInfo();
                    renderTable();
                    updateStats();

                    console.log('تم استيراد البيانات بنجاح');
                    resolve(true);
                } catch (error) {
                    console.error('خطأ في استيراد البيانات:', error);
                    reject(error);
                }
            };

            reader.onerror = () => {
                reject(new Error('خطأ في قراءة الملف'));
            };

            reader.readAsText(file);
        });
    }

    // إحصائيات النسخ الاحتياطية
    getBackupStats() {
        const backupList = this.getBackupList();
        const totalSize = backupList.reduce((size, backup) => {
            const backupData = localStorage.getItem(backup.key);
            return size + (backupData ? backupData.length : 0);
        }, 0);

        return {
            totalBackups: backupList.length,
            totalSize: totalSize,
            oldestBackup: backupList.length > 0 ? backupList[backupList.length - 1].timestamp : null,
            newestBackup: backupList.length > 0 ? backupList[0].timestamp : null
        };
    }
}

// إنشاء مثيل من مدير النسخ الاحتياطي
const backupManager = new BackupManager();

// تصدير للاستخدام العام
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackupManager;
}