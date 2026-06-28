import { useState, useEffect } from "react";

const STORAGE_KEY = "nexus-user-language";

export type LanguageCode = "en" | "fr" | "es" | "de" | "pt" | "ar" | "zh";

export interface Language {
  code: LanguageCode;
  nameEn: string;
  nameNative: string;
  dir?: "rtl" | "ltr";
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", nameEn: "English",              nameNative: "English"     },
  { code: "fr", nameEn: "French",               nameNative: "Français"    },
  { code: "es", nameEn: "Spanish",              nameNative: "Español"     },
  { code: "de", nameEn: "German",               nameNative: "Deutsch"     },
  { code: "pt", nameEn: "Portuguese",           nameNative: "Português"   },
  { code: "ar", nameEn: "Arabic",               nameNative: "العربية", dir: "rtl" },
  { code: "zh", nameEn: "Chinese (Simplified)", nameNative: "简体中文"    },
];

type TranslationKey =
  | "Welcome back"
  | "Hi,"
  | "Total balance"
  | "Quick Links"
  | "Customise"
  | "Settings"
  | "Notifications"
  | "Home"
  | "Transactions"
  | "Support"
  | "Transfer"
  | "Local Transfer"
  | "Wire Transfer"
  | "Internal Transfer"
  | "Pay Bills"
  | "Buy Crypto"
  | "Add Beneficiary"
  | "Check Deposit"
  | "Crypto Deposit"
  | "Transaction History"
  | "Card Deposit"
  | "Cards"
  | "Cancel"
  | "Continue"
  | "Confirm"
  | "Back"
  | "Send"
  | "Amount"
  | "Note"
  | "Account"
  | "Activity"
  | "Profile"
  | "Top Up"
  | "Recent Transactions"
  | "View All"
  | "Total Balance"
  | "Available Funds"
  | "Account Status";

type Translations = Record<TranslationKey, string>;

const translations: Record<LanguageCode, Translations> = {
  en: {
    "Welcome back":        "Welcome back",
    "Hi,":                 "Hi,",
    "Total balance":       "Total balance",
    "Quick Links":         "Quick Links",
    "Customise":           "Customise",
    "Settings":            "Settings",
    "Notifications":       "Notifications",
    "Home":                "Home",
    "Transactions":        "Transactions",
    "Support":             "Support",
    "Transfer":            "Transfer",
    "Local Transfer":      "Local Transfer",
    "Wire Transfer":       "Wire Transfer",
    "Internal Transfer":   "Internal Transfer",
    "Pay Bills":           "Pay Bills",
    "Buy Crypto":          "Buy Crypto",
    "Add Beneficiary":     "Add Beneficiary",
    "Check Deposit":       "Check Deposit",
    "Crypto Deposit":      "Crypto Deposit",
    "Transaction History": "Transaction History",
    "Card Deposit":        "Card Deposit",
    "Cancel":              "Cancel",
    "Continue":            "Continue",
    "Confirm":             "Confirm",
    "Back":                "Back",
    "Send":                "Send",
    "Amount":              "Amount",
    "Note":                "Note",
    "Account":             "Account",
    "Cards":               "Cards",
    "Activity":            "Activity",
    "Profile":             "Profile",
    "Top Up":              "Top Up",
    "Recent Transactions": "Recent Transactions",
    "View All":            "View All",
    "Total Balance":       "Total Balance",
    "Available Funds":     "Available Funds",
    "Account Status":      "Account Status",
  },
  fr: {
    "Welcome back":        "Bienvenue",
    "Hi,":                 "Bonjour,",
    "Total balance":       "Solde total",
    "Quick Links":         "Liens rapides",
    "Customise":           "Personnaliser",
    "Settings":            "Paramètres",
    "Notifications":       "Notifications",
    "Home":                "Accueil",
    "Transactions":        "Transactions",
    "Support":             "Assistance",
    "Transfer":            "Virement",
    "Local Transfer":      "Virement local",
    "Wire Transfer":       "Virement bancaire",
    "Internal Transfer":   "Virement interne",
    "Pay Bills":           "Payer les factures",
    "Buy Crypto":          "Acheter des cryptos",
    "Add Beneficiary":     "Ajouter un bénéficiaire",
    "Check Deposit":       "Dépôt de chèque",
    "Crypto Deposit":      "Dépôt crypto",
    "Transaction History": "Historique des transactions",
    "Card Deposit":        "Dépôt par carte",
    "Cancel":              "Annuler",
    "Continue":            "Continuer",
    "Confirm":             "Confirmer",
    "Back":                "Retour",
    "Send":                "Envoyer",
    "Amount":              "Montant",
    "Note":                "Note",
    "Account":             "Compte",
    "Cards":               "Cartes",
    "Activity":            "Activité",
    "Profile":             "Profil",
    "Top Up":              "Recharger",
    "Recent Transactions": "Transactions récentes",
    "View All":            "Voir tout",
    "Total Balance":       "Solde total",
    "Available Funds":     "Fonds disponibles",
    "Account Status":      "Statut du compte",
  },
  es: {
    "Welcome back":        "Bienvenido",
    "Hi,":                 "Hola,",
    "Total balance":       "Saldo total",
    "Quick Links":         "Accesos rápidos",
    "Customise":           "Personalizar",
    "Settings":            "Configuración",
    "Notifications":       "Notificaciones",
    "Home":                "Inicio",
    "Transactions":        "Transacciones",
    "Support":             "Soporte",
    "Transfer":            "Transferencia",
    "Local Transfer":      "Transferencia local",
    "Wire Transfer":       "Transferencia bancaria",
    "Internal Transfer":   "Transferencia interna",
    "Pay Bills":           "Pagar facturas",
    "Buy Crypto":          "Comprar cripto",
    "Add Beneficiary":     "Agregar beneficiario",
    "Check Deposit":       "Depósito de cheque",
    "Crypto Deposit":      "Depósito cripto",
    "Transaction History": "Historial de transacciones",
    "Card Deposit":        "Depósito con tarjeta",
    "Cancel":              "Cancelar",
    "Continue":            "Continuar",
    "Confirm":             "Confirmar",
    "Back":                "Atrás",
    "Send":                "Enviar",
    "Amount":              "Monto",
    "Note":                "Nota",
    "Account":             "Cuenta",
    "Cards":               "Tarjetas",
    "Activity":            "Actividad",
    "Profile":             "Perfil",
    "Top Up":              "Recargar",
    "Recent Transactions": "Transacciones recientes",
    "View All":            "Ver todo",
    "Total Balance":       "Saldo total",
    "Available Funds":     "Fondos disponibles",
    "Account Status":      "Estado de la cuenta",
  },
  de: {
    "Welcome back":        "Willkommen zurück",
    "Hi,":                 "Hallo,",
    "Total balance":       "Gesamtguthaben",
    "Quick Links":         "Schnellzugriff",
    "Customise":           "Anpassen",
    "Settings":            "Einstellungen",
    "Notifications":       "Benachrichtigungen",
    "Home":                "Startseite",
    "Transactions":        "Transaktionen",
    "Support":             "Support",
    "Transfer":            "Überweisung",
    "Local Transfer":      "Lokale Überweisung",
    "Wire Transfer":       "Banküberweisung",
    "Internal Transfer":   "Interne Überweisung",
    "Pay Bills":           "Rechnungen bezahlen",
    "Buy Crypto":          "Krypto kaufen",
    "Add Beneficiary":     "Empfänger hinzufügen",
    "Check Deposit":       "Scheckeinzahlung",
    "Crypto Deposit":      "Krypto-Einzahlung",
    "Transaction History": "Transaktionsverlauf",
    "Card Deposit":        "Karteneinzahlung",
    "Cancel":              "Abbrechen",
    "Continue":            "Weiter",
    "Confirm":             "Bestätigen",
    "Back":                "Zurück",
    "Send":                "Senden",
    "Amount":              "Betrag",
    "Note":                "Notiz",
    "Account":             "Konto",
    "Cards":               "Karten",
    "Activity":            "Aktivität",
    "Profile":             "Profil",
    "Top Up":              "Aufladen",
    "Recent Transactions": "Letzte Transaktionen",
    "View All":            "Alle anzeigen",
    "Total Balance":       "Gesamtguthaben",
    "Available Funds":     "Verfügbare Mittel",
    "Account Status":      "Kontostatus",
  },
  pt: {
    "Welcome back":        "Bem-vindo de volta",
    "Hi,":                 "Olá,",
    "Total balance":       "Saldo total",
    "Quick Links":         "Links rápidos",
    "Customise":           "Personalizar",
    "Settings":            "Configurações",
    "Notifications":       "Notificações",
    "Home":                "Início",
    "Transactions":        "Transações",
    "Support":             "Suporte",
    "Transfer":            "Transferência",
    "Local Transfer":      "Transferência local",
    "Wire Transfer":       "Transferência bancária",
    "Internal Transfer":   "Transferência interna",
    "Pay Bills":           "Pagar contas",
    "Buy Crypto":          "Comprar cripto",
    "Add Beneficiary":     "Adicionar beneficiário",
    "Check Deposit":       "Depósito de cheque",
    "Crypto Deposit":      "Depósito cripto",
    "Transaction History": "Histórico de transações",
    "Card Deposit":        "Depósito por cartão",
    "Cancel":              "Cancelar",
    "Continue":            "Continuar",
    "Confirm":             "Confirmar",
    "Back":                "Voltar",
    "Send":                "Enviar",
    "Amount":              "Valor",
    "Note":                "Nota",
    "Account":             "Conta",
    "Cards":               "Cartões",
    "Activity":            "Atividade",
    "Profile":             "Perfil",
    "Top Up":              "Recarregar",
    "Recent Transactions": "Transações recentes",
    "View All":            "Ver tudo",
    "Total Balance":       "Saldo total",
    "Available Funds":     "Fundos disponíveis",
    "Account Status":      "Status da conta",
  },
  ar: {
    "Welcome back":        "مرحباً بعودتك",
    "Hi,":                 "مرحباً،",
    "Total balance":       "الرصيد الإجمالي",
    "Quick Links":         "روابط سريعة",
    "Customise":           "تخصيص",
    "Settings":            "الإعدادات",
    "Notifications":       "الإشعارات",
    "Home":                "الرئيسية",
    "Transactions":        "المعاملات",
    "Support":             "الدعم",
    "Transfer":            "تحويل",
    "Local Transfer":      "تحويل محلي",
    "Wire Transfer":       "حوالة بنكية",
    "Internal Transfer":   "تحويل داخلي",
    "Pay Bills":           "دفع الفواتير",
    "Buy Crypto":          "شراء عملات رقمية",
    "Add Beneficiary":     "إضافة مستفيد",
    "Check Deposit":       "إيداع شيك",
    "Crypto Deposit":      "إيداع رقمي",
    "Transaction History": "سجل المعاملات",
    "Card Deposit":        "إيداع بالبطاقة",
    "Cancel":              "إلغاء",
    "Continue":            "متابعة",
    "Confirm":             "تأكيد",
    "Back":                "رجوع",
    "Send":                "إرسال",
    "Amount":              "المبلغ",
    "Note":                "ملاحظة",
    "Account":             "الحساب",
    "Cards":               "البطاقات",
    "Activity":            "النشاط",
    "Profile":             "الملف الشخصي",
    "Top Up":              "إضافة رصيد",
    "Recent Transactions": "المعاملات الأخيرة",
    "View All":            "عرض الكل",
    "Total Balance":       "الرصيد الإجمالي",
    "Available Funds":     "الأموال المتاحة",
    "Account Status":      "حالة الحساب",
  },
  zh: {
    "Welcome back":        "欢迎回来",
    "Hi,":                 "你好，",
    "Total balance":       "总余额",
    "Quick Links":         "快速链接",
    "Customise":           "自定义",
    "Settings":            "设置",
    "Notifications":       "通知",
    "Home":                "首页",
    "Transactions":        "交易记录",
    "Support":             "客服支持",
    "Transfer":            "转账",
    "Local Transfer":      "本地转账",
    "Wire Transfer":       "电汇",
    "Internal Transfer":   "内部转账",
    "Pay Bills":           "缴费",
    "Buy Crypto":          "购买加密货币",
    "Add Beneficiary":     "添加收款人",
    "Check Deposit":       "支票存款",
    "Crypto Deposit":      "加密货币存款",
    "Transaction History": "交易历史",
    "Card Deposit":        "银行卡存款",
    "Cancel":              "取消",
    "Continue":            "继续",
    "Confirm":             "确认",
    "Back":                "返回",
    "Send":                "发送",
    "Amount":              "金额",
    "Note":                "备注",
    "Account":             "账户",
    "Cards":               "银行卡",
    "Activity":            "活动",
    "Profile":             "个人资料",
    "Top Up":              "充值",
    "Recent Transactions": "近期交易",
    "View All":            "查看全部",
    "Total Balance":       "总余额",
    "Available Funds":     "可用资金",
    "Account Status":      "账户状态",
  },
};

export function useLanguage() {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) return stored;
    } catch {}
    return "en";
  });

  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {}
  };

  const t = (key: TranslationKey): string => {
    return translations[language]?.[key] ?? translations.en[key] ?? key;
  };

  const currentLanguage = SUPPORTED_LANGUAGES.find((l) => l.code === language)!;

  return { language, setLanguage, t, currentLanguage, supportedLanguages: SUPPORTED_LANGUAGES };
}
