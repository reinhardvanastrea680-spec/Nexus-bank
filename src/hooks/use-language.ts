import { useState, useEffect } from "react";

const STORAGE_KEY = "nexus-user-language";

export type LanguageCode = "en"|"fr"|"es"|"de"|"pt"|"it"|"nl"|"ru"|"tr"|"hi"|"ar"|"zh"|"ja"|"ko"|"sw";

export interface Language {
  code: LanguageCode;
  nameEn: string;
  nameNative: string;
  dir?: "rtl"|"ltr";
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", nameEn: "English",              nameNative: "English"    },
  { code: "fr", nameEn: "French",               nameNative: "Français"   },
  { code: "es", nameEn: "Spanish",              nameNative: "Español"    },
  { code: "de", nameEn: "German",               nameNative: "Deutsch"    },
  { code: "pt", nameEn: "Portuguese",           nameNative: "Português"  },
  { code: "it", nameEn: "Italian",              nameNative: "Italiano"   },
  { code: "nl", nameEn: "Dutch",                nameNative: "Nederlands" },
  { code: "ru", nameEn: "Russian",              nameNative: "Русский"    },
  { code: "tr", nameEn: "Turkish",              nameNative: "Türkçe"     },
  { code: "hi", nameEn: "Hindi",                nameNative: "हिन्दी"     },
  { code: "ar", nameEn: "Arabic",               nameNative: "العربية", dir: "rtl" },
  { code: "zh", nameEn: "Chinese (Simplified)", nameNative: "简体中文"   },
  { code: "ja", nameEn: "Japanese",             nameNative: "日本語"     },
  { code: "ko", nameEn: "Korean",               nameNative: "한국어"     },
  { code: "sw", nameEn: "Swahili",              nameNative: "Kiswahili"  },
];

export type TranslationKey =
  "Welcome back"|"Hi,"|"Total balance"|"Quick Links"|"Customise"|"Settings"|
  "Notifications"|"Home"|"Transactions"|"Support"|"Transfer"|"Local Transfer"|
  "Wire Transfer"|"Internal Transfer"|"Pay Bills"|"Buy Crypto"|"Add Beneficiary"|
  "Check Deposit"|"Crypto Deposit"|"Transaction History"|"Card Deposit"|"Cards"|
  "Cancel"|"Continue"|"Confirm"|"Back"|"Send"|"Amount"|"Note"|"Account"|
  "Activity"|"Profile"|"Top Up"|"Recent Transactions"|"View All"|
  "Total Balance"|"Available Funds"|"Account Status"|
  "All"|"Unread"|"Mark all read"|"No notifications yet"|
  "Transaction History"|"Filter"|"Credits Only"|"Debits Only"|
  "All Accounts"|"Checking"|"Savings"|"No transactions found"|
  "Loading"|"Pending"|"Completed"|"Failed"|"Approved"|"Cancelled"|
  "Language"|"Select Language"|"Theme"|"Dark"|"Light"|
  "Sign Out"|"Security"|"Privacy"|"Preferences"|"Linked Accounts"|
  "Change Password"|"Contact Support"|"Close"|"Transaction Failed"|
  "Transaction Declined"|"Beneficiary Approved"|"Balance Updated";

type Translations = Record<TranslationKey, string>;

const EN: Translations = {
  "Welcome back":"Welcome back","Hi,":"Hi,","Total balance":"Total balance",
  "Quick Links":"Quick Links","Customise":"Customise","Settings":"Settings",
  "Notifications":"Notifications","Home":"Home","Transactions":"Transactions",
  "Support":"Support","Transfer":"Transfer","Local Transfer":"Local Transfer",
  "Wire Transfer":"Wire Transfer","Internal Transfer":"Internal Transfer",
  "Pay Bills":"Pay Bills","Buy Crypto":"Buy Crypto","Add Beneficiary":"Add Beneficiary",
  "Check Deposit":"Check Deposit","Crypto Deposit":"Crypto Deposit",
  "Transaction History":"Transaction History","Card Deposit":"Card Deposit",
  "Cards":"Cards","Cancel":"Cancel","Continue":"Continue","Confirm":"Confirm",
  "Back":"Back","Send":"Send","Amount":"Amount","Note":"Note","Account":"Account",
  "Activity":"Activity","Profile":"Profile","Top Up":"Top Up",
  "Recent Transactions":"Recent Transactions","View All":"View All",
  "Total Balance":"Total Balance","Available Funds":"Available Funds",
  "Account Status":"Account Status","All":"All","Unread":"Unread",
  "Mark all read":"Mark all read","No notifications yet":"No notifications yet",
  "Filter":"Filter","Credits Only":"Credits Only","Debits Only":"Debits Only",
  "All Accounts":"All Accounts","Checking":"Checking","Savings":"Savings",
  "No transactions found":"No transactions found","Loading":"Loading",
  "Pending":"Pending","Completed":"Completed","Failed":"Failed",
  "Approved":"Approved","Cancelled":"Cancelled","Language":"Language",
  "Select Language":"Select Language","Theme":"Theme","Dark":"Dark","Light":"Light",
  "Sign Out":"Sign Out","Security":"Security","Privacy":"Privacy",
  "Preferences":"Preferences","Linked Accounts":"Linked Accounts",
  "Change Password":"Change Password","Contact Support":"Contact Support",
  "Close":"Close","Transaction Failed":"Transaction Failed",
  "Transaction Declined":"Transaction Declined",
  "Beneficiary Approved":"Beneficiary Approved","Balance Updated":"Balance Updated",
  "Enable Notifications":"Enable Notifications",
  "Email Alerts":"Email Alerts",
  "Push Alerts":"Push Alerts",
  "Two-Factor Authentication":"Two-Factor Authentication",
  "Biometric Login":"Biometric Login",
  "Login Activity":"Login Activity",
  "Privacy Controls":"Privacy Controls",
  "External Bank Accounts":"External Bank Accounts",
  "Connected Cards":"Connected Cards",
  "Personal Information":"Personal Information",
  "Region":"Region",
  "United States":"United States",
};

const FR: Translations = {
  "Welcome back":"Bienvenue","Hi,":"Bonjour,","Total balance":"Solde total",
  "Quick Links":"Liens rapides","Customise":"Personnaliser","Settings":"Paramètres",
  "Notifications":"Notifications","Home":"Accueil","Transactions":"Transactions",
  "Support":"Assistance","Transfer":"Virement","Local Transfer":"Virement local",
  "Wire Transfer":"Virement bancaire","Internal Transfer":"Virement interne",
  "Pay Bills":"Payer les factures","Buy Crypto":"Acheter des cryptos",
  "Add Beneficiary":"Ajouter un bénéficiaire","Check Deposit":"Dépôt de chèque",
  "Crypto Deposit":"Dépôt crypto","Transaction History":"Historique des transactions",
  "Card Deposit":"Dépôt par carte","Cards":"Cartes","Cancel":"Annuler",
  "Continue":"Continuer","Confirm":"Confirmer","Back":"Retour","Send":"Envoyer",
  "Amount":"Montant","Note":"Note","Account":"Compte","Activity":"Activité",
  "Profile":"Profil","Top Up":"Recharger","Recent Transactions":"Transactions récentes",
  "View All":"Voir tout","Total Balance":"Solde total","Available Funds":"Fonds disponibles",
  "Account Status":"Statut du compte","All":"Tout","Unread":"Non lu",
  "Mark all read":"Tout marquer comme lu","No notifications yet":"Aucune notification",
  "Filter":"Filtrer","Credits Only":"Crédits uniquement","Debits Only":"Débits uniquement",
  "All Accounts":"Tous les comptes","Checking":"Courant","Savings":"Épargne",
  "No transactions found":"Aucune transaction trouvée","Loading":"Chargement",
  "Pending":"En attente","Completed":"Terminé","Failed":"Échoué",
  "Approved":"Approuvé","Cancelled":"Annulé","Language":"Langue",
  "Select Language":"Choisir la langue","Theme":"Thème","Dark":"Sombre","Light":"Clair",
  "Sign Out":"Se déconnecter","Security":"Sécurité","Privacy":"Confidentialité",
  "Preferences":"Préférences","Linked Accounts":"Comptes liés",
  "Change Password":"Changer le mot de passe","Contact Support":"Contacter le support",
  "Close":"Fermer","Transaction Failed":"Transaction échouée",
  "Transaction Declined":"Transaction refusée",
  "Beneficiary Approved":"Bénéficiaire approuvé","Balance Updated":"Solde mis à jour",
};

const ES: Translations = {
  "Welcome back":"Bienvenido","Hi,":"Hola,","Total balance":"Saldo total",
  "Quick Links":"Accesos rápidos","Customise":"Personalizar","Settings":"Configuración",
  "Notifications":"Notificaciones","Home":"Inicio","Transactions":"Transacciones",
  "Support":"Soporte","Transfer":"Transferencia","Local Transfer":"Transferencia local",
  "Wire Transfer":"Transferencia bancaria","Internal Transfer":"Transferencia interna",
  "Pay Bills":"Pagar facturas","Buy Crypto":"Comprar cripto",
  "Add Beneficiary":"Agregar beneficiario","Check Deposit":"Depósito de cheque",
  "Crypto Deposit":"Depósito cripto","Transaction History":"Historial de transacciones",
  "Card Deposit":"Depósito con tarjeta","Cards":"Tarjetas","Cancel":"Cancelar",
  "Continue":"Continuar","Confirm":"Confirmar","Back":"Atrás","Send":"Enviar",
  "Amount":"Monto","Note":"Nota","Account":"Cuenta","Activity":"Actividad",
  "Profile":"Perfil","Top Up":"Recargar","Recent Transactions":"Transacciones recientes",
  "View All":"Ver todo","Total Balance":"Saldo total","Available Funds":"Fondos disponibles",
  "Account Status":"Estado de la cuenta","All":"Todo","Unread":"No leído",
  "Mark all read":"Marcar todo como leído","No notifications yet":"Sin notificaciones",
  "Filter":"Filtrar","Credits Only":"Solo créditos","Debits Only":"Solo débitos",
  "All Accounts":"Todas las cuentas","Checking":"Corriente","Savings":"Ahorros",
  "No transactions found":"No se encontraron transacciones","Loading":"Cargando",
  "Pending":"Pendiente","Completed":"Completado","Failed":"Fallido",
  "Approved":"Aprobado","Cancelled":"Cancelado","Language":"Idioma",
  "Select Language":"Seleccionar idioma","Theme":"Tema","Dark":"Oscuro","Light":"Claro",
  "Sign Out":"Cerrar sesión","Security":"Seguridad","Privacy":"Privacidad",
  "Preferences":"Preferencias","Linked Accounts":"Cuentas vinculadas",
  "Change Password":"Cambiar contraseña","Contact Support":"Contactar soporte",
  "Close":"Cerrar","Transaction Failed":"Transacción fallida",
  "Transaction Declined":"Transacción rechazada",
  "Beneficiary Approved":"Beneficiario aprobado","Balance Updated":"Saldo actualizado",
};

// German, Portuguese, Italian, Dutch use EN as base with overrides
const DE: Translations = { ...EN,
  "Welcome back":"Willkommen zurück","Hi,":"Hallo,","Total balance":"Gesamtguthaben",
  "Quick Links":"Schnellzugriff","Customise":"Anpassen","Settings":"Einstellungen",
  "Notifications":"Benachrichtigungen","Home":"Startseite","Transactions":"Transaktionen",
  "Support":"Support","Transfer":"Überweisung","Local Transfer":"Lokale Überweisung",
  "Wire Transfer":"Banküberweisung","Internal Transfer":"Interne Überweisung",
  "Pay Bills":"Rechnungen bezahlen","Buy Crypto":"Krypto kaufen",
  "Add Beneficiary":"Empfänger hinzufügen","Check Deposit":"Scheckeinzahlung",
  "Crypto Deposit":"Krypto-Einzahlung","Transaction History":"Transaktionsverlauf",
  "Card Deposit":"Karteneinzahlung","Cards":"Karten","Cancel":"Abbrechen",
  "Continue":"Weiter","Confirm":"Bestätigen","Back":"Zurück","Send":"Senden",
  "Amount":"Betrag","Note":"Notiz","Account":"Konto","Activity":"Aktivität",
  "Profile":"Profil","Top Up":"Aufladen","Recent Transactions":"Letzte Transaktionen",
  "View All":"Alle anzeigen","Total Balance":"Gesamtguthaben",
  "Available Funds":"Verfügbare Mittel","Account Status":"Kontostatus",
  "All":"Alle","Unread":"Ungelesen","Mark all read":"Alle als gelesen markieren",
  "No notifications yet":"Keine Benachrichtigungen","Filter":"Filtern",
  "Credits Only":"Nur Gutschriften","Debits Only":"Nur Abbuchungen",
  "All Accounts":"Alle Konten","Checking":"Girokonto","Savings":"Sparkonto",
  "No transactions found":"Keine Transaktionen gefunden","Loading":"Laden",
  "Pending":"Ausstehend","Completed":"Abgeschlossen","Failed":"Fehlgeschlagen",
  "Approved":"Genehmigt","Cancelled":"Abgebrochen","Language":"Sprache",
  "Select Language":"Sprache auswählen","Theme":"Thema","Dark":"Dunkel","Light":"Hell",
  "Sign Out":"Abmelden","Security":"Sicherheit","Privacy":"Datenschutz",
  "Preferences":"Einstellungen","Linked Accounts":"Verknüpfte Konten",
  "Change Password":"Passwort ändern","Contact Support":"Support kontaktieren",
  "Close":"Schließen","Transaction Failed":"Transaktion fehlgeschlagen",
  "Transaction Declined":"Transaktion abgelehnt",
  "Beneficiary Approved":"Begünstigter genehmigt","Balance Updated":"Kontostand aktualisiert",
};

const PT: Translations = { ...EN,
  "Welcome back":"Bem-vindo de volta","Hi,":"Olá,","Total balance":"Saldo total",
  "Quick Links":"Links rápidos","Customise":"Personalizar","Settings":"Configurações",
  "Notifications":"Notificações","Home":"Início","Transactions":"Transações",
  "Support":"Suporte","Transfer":"Transferência","Local Transfer":"Transferência local",
  "Wire Transfer":"Transferência bancária","Internal Transfer":"Transferência interna",
  "Pay Bills":"Pagar contas","Buy Crypto":"Comprar cripto",
  "Add Beneficiary":"Adicionar beneficiário","Check Deposit":"Depósito de cheque",
  "Crypto Deposit":"Depósito cripto","Transaction History":"Histórico de transações",
  "Card Deposit":"Depósito por cartão","Cards":"Cartões","Cancel":"Cancelar",
  "Continue":"Continuar","Confirm":"Confirmar","Back":"Voltar","Send":"Enviar",
  "Amount":"Valor","Note":"Nota","Account":"Conta","Activity":"Atividade",
  "Profile":"Perfil","Top Up":"Recarregar","Recent Transactions":"Transações recentes",
  "View All":"Ver tudo","Total Balance":"Saldo total","Available Funds":"Fundos disponíveis",
  "Account Status":"Status da conta","All":"Tudo","Unread":"Não lido",
  "Mark all read":"Marcar tudo como lido","No notifications yet":"Sem notificações",
  "Filter":"Filtrar","Credits Only":"Somente créditos","Debits Only":"Somente débitos",
  "All Accounts":"Todas as contas","Checking":"Corrente","Savings":"Poupança",
  "No transactions found":"Nenhuma transação encontrada","Loading":"Carregando",
  "Pending":"Pendente","Completed":"Concluído","Failed":"Falhou",
  "Approved":"Aprovado","Cancelled":"Cancelado","Language":"Idioma",
  "Select Language":"Selecionar idioma","Theme":"Tema","Dark":"Escuro","Light":"Claro",
  "Sign Out":"Sair","Security":"Segurança","Privacy":"Privacidade",
  "Preferences":"Preferências","Linked Accounts":"Contas vinculadas",
  "Change Password":"Alterar senha","Contact Support":"Contatar suporte",
  "Close":"Fechar","Transaction Failed":"Transação falhou",
  "Transaction Declined":"Transação recusada",
  "Beneficiary Approved":"Beneficiário aprovado","Balance Updated":"Saldo atualizado",
};

const IT: Translations = { ...EN,
  "Welcome back":"Bentornato","Hi,":"Ciao,","Total balance":"Saldo totale",
  "Quick Links":"Link rapidi","Customise":"Personalizza","Settings":"Impostazioni",
  "Notifications":"Notifiche","Home":"Home","Transactions":"Transazioni",
  "Support":"Supporto","Transfer":"Bonifico","Local Transfer":"Bonifico locale",
  "Wire Transfer":"Bonifico bancario","Cards":"Carte","Cancel":"Annulla",
  "Continue":"Continua","Confirm":"Conferma","Back":"Indietro","Send":"Invia",
  "Amount":"Importo","Note":"Nota","Account":"Conto","Activity":"Attività",
  "Profile":"Profilo","Recent Transactions":"Transazioni recenti",
  "View All":"Vedi tutto","Total Balance":"Saldo totale","Available Funds":"Fondi disponibili",
  "Account Status":"Stato del conto","All":"Tutto","Unread":"Non letto",
  "Mark all read":"Segna tutto come letto","No notifications yet":"Nessuna notifica",
  "Filter":"Filtra","Loading":"Caricamento","Pending":"In attesa",
  "Completed":"Completato","Failed":"Fallito","Approved":"Approvato",
  "Language":"Lingua","Select Language":"Seleziona lingua",
  "Theme":"Tema","Dark":"Scuro","Light":"Chiaro","Sign Out":"Esci",
  "Change Password":"Cambia password","Contact Support":"Contatta supporto","Close":"Chiudi",
  "Transaction Failed":"Transazione fallita","Transaction Declined":"Transazione rifiutata",
  "Beneficiary Approved":"Beneficiario approvato","Balance Updated":"Saldo aggiornato",
};

const NL: Translations = { ...EN,
  "Welcome back":"Welkom terug","Hi,":"Hallo,","Total balance":"Totaal saldo",
  "Quick Links":"Snelkoppelingen","Settings":"Instellingen","Notifications":"Meldingen",
  "Home":"Startpagina","Transactions":"Transacties","Support":"Ondersteuning",
  "Transfer":"Overschrijving","Cards":"Kaarten","Cancel":"Annuleren",
  "Continue":"Doorgaan","Confirm":"Bevestigen","Back":"Terug","Send":"Versturen",
  "Amount":"Bedrag","Account":"Rekening","Activity":"Activiteit","Profile":"Profiel",
  "Recent Transactions":"Recente transacties","View All":"Alles bekijken",
  "Total Balance":"Totaal saldo","All":"Alles","Unread":"Ongelezen",
  "Loading":"Laden","Pending":"In behandeling","Completed":"Voltooid","Failed":"Mislukt",
  "Language":"Taal","Select Language":"Taal selecteren","Theme":"Thema",
  "Dark":"Donker","Light":"Licht","Sign Out":"Uitloggen",
  "Change Password":"Wachtwoord wijzigen","Contact Support":"Contact opnemen","Close":"Sluiten",
  "Transaction Failed":"Transactie mislukt","Transaction Declined":"Transactie geweigerd",
  "Beneficiary Approved":"Begunstigde goedgekeurd","Balance Updated":"Saldo bijgewerkt",
};

const RU: Translations = { ...EN,
  "Welcome back":"С возвращением","Hi,":"Привет,","Total balance":"Общий баланс",
  "Quick Links":"Быстрые ссылки","Settings":"Настройки","Notifications":"Уведомления",
  "Home":"Главная","Transactions":"Транзакции","Support":"Поддержка",
  "Transfer":"Перевод","Cards":"Карты","Cancel":"Отмена",
  "Continue":"Продолжить","Confirm":"Подтвердить","Back":"Назад","Send":"Отправить",
  "Amount":"Сумма","Account":"Счёт","Activity":"Активность","Profile":"Профиль",
  "Recent Transactions":"Последние операции","View All":"Смотреть все",
  "Total Balance":"Общий баланс","All":"Все","Unread":"Непрочитанное",
  "Loading":"Загрузка","Pending":"В ожидании","Completed":"Выполнено","Failed":"Ошибка",
  "Language":"Язык","Select Language":"Выбрать язык","Theme":"Тема",
  "Dark":"Тёмная","Light":"Светлая","Sign Out":"Выйти",
  "Change Password":"Изменить пароль","Contact Support":"Связаться с поддержкой","Close":"Закрыть",
  "Transaction Failed":"Транзакция не выполнена","Transaction Declined":"Транзакция отклонена",
  "Beneficiary Approved":"Получатель одобрен","Balance Updated":"Баланс обновлён",
};

const TR: Translations = { ...EN,
  "Welcome back":"Tekrar hoşgeldiniz","Hi,":"Merhaba,","Total balance":"Toplam bakiye",
  "Settings":"Ayarlar","Notifications":"Bildirimler","Home":"Anasayfa",
  "Transactions":"İşlemler","Support":"Destek","Transfer":"Havale","Cards":"Kartlar",
  "Cancel":"İptal","Continue":"Devam","Confirm":"Onayla","Back":"Geri","Send":"Gönder",
  "Amount":"Tutar","Account":"Hesap","Activity":"Aktivite","Profile":"Profil",
  "Recent Transactions":"Son İşlemler","View All":"Tümünü Gör",
  "Total Balance":"Toplam Bakiye","All":"Tümü","Unread":"Okunmamış",
  "Loading":"Yükleniyor","Pending":"Bekliyor","Completed":"Tamamlandı","Failed":"Başarısız",
  "Language":"Dil","Select Language":"Dil seç","Theme":"Tema",
  "Dark":"Koyu","Light":"Açık","Sign Out":"Çıkış Yap",
  "Change Password":"Şifre değiştir","Contact Support":"Destek ile iletişim","Close":"Kapat",
  "Transaction Failed":"İşlem başarısız","Transaction Declined":"İşlem reddedildi",
  "Beneficiary Approved":"Alıcı onaylandı","Balance Updated":"Bakiye güncellendi",
};

const HI: Translations = { ...EN,
  "Welcome back":"वापसी पर स्वागत है","Hi,":"नमस्ते,","Total balance":"कुल शेष",
  "Settings":"सेटिंग्स","Notifications":"सूचनाएं","Home":"होम",
  "Transactions":"लेन-देन","Support":"सहायता","Transfer":"ट्रांसफर","Cards":"कार्ड",
  "Cancel":"रद्द करें","Continue":"जारी रखें","Confirm":"पुष्टि करें","Back":"वापस","Send":"भेजें",
  "Amount":"राशि","Account":"खाता","Activity":"गतिविधि","Profile":"प्रोफाइल",
  "Recent Transactions":"हालिया लेन-देन","View All":"सभी देखें",
  "Total Balance":"कुल शेष","All":"सभी","Unread":"अपठित",
  "Loading":"लोड हो रहा है","Pending":"लंबित","Completed":"पूर्ण","Failed":"विफल",
  "Language":"भाषा","Select Language":"भाषा चुनें","Theme":"थीम",
  "Dark":"डार्क","Light":"लाइट","Sign Out":"साइन आउट",
  "Change Password":"पासवर्ड बदलें","Contact Support":"सहायता से संपर्क करें","Close":"बंद करें",
  "Transaction Failed":"लेन-देन विफल","Transaction Declined":"लेन-देन अस्वीकृत",
  "Beneficiary Approved":"लाभार्थी स्वीकृत","Balance Updated":"शेष अपडेट किया",
};

const AR: Translations = { ...EN,
  "Welcome back":"مرحباً بعودتك","Hi,":"مرحباً،","Total balance":"الرصيد الإجمالي",
  "Quick Links":"روابط سريعة","Customise":"تخصيص","Settings":"الإعدادات",
  "Notifications":"الإشعارات","Home":"الرئيسية","Transactions":"المعاملات",
  "Support":"الدعم","Transfer":"تحويل","Local Transfer":"تحويل محلي",
  "Wire Transfer":"حوالة بنكية","Internal Transfer":"تحويل داخلي",
  "Pay Bills":"دفع الفواتير","Buy Crypto":"شراء عملات رقمية",
  "Add Beneficiary":"إضافة مستفيد","Check Deposit":"إيداع شيك",
  "Crypto Deposit":"إيداع رقمي","Transaction History":"سجل المعاملات",
  "Card Deposit":"إيداع بالبطاقة","Cards":"البطاقات","Cancel":"إلغاء",
  "Continue":"متابعة","Confirm":"تأكيد","Back":"رجوع","Send":"إرسال",
  "Amount":"المبلغ","Note":"ملاحظة","Account":"الحساب","Activity":"النشاط",
  "Profile":"الملف الشخصي","Top Up":"إضافة رصيد",
  "Recent Transactions":"المعاملات الأخيرة","View All":"عرض الكل",
  "Total Balance":"الرصيد الإجمالي","Available Funds":"الأموال المتاحة",
  "Account Status":"حالة الحساب","All":"الكل","Unread":"غير مقروء",
  "Mark all read":"تعيين الكل كمقروء","No notifications yet":"لا توجد إشعارات",
  "Filter":"تصفية","Credits Only":"الإيداعات فقط","Debits Only":"السحوبات فقط",
  "All Accounts":"جميع الحسابات","Checking":"الجاري","Savings":"الادخار",
  "No transactions found":"لا توجد معاملات","Loading":"جارٍ التحميل",
  "Pending":"قيد الانتظار","Completed":"مكتمل","Failed":"فشل",
  "Approved":"موافق عليه","Cancelled":"ملغى","Language":"اللغة",
  "Select Language":"اختر اللغة","Theme":"المظهر","Dark":"داكن","Light":"فاتح",
  "Sign Out":"تسجيل الخروج","Security":"الأمان","Privacy":"الخصوصية",
  "Preferences":"التفضيلات","Linked Accounts":"الحسابات المرتبطة",
  "Change Password":"تغيير كلمة المرور","Contact Support":"التواصل مع الدعم",
  "Close":"إغلاق","Transaction Failed":"فشلت المعاملة",
  "Transaction Declined":"رُفضت المعاملة",
  "Beneficiary Approved":"تمت الموافقة على المستفيد","Balance Updated":"تم تحديث الرصيد",
};

const ZH: Translations = { ...EN,
  "Welcome back":"欢迎回来","Hi,":"你好，","Total balance":"总余额",
  "Quick Links":"快速链接","Customise":"自定义","Settings":"设置",
  "Notifications":"通知","Home":"首页","Transactions":"交易记录",
  "Support":"客服支持","Transfer":"转账","Local Transfer":"本地转账",
  "Wire Transfer":"电汇","Internal Transfer":"内部转账",
  "Pay Bills":"缴费","Buy Crypto":"购买加密货币",
  "Add Beneficiary":"添加收款人","Check Deposit":"支票存款",
  "Crypto Deposit":"加密货币存款","Transaction History":"交易历史",
  "Card Deposit":"银行卡存款","Cards":"银行卡","Cancel":"取消",
  "Continue":"继续","Confirm":"确认","Back":"返回","Send":"发送",
  "Amount":"金额","Note":"备注","Account":"账户","Activity":"活动",
  "Profile":"个人资料","Top Up":"充值","Recent Transactions":"近期交易",
  "View All":"查看全部","Total Balance":"总余额","Available Funds":"可用资金",
  "Account Status":"账户状态","All":"全部","Unread":"未读",
  "Mark all read":"全部标为已读","No notifications yet":"暂无通知",
  "Filter":"筛选","Credits Only":"仅入账","Debits Only":"仅出账",
  "All Accounts":"所有账户","Checking":"活期","Savings":"储蓄",
  "No transactions found":"未找到交易","Loading":"加载中",
  "Pending":"待处理","Completed":"已完成","Failed":"失败",
  "Approved":"已批准","Cancelled":"已取消","Language":"语言",
  "Select Language":"选择语言","Theme":"主题","Dark":"深色","Light":"浅色",
  "Sign Out":"退出登录","Security":"安全","Privacy":"隐私",
  "Preferences":"偏好设置","Linked Accounts":"关联账户",
  "Change Password":"修改密码","Contact Support":"联系客服",
  "Close":"关闭","Transaction Failed":"交易失败",
  "Transaction Declined":"交易被拒绝",
  "Beneficiary Approved":"收款人已批准","Balance Updated":"余额已更新",
};

const JA: Translations = { ...EN,
  "Welcome back":"おかえりなさい","Hi,":"こんにちは、","Total balance":"合計残高",
  "Settings":"設定","Notifications":"通知","Home":"ホーム",
  "Transactions":"取引","Support":"サポート","Transfer":"振込","Cards":"カード",
  "Cancel":"キャンセル","Continue":"続ける","Confirm":"確認","Back":"戻る","Send":"送る",
  "Amount":"金額","Account":"口座","Activity":"活動","Profile":"プロフィール",
  "Recent Transactions":"最近の取引","View All":"すべて見る",
  "Total Balance":"合計残高","All":"すべて","Unread":"未読",
  "Loading":"読み込み中","Pending":"保留中","Completed":"完了","Failed":"失敗",
  "Language":"言語","Select Language":"言語を選択","Theme":"テーマ",
  "Dark":"ダーク","Light":"ライト","Sign Out":"サインアウト",
  "Change Password":"パスワード変更","Contact Support":"サポートに連絡","Close":"閉じる",
  "Transaction Failed":"取引失敗","Transaction Declined":"取引拒否",
  "Beneficiary Approved":"受取人承認済","Balance Updated":"残高更新済",
};

const KO: Translations = { ...EN,
  "Welcome back":"다시 오셨군요","Hi,":"안녕하세요,","Total balance":"총 잔액",
  "Settings":"설정","Notifications":"알림","Home":"홈",
  "Transactions":"거래","Support":"지원","Transfer":"이체","Cards":"카드",
  "Cancel":"취소","Continue":"계속","Confirm":"확인","Back":"뒤로","Send":"보내기",
  "Amount":"금액","Account":"계좌","Activity":"활동","Profile":"프로필",
  "Recent Transactions":"최근 거래","View All":"전체 보기",
  "Total Balance":"총 잔액","All":"전체","Unread":"읽지 않음",
  "Loading":"로딩 중","Pending":"대기 중","Completed":"완료","Failed":"실패",
  "Language":"언어","Select Language":"언어 선택","Theme":"테마",
  "Dark":"다크","Light":"라이트","Sign Out":"로그아웃",
  "Change Password":"비밀번호 변경","Contact Support":"고객센터 문의","Close":"닫기",
  "Transaction Failed":"거래 실패","Transaction Declined":"거래 거부",
  "Beneficiary Approved":"수취인 승인됨","Balance Updated":"잔액 업데이트됨",
};

const SW: Translations = { ...EN,
  "Welcome back":"Karibu tena","Hi,":"Habari,","Total balance":"Jumla ya salio",
  "Settings":"Mipangilio","Notifications":"Arifa","Home":"Nyumbani",
  "Transactions":"Miamala","Support":"Msaada","Transfer":"Uhamisho","Cards":"Kadi",
  "Cancel":"Ghairi","Continue":"Endelea","Confirm":"Thibitisha","Back":"Rudi","Send":"Tuma",
  "Amount":"Kiasi","Account":"Akaunti","Activity":"Shughuli","Profile":"Wasifu",
  "Recent Transactions":"Miamala ya Hivi Karibuni","View All":"Tazama Yote",
  "Total Balance":"Jumla ya Salio","All":"Yote","Unread":"Ambayo Haijasomwa",
  "Loading":"Inapakia","Pending":"Inasubiri","Completed":"Imekamilika","Failed":"Imeshindwa",
  "Language":"Lugha","Select Language":"Chagua lugha","Theme":"Mandhari",
  "Dark":"Giza","Light":"Mwanga","Sign Out":"Toka",
  "Change Password":"Badilisha Nenosiri","Contact Support":"Wasiliana na Msaada","Close":"Funga",
  "Transaction Failed":"Muamala Umeshindwa","Transaction Declined":"Muamala Umekataliwa",
  "Beneficiary Approved":"Mnufaika Ameidhinishwa","Balance Updated":"Salio Limesasishwa",
};

export const translations: Record<LanguageCode, Translations> = {
  en: EN, fr: FR, es: ES, de: DE, pt: PT, it: IT,
  nl: NL, ru: RU, tr: TR, hi: HI, ar: AR, zh: ZH, ja: JA, ko: KO, sw: SW,
};

export function useLanguage() {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) return stored;
    } catch {}
    return "en";
  });

  // Listen for language changes from other components/tabs
  useEffect(() => {
    const handler = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
        if (stored && stored !== language) setLanguageState(stored as LanguageCode);
      } catch {}
    };
    window.addEventListener("nexus-language-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("nexus-language-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, [language]);

  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
      // Broadcast to all other hook instances on the same page
      window.dispatchEvent(new CustomEvent("nexus-language-change", { detail: code }));
    } catch {}
  };

  const t = (key: TranslationKey): string =>
    translations[language]?.[key] ?? translations.en[key] ?? key;

  const currentLanguage = SUPPORTED_LANGUAGES.find((l) => l.code === language)!;

  return { language, setLanguage, t, currentLanguage, supportedLanguages: SUPPORTED_LANGUAGES };
}
