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
  // Navigation & Header
  "Welcome back"|"Hi,"|"Total balance"|"Quick Links"|"Customise"|"Settings"|
  "Notifications"|"Home"|"Transactions"|"Support"|"Transfer"|"Local Transfer"|
  "Wire Transfer"|"Internal Transfer"|"Pay Bills"|"Buy Crypto"|"Add Beneficiary"|
  "Check Deposit"|"Crypto Deposit"|"Transaction History"|"Card Deposit"|"Cards"|
  
  // Common Actions
  "Cancel"|"Continue"|"Confirm"|"Back"|"Send"|"Close"|"Save"|"Edit"|"Delete"|
  "Add"|"Remove"|"Update"|"Create"|"Submit"|"Reset"|"Refresh"|"Search"|
  
  // Form Fields
  "Amount"|"Note"|"Account"|"First Name"|"Last Name"|"Email"|"Recipient"|
  "Bank Name"|"Account Number"|"Routing Number"|"SWIFT Code"|"IBAN"|
  "Description"|"Reference"|"Memo"|"Enter amount"|"Select account"|
  "Select beneficiary"|"Enter description"|"Enter note"|
  
  // Transaction Details
  "Date & Time"|"Status"|"Decline Reason"|"Account Type"|"Transaction Type"|
  "Fee"|"Net Amount"|"Exchange Rate"|"Recipient Name"|
  
  // Account & Profile
  "Activity"|"Profile"|"Top Up"|"Recent Transactions"|"View All"|
  "Total Balance"|"Available Funds"|"Account Status"|"Personal Information"|
  "Region"|"United States"|
  
  // Filters & Views  
  "All"|"Unread"|"Mark all read"|"Filter"|"Credits Only"|"Debits Only"|
  "All Accounts"|"Checking"|"Savings"|
  
  // Status & Notifications
  "Pending"|"Completed"|"Failed"|"Approved"|"Cancelled"|"Processing"|
  "Transaction Failed"|"Transaction Declined"|"Transaction Approved"|
  "Beneficiary Approved"|"Balance Updated"|"No notifications yet"|
  "No transactions found"|"Loading"|"Just now"|
  
  // Settings & Security
  "Language"|"Select Language"|"Theme"|"Dark"|"Light"|"Sign Out"|
  "Security"|"Privacy"|"Preferences"|"Linked Accounts"|"Change Password"|
  "Contact Support"|"Enable Notifications"|"Email Alerts"|"Push Alerts"|
  "Two-Factor Authentication"|"Biometric Login"|"Login Activity"|
  "Privacy Controls"|"External Bank Accounts"|"Connected Cards"|
  
  // Messages & Prompts
  "To update your information, please contact support."|
  "Please log in to view transactions."|"Please enter a valid amount"|
  "Insufficient funds"|"Transaction submitted successfully"|
  "Something went wrong. Please try again."|"Success"|"Error"|
  "Are you sure?"|"This action cannot be undone"|
  
  // Crypto Specific
  "Current Price"|"24h Change"|"You will receive"|"Price per coin"|
  "Network Fee"|"Total Cost"|
  
  // Bills & Transfers  
  "Beneficiary"|"Select Bank"|"Enter recipient details"|"Review transfer"|
  "Transfer from"|"Transfer to"|"Wire details"|"Local bank transfer"|
  "Internal account transfer"|"Bill payment"|"Pay to"|"Bill amount"|
  
  // Card & Deposits
  "Card Number"|"Expiration Date"|"CVV"|"Cardholder Name"|
  "Check front"|"Check back"|"Upload check image"|"Deposit amount"|
  
  // Validation Messages
  "Required"|"Invalid"|"Too short"|"Too long"|"Must be a number"|
  "Must be positive"|"Exceeds balance"|"Minimum amount"|"Maximum amount"|
  
  // Time & Dates
  "Today"|"Yesterday"|"This Week"|"This Month"|"Last Month"|"All Time"|
  
  // Common UI
  "Show more"|"Show less"|"Copy"|"Copied"|"Download"|"Upload"|
  "Next"|"Previous"|"Done"|"Skip"|"Accounts";

type Translations = Record<TranslationKey, string>;

const EN: Translations = {
  // Navigation & Header
  "Welcome back":"Welcome back","Hi,":"Hi,","Total balance":"Total balance",
  "Quick Links":"Quick Links","Customise":"Customise","Settings":"Settings",
  "Notifications":"Notifications","Home":"Home","Transactions":"Transactions",
  "Support":"Support","Transfer":"Transfer","Local Transfer":"Local Transfer",
  "Wire Transfer":"Wire Transfer","Internal Transfer":"Internal Transfer",
  "Pay Bills":"Pay Bills","Buy Crypto":"Buy Crypto","Add Beneficiary":"Add Beneficiary",
  "Check Deposit":"Check Deposit","Crypto Deposit":"Crypto Deposit",
  "Transaction History":"Transaction History","Card Deposit":"Card Deposit","Cards":"Cards",
  
  // Common Actions
  "Cancel":"Cancel","Continue":"Continue","Confirm":"Confirm","Back":"Back","Send":"Send",
  "Close":"Close","Save":"Save","Edit":"Edit","Delete":"Delete","Add":"Add","Remove":"Remove",
  "Update":"Update","Create":"Create","Submit":"Submit","Reset":"Reset","Refresh":"Refresh",
  "Search":"Search",
  
  // Form Fields
  "Amount":"Amount","Note":"Note","Account":"Account","First Name":"First Name",
  "Last Name":"Last Name","Email":"Email","Recipient":"Recipient","Bank Name":"Bank Name",
  "Account Number":"Account Number","Routing Number":"Routing Number","SWIFT Code":"SWIFT Code",
  "IBAN":"IBAN","Description":"Description","Reference":"Reference","Memo":"Memo",
  "Enter amount":"Enter amount","Select account":"Select account",
  "Select beneficiary":"Select beneficiary","Enter description":"Enter description",
  "Enter note":"Enter note",
  
  // Transaction Details
  "Date & Time":"Date & Time","Status":"Status","Decline Reason":"Decline Reason",
  "Account Type":"Account Type","Transaction Type":"Transaction Type","Fee":"Fee",
  "Net Amount":"Net Amount","Exchange Rate":"Exchange Rate","Recipient Name":"Recipient Name",
  
  // Account & Profile
  "Activity":"Activity","Profile":"Profile","Top Up":"Top Up",
  "Recent Transactions":"Recent Transactions","View All":"View All",
  "Total Balance":"Total Balance","Available Funds":"Available Funds",
  "Account Status":"Account Status","Personal Information":"Personal Information",
  "Region":"Region","United States":"United States",
  
  // Filters & Views
  "All":"All","Unread":"Unread","Mark all read":"Mark all read","Filter":"Filter",
  "Credits Only":"Credits Only","Debits Only":"Debits Only",
  "All Accounts":"All Accounts","Checking":"Checking","Savings":"Savings",
  
  // Status & Notifications
  "Pending":"Pending","Completed":"Completed","Failed":"Failed","Approved":"Approved",
  "Cancelled":"Cancelled","Processing":"Processing","Transaction Failed":"Transaction Failed",
  "Transaction Declined":"Transaction Declined","Transaction Approved":"Transaction Approved",
  "Beneficiary Approved":"Beneficiary Approved","Balance Updated":"Balance Updated",
  "No notifications yet":"No notifications yet","No transactions found":"No transactions found",
  "Loading":"Loading","Just now":"Just now",
  
  // Settings & Security
  "Language":"Language","Select Language":"Select Language","Theme":"Theme",
  "Dark":"Dark","Light":"Light","Sign Out":"Sign Out","Security":"Security",
  "Privacy":"Privacy","Preferences":"Preferences","Linked Accounts":"Linked Accounts",
  "Change Password":"Change Password","Contact Support":"Contact Support",
  "Enable Notifications":"Enable Notifications","Email Alerts":"Email Alerts",
  "Push Alerts":"Push Alerts","Two-Factor Authentication":"Two-Factor Authentication",
  "Biometric Login":"Biometric Login","Login Activity":"Login Activity",
  "Privacy Controls":"Privacy Controls","External Bank Accounts":"External Bank Accounts",
  "Connected Cards":"Connected Cards",
  
  // Messages & Prompts
  "To update your information, please contact support.":"To update your information, please contact support.",
  "Please log in to view transactions.":"Please log in to view transactions.",
  "Please enter a valid amount":"Please enter a valid amount",
  "Insufficient funds":"Insufficient funds",
  "Transaction submitted successfully":"Transaction submitted successfully",
  "Something went wrong. Please try again.":"Something went wrong. Please try again.",
  "Success":"Success","Error":"Error","Are you sure?":"Are you sure?",
  "This action cannot be undone":"This action cannot be undone",
  
  // Crypto Specific
  "Current Price":"Current Price","24h Change":"24h Change","You will receive":"You will receive",
  "Price per coin":"Price per coin","Network Fee":"Network Fee","Total Cost":"Total Cost",
  
  // Bills & Transfers
  "Beneficiary":"Beneficiary","Select Bank":"Select Bank",
  "Enter recipient details":"Enter recipient details","Review transfer":"Review transfer",
  "Transfer from":"Transfer from","Transfer to":"Transfer to","Wire details":"Wire details",
  "Local bank transfer":"Local bank transfer","Internal account transfer":"Internal account transfer",
  "Bill payment":"Bill payment","Pay to":"Pay to","Bill amount":"Bill amount",
  
  // Card & Deposits
  "Card Number":"Card Number","Expiration Date":"Expiration Date","CVV":"CVV",
  "Cardholder Name":"Cardholder Name","Check front":"Check front","Check back":"Check back",
  "Upload check image":"Upload check image","Deposit amount":"Deposit amount",
  
  // Validation Messages
  "Required":"Required","Invalid":"Invalid","Too short":"Too short","Too long":"Too long",
  "Must be a number":"Must be a number","Must be positive":"Must be positive",
  "Exceeds balance":"Exceeds balance","Minimum amount":"Minimum amount",
  "Maximum amount":"Maximum amount",
  
  // Time & Dates
  "Today":"Today","Yesterday":"Yesterday","This Week":"This Week","This Month":"This Month",
  "Last Month":"Last Month","All Time":"All Time",
  
  // Common UI
  "Show more":"Show more","Show less":"Show less","Copy":"Copy","Copied":"Copied",
  "Download":"Download","Upload":"Upload","Next":"Next","Previous":"Previous",
  "Done":"Done","Skip":"Skip","Accounts":"Accounts",
};

const FR: Translations = {
  // Navigation & Header
  "Welcome back":"Bienvenue","Hi,":"Bonjour,","Total balance":"Solde total",
  "Quick Links":"Liens rapides","Customise":"Personnaliser","Settings":"Paramètres",
  "Notifications":"Notifications","Home":"Accueil","Transactions":"Transactions",
  "Support":"Assistance","Transfer":"Virement","Local Transfer":"Virement local",
  "Wire Transfer":"Virement bancaire","Internal Transfer":"Virement interne",
  "Pay Bills":"Payer les factures","Buy Crypto":"Acheter des cryptos",
  "Add Beneficiary":"Ajouter un bénéficiaire","Check Deposit":"Dépôt de chèque",
  "Crypto Deposit":"Dépôt crypto","Transaction History":"Historique des transactions",
  "Card Deposit":"Dépôt par carte","Cards":"Cartes",
  
  // Common Actions
  "Cancel":"Annuler","Continue":"Continuer","Confirm":"Confirmer","Back":"Retour",
  "Send":"Envoyer","Close":"Fermer","Save":"Enregistrer","Edit":"Modifier",
  "Delete":"Supprimer","Add":"Ajouter","Remove":"Retirer","Update":"Mettre à jour",
  "Create":"Créer","Submit":"Soumettre","Reset":"Réinitialiser","Refresh":"Actualiser",
  "Search":"Rechercher",
  
  // Form Fields
  "Amount":"Montant","Note":"Note","Account":"Compte","First Name":"Prénom",
  "Last Name":"Nom de famille","Email":"E-mail","Recipient":"Destinataire",
  "Bank Name":"Nom de la banque","Account Number":"Numéro de compte",
  "Routing Number":"Numéro d'acheminement","SWIFT Code":"Code SWIFT","IBAN":"IBAN",
  "Description":"Description","Reference":"Référence","Memo":"Mémo",
  "Enter amount":"Entrez le montant","Select account":"Sélectionner un compte",
  "Select beneficiary":"Sélectionner un bénéficiaire","Enter description":"Entrez une description",
  "Enter note":"Entrez une note",
  
  // Transaction Details
  "Date & Time":"Date et heure","Status":"Statut","Decline Reason":"Raison du refus",
  "Account Type":"Type de compte","Transaction Type":"Type de transaction","Fee":"Frais",
  "Net Amount":"Montant net","Exchange Rate":"Taux de change","Recipient Name":"Nom du destinataire",
  
  // Account & Profile
  "Activity":"Activité","Profile":"Profil","Top Up":"Recharger",
  "Recent Transactions":"Transactions récentes","View All":"Voir tout",
  "Total Balance":"Solde total","Available Funds":"Fonds disponibles",
  "Account Status":"Statut du compte","Personal Information":"Informations personnelles",
  "Region":"Région","United States":"États-Unis",
  
  // Filters & Views
  "All":"Tout","Unread":"Non lu","Mark all read":"Tout marquer comme lu","Filter":"Filtrer",
  "Credits Only":"Crédits uniquement","Debits Only":"Débits uniquement",
  "All Accounts":"Tous les comptes","Checking":"Courant","Savings":"Épargne",
  
  // Status & Notifications
  "Pending":"En attente","Completed":"Terminé","Failed":"Échoué","Approved":"Approuvé",
  "Cancelled":"Annulé","Processing":"En cours","Transaction Failed":"Transaction échouée",
  "Transaction Declined":"Transaction refusée","Transaction Approved":"Transaction approuvée",
  "Beneficiary Approved":"Bénéficiaire approuvé","Balance Updated":"Solde mis à jour",
  "No notifications yet":"Aucune notification","No transactions found":"Aucune transaction trouvée",
  "Loading":"Chargement","Just now":"À l'instant",
  
  // Settings & Security
  "Language":"Langue","Select Language":"Choisir la langue","Theme":"Thème",
  "Dark":"Sombre","Light":"Clair","Sign Out":"Se déconnecter","Security":"Sécurité",
  "Privacy":"Confidentialité","Preferences":"Préférences","Linked Accounts":"Comptes liés",
  "Change Password":"Changer le mot de passe","Contact Support":"Contacter le support",
  "Enable Notifications":"Activer les notifications","Email Alerts":"Alertes e-mail",
  "Push Alerts":"Alertes push","Two-Factor Authentication":"Authentification à deux facteurs",
  "Biometric Login":"Connexion biométrique","Login Activity":"Activité de connexion",
  "Privacy Controls":"Contrôles de confidentialité","External Bank Accounts":"Comptes bancaires externes",
  "Connected Cards":"Cartes connectées",
  
  // Messages & Prompts
  "To update your information, please contact support.":"Pour mettre à jour vos informations, veuillez contacter le support.",
  "Please log in to view transactions.":"Veuillez vous connecter pour voir les transactions.",
  "Please enter a valid amount":"Veuillez entrer un montant valide",
  "Insufficient funds":"Fonds insuffisants",
  "Transaction submitted successfully":"Transaction soumise avec succès",
  "Something went wrong. Please try again.":"Une erreur s'est produite. Veuillez réessayer.",
  "Success":"Succès","Error":"Erreur","Are you sure?":"Êtes-vous sûr?",
  "This action cannot be undone":"Cette action ne peut pas être annulée",
  
  // Crypto Specific
  "Current Price":"Prix actuel","24h Change":"Variation 24h","You will receive":"Vous recevrez",
  "Price per coin":"Prix par pièce","Network Fee":"Frais de réseau","Total Cost":"Coût total",
  
  // Bills & Transfers
  "Beneficiary":"Bénéficiaire","Select Bank":"Sélectionner une banque",
  "Enter recipient details":"Entrez les détails du destinataire","Review transfer":"Vérifier le virement",
  "Transfer from":"Transférer depuis","Transfer to":"Transférer vers","Wire details":"Détails du virement",
  "Local bank transfer":"Virement bancaire local","Internal account transfer":"Virement de compte interne",
  "Bill payment":"Paiement de facture","Pay to":"Payer à","Bill amount":"Montant de la facture",
  
  // Card & Deposits
  "Card Number":"Numéro de carte","Expiration Date":"Date d'expiration","CVV":"CVV",
  "Cardholder Name":"Nom du titulaire","Check front":"Recto du chèque","Check back":"Verso du chèque",
  "Upload check image":"Télécharger l'image du chèque","Deposit amount":"Montant du dépôt",
  
  // Validation Messages
  "Required":"Requis","Invalid":"Invalide","Too short":"Trop court","Too long":"Trop long",
  "Must be a number":"Doit être un nombre","Must be positive":"Doit être positif",
  "Exceeds balance":"Dépasse le solde","Minimum amount":"Montant minimum",
  "Maximum amount":"Montant maximum",
  
  // Time & Dates
  "Today":"Aujourd'hui","Yesterday":"Hier","This Week":"Cette semaine","This Month":"Ce mois-ci",
  "Last Month":"Le mois dernier","All Time":"Tout le temps",
  
  // Common UI
  "Show more":"Afficher plus","Show less":"Afficher moins","Copy":"Copier","Copied":"Copié",
  "Download":"Télécharger","Upload":"Uploader","Next":"Suivant","Previous":"Précédent",
  "Done":"Terminé","Skip":"Passer","Accounts":"Comptes",
};

const ES: Translations = {
  // Navigation & Header
  "Welcome back":"Bienvenido","Hi,":"Hola,","Total balance":"Saldo total",
  "Quick Links":"Accesos rápidos","Customise":"Personalizar","Settings":"Configuración",
  "Notifications":"Notificaciones","Home":"Inicio","Transactions":"Transacciones",
  "Support":"Soporte","Transfer":"Transferencia","Local Transfer":"Transferencia local",
  "Wire Transfer":"Transferencia bancaria","Internal Transfer":"Transferencia interna",
  "Pay Bills":"Pagar facturas","Buy Crypto":"Comprar cripto",
  "Add Beneficiary":"Agregar beneficiario","Check Deposit":"Depósito de cheque",
  "Crypto Deposit":"Depósito cripto","Transaction History":"Historial de transacciones",
  "Card Deposit":"Depósito con tarjeta","Cards":"Tarjetas",
  
  // Common Actions
  "Cancel":"Cancelar","Continue":"Continuar","Confirm":"Confirmar","Back":"Atrás",
  "Send":"Enviar","Close":"Cerrar","Save":"Guardar","Edit":"Editar",
  "Delete":"Eliminar","Add":"Agregar","Remove":"Quitar","Update":"Actualizar",
  "Create":"Crear","Submit":"Enviar","Reset":"Restablecer","Refresh":"Actualizar",
  "Search":"Buscar",
  
  // Form Fields
  "Amount":"Monto","Note":"Nota","Account":"Cuenta","First Name":"Nombre",
  "Last Name":"Apellido","Email":"Correo electrónico","Recipient":"Destinatario",
  "Bank Name":"Nombre del banco","Account Number":"Número de cuenta",
  "Routing Number":"Número de ruta","SWIFT Code":"Código SWIFT","IBAN":"IBAN",
  "Description":"Descripción","Reference":"Referencia","Memo":"Memo",
  "Enter amount":"Ingrese el monto","Select account":"Seleccionar cuenta",
  "Select beneficiary":"Seleccionar beneficiario","Enter description":"Ingrese descripción",
  "Enter note":"Ingrese una nota",
  
  // Transaction Details
  "Date & Time":"Fecha y hora","Status":"Estado","Decline Reason":"Razón del rechazo",
  "Account Type":"Tipo de cuenta","Transaction Type":"Tipo de transacción","Fee":"Tarifa",
  "Net Amount":"Monto neto","Exchange Rate":"Tipo de cambio","Recipient Name":"Nombre del destinatario",
  
  // Account & Profile
  "Activity":"Actividad","Profile":"Perfil","Top Up":"Recargar",
  "Recent Transactions":"Transacciones recientes","View All":"Ver todo",
  "Total Balance":"Saldo total","Available Funds":"Fondos disponibles",
  "Account Status":"Estado de la cuenta","Personal Information":"Información personal",
  "Region":"Región","United States":"Estados Unidos",
  
  // Filters & Views
  "All":"Todo","Unread":"No leído","Mark all read":"Marcar todo como leído","Filter":"Filtrar",
  "Credits Only":"Solo créditos","Debits Only":"Solo débitos",
  "All Accounts":"Todas las cuentas","Checking":"Corriente","Savings":"Ahorros",
  
  // Status & Notifications
  "Pending":"Pendiente","Completed":"Completado","Failed":"Fallido","Approved":"Aprobado",
  "Cancelled":"Cancelado","Processing":"Procesando","Transaction Failed":"Transacción fallida",
  "Transaction Declined":"Transacción rechazada","Transaction Approved":"Transacción aprobada",
  "Beneficiary Approved":"Beneficiario aprobado","Balance Updated":"Saldo actualizado",
  "No notifications yet":"Sin notificaciones","No transactions found":"No se encontraron transacciones",
  "Loading":"Cargando","Just now":"Ahora mismo",
  
  // Settings & Security
  "Language":"Idioma","Select Language":"Seleccionar idioma","Theme":"Tema",
  "Dark":"Oscuro","Light":"Claro","Sign Out":"Cerrar sesión","Security":"Seguridad",
  "Privacy":"Privacidad","Preferences":"Preferencias","Linked Accounts":"Cuentas vinculadas",
  "Change Password":"Cambiar contraseña","Contact Support":"Contactar soporte",
  "Enable Notifications":"Activar notificaciones","Email Alerts":"Alertas de correo",
  "Push Alerts":"Alertas push","Two-Factor Authentication":"Autenticación de dos factores",
  "Biometric Login":"Inicio biométrico","Login Activity":"Actividad de inicio de sesión",
  "Privacy Controls":"Controles de privacidad","External Bank Accounts":"Cuentas bancarias externas",
  "Connected Cards":"Tarjetas conectadas",
  
  // Messages & Prompts
  "To update your information, please contact support.":"Para actualizar su información, contacte con soporte.",
  "Please log in to view transactions.":"Inicie sesión para ver las transacciones.",
  "Please enter a valid amount":"Ingrese un monto válido",
  "Insufficient funds":"Fondos insuficientes",
  "Transaction submitted successfully":"Transacción enviada con éxito",
  "Something went wrong. Please try again.":"Algo salió mal. Inténtalo de nuevo.",
  "Success":"Éxito","Error":"Error","Are you sure?":"¿Estás seguro?",
  "This action cannot be undone":"Esta acción no se puede deshacer",
  
  // Crypto Specific
  "Current Price":"Precio actual","24h Change":"Cambio 24h","You will receive":"Recibirás",
  "Price per coin":"Precio por moneda","Network Fee":"Tarifa de red","Total Cost":"Costo total",
  
  // Bills & Transfers
  "Beneficiary":"Beneficiario","Select Bank":"Seleccionar banco",
  "Enter recipient details":"Ingrese detalles del destinatario","Review transfer":"Revisar transferencia",
  "Transfer from":"Transferir desde","Transfer to":"Transferir a","Wire details":"Detalles de transferencia",
  "Local bank transfer":"Transferencia bancaria local","Internal account transfer":"Transferencia de cuenta interna",
  "Bill payment":"Pago de factura","Pay to":"Pagar a","Bill amount":"Monto de la factura",
  
  // Card & Deposits
  "Card Number":"Número de tarjeta","Expiration Date":"Fecha de vencimiento","CVV":"CVV",
  "Cardholder Name":"Nombre del titular","Check front":"Frente del cheque","Check back":"Reverso del cheque",
  "Upload check image":"Subir imagen del cheque","Deposit amount":"Monto del depósito",
  
  // Validation Messages
  "Required":"Requerido","Invalid":"Inválido","Too short":"Demasiado corto","Too long":"Demasiado largo",
  "Must be a number":"Debe ser un número","Must be positive":"Debe ser positivo",
  "Exceeds balance":"Excede el saldo","Minimum amount":"Monto mínimo",
  "Maximum amount":"Monto máximo",
  
  // Time & Dates
  "Today":"Hoy","Yesterday":"Ayer","This Week":"Esta semana","This Month":"Este mes",
  "Last Month":"El mes pasado","All Time":"Todo el tiempo",
  
  // Common UI
  "Show more":"Mostrar más","Show less":"Mostrar menos","Copy":"Copiar","Copied":"Copiado",
  "Download":"Descargar","Upload":"Subir","Next":"Siguiente","Previous":"Anterior",
  "Done":"Hecho","Skip":"Saltar","Accounts":"Cuentas",
};

const DE: Translations = {
  // Navigation & Header
  "Welcome back":"Willkommen zurück","Hi,":"Hallo,","Total balance":"Gesamtguthaben",
  "Quick Links":"Schnellzugriff","Customise":"Anpassen","Settings":"Einstellungen",
  "Notifications":"Benachrichtigungen","Home":"Startseite","Transactions":"Transaktionen",
  "Support":"Support","Transfer":"Überweisung","Local Transfer":"Lokale Überweisung",
  "Wire Transfer":"Banküberweisung","Internal Transfer":"Interne Überweisung",
  "Pay Bills":"Rechnungen bezahlen","Buy Crypto":"Krypto kaufen",
  "Add Beneficiary":"Empfänger hinzufügen","Check Deposit":"Scheckeinzahlung",
  "Crypto Deposit":"Krypto-Einzahlung","Transaction History":"Transaktionsverlauf",
  "Card Deposit":"Karteneinzahlung","Cards":"Karten",
  
  // Common Actions
  "Cancel":"Abbrechen","Continue":"Weiter","Confirm":"Bestätigen","Back":"Zurück",
  "Send":"Senden","Close":"Schließen","Save":"Speichern","Edit":"Bearbeiten",
  "Delete":"Löschen","Add":"Hinzufügen","Remove":"Entfernen","Update":"Aktualisieren",
  "Create":"Erstellen","Submit":"Einreichen","Reset":"Zurücksetzen","Refresh":"Aktualisieren",
  "Search":"Suchen",
  
  // Form Fields
  "Amount":"Betrag","Note":"Notiz","Account":"Konto","First Name":"Vorname",
  "Last Name":"Nachname","Email":"E-Mail","Recipient":"Empfänger",
  "Bank Name":"Bankname","Account Number":"Kontonummer",
  "Routing Number":"Bankleitzahl","SWIFT Code":"SWIFT-Code","IBAN":"IBAN",
  "Description":"Beschreibung","Reference":"Referenz","Memo":"Memo",
  "Enter amount":"Betrag eingeben","Select account":"Konto auswählen",
  "Select beneficiary":"Empfänger auswählen","Enter description":"Beschreibung eingeben",
  "Enter note":"Notiz eingeben",
  
  // Transaction Details
  "Date & Time":"Datum & Uhrzeit","Status":"Status","Decline Reason":"Ablehnungsgrund",
  "Account Type":"Kontotyp","Transaction Type":"Transaktionstyp","Fee":"Gebühr",
  "Net Amount":"Nettobetrag","Exchange Rate":"Wechselkurs","Recipient Name":"Empfängername",
  
  // Account & Profile
  "Activity":"Aktivität","Profile":"Profil","Top Up":"Aufladen",
  "Recent Transactions":"Letzte Transaktionen","View All":"Alle anzeigen",
  "Total Balance":"Gesamtguthaben","Available Funds":"Verfügbare Mittel",
  "Account Status":"Kontostatus","Personal Information":"Persönliche Informationen",
  "Region":"Region","United States":"Vereinigte Staaten",
  
  // Filters & Views
  "All":"Alle","Unread":"Ungelesen","Mark all read":"Alle als gelesen markieren","Filter":"Filtern",
  "Credits Only":"Nur Gutschriften","Debits Only":"Nur Abbuchungen",
  "All Accounts":"Alle Konten","Checking":"Girokonto","Savings":"Sparkonto",
  
  // Status & Notifications
  "Pending":"Ausstehend","Completed":"Abgeschlossen","Failed":"Fehlgeschlagen","Approved":"Genehmigt",
  "Cancelled":"Abgebrochen","Processing":"Verarbeitung","Transaction Failed":"Transaktion fehlgeschlagen",
  "Transaction Declined":"Transaktion abgelehnt","Transaction Approved":"Transaktion genehmigt",
  "Beneficiary Approved":"Begünstigter genehmigt","Balance Updated":"Kontostand aktualisiert",
  "No notifications yet":"Keine Benachrichtigungen","No transactions found":"Keine Transaktionen gefunden",
  "Loading":"Laden","Just now":"Gerade eben",
  
  // Settings & Security
  "Language":"Sprache","Select Language":"Sprache auswählen","Theme":"Thema",
  "Dark":"Dunkel","Light":"Hell","Sign Out":"Abmelden","Security":"Sicherheit",
  "Privacy":"Datenschutz","Preferences":"Einstellungen","Linked Accounts":"Verknüpfte Konten",
  "Change Password":"Passwort ändern","Contact Support":"Support kontaktieren",
  "Enable Notifications":"Benachrichtigungen aktivieren","Email Alerts":"E-Mail-Benachrichtigungen",
  "Push Alerts":"Push-Benachrichtigungen","Two-Factor Authentication":"Zwei-Faktor-Authentifizierung",
  "Biometric Login":"Biometrische Anmeldung","Login Activity":"Anmeldeaktivität",
  "Privacy Controls":"Datenschutzeinstellungen","External Bank Accounts":"Externe Bankkonten",
  "Connected Cards":"Verbundene Karten",
  
  // Messages & Prompts
  "To update your information, please contact support.":"Um Ihre Informationen zu aktualisieren, kontaktieren Sie bitte den Support.",
  "Please log in to view transactions.":"Bitte melden Sie sich an, um Transaktionen anzuzeigen.",
  "Please enter a valid amount":"Bitte geben Sie einen gültigen Betrag ein",
  "Insufficient funds":"Unzureichende Mittel",
  "Transaction submitted successfully":"Transaktion erfolgreich eingereicht",
  "Something went wrong. Please try again.":"Etwas ist schief gelaufen. Bitte versuchen Sie es erneut.",
  "Success":"Erfolg","Error":"Fehler","Are you sure?":"Sind Sie sicher?",
  "This action cannot be undone":"Diese Aktion kann nicht rückgängig gemacht werden",
  
  // Crypto Specific
  "Current Price":"Aktueller Preis","24h Change":"24h Änderung","You will receive":"Sie erhalten",
  "Price per coin":"Preis pro Münze","Network Fee":"Netzwerkgebühr","Total Cost":"Gesamtkosten",
  
  // Bills & Transfers
  "Beneficiary":"Begünstigter","Select Bank":"Bank auswählen",
  "Enter recipient details":"Empfängerdetails eingeben","Review transfer":"Überweisung überprüfen",
  "Transfer from":"Übertragen von","Transfer to":"Übertragen an","Wire details":"Überweisungsdetails",
  "Local bank transfer":"Lokale Banküberweisung","Internal account transfer":"Interne Kontoüberweisung",
  "Bill payment":"Rechnungszahlung","Pay to":"Zahlen an","Bill amount":"Rechnungsbetrag",
  
  // Card & Deposits
  "Card Number":"Kartennummer","Expiration Date":"Ablaufdatum","CVV":"CVV",
  "Cardholder Name":"Name des Karteninhabers","Check front":"Scheckvorderseite","Check back":"Scheckrückseite",
  "Upload check image":"Scheckbild hochladen","Deposit amount":"Einzahlungsbetrag",
  
  // Validation Messages
  "Required":"Erforderlich","Invalid":"Ungültig","Too short":"Zu kurz","Too long":"Zu lang",
  "Must be a number":"Muss eine Zahl sein","Must be positive":"Muss positiv sein",
  "Exceeds balance":"Überschreitet Guthaben","Minimum amount":"Mindestbetrag",
  "Maximum amount":"Höchstbetrag",
  
  // Time & Dates
  "Today":"Heute","Yesterday":"Gestern","This Week":"Diese Woche","This Month":"Diesen Monat",
  "Last Month":"Letzten Monat","All Time":"Alle Zeit",
  
  // Common UI
  "Show more":"Mehr anzeigen","Show less":"Weniger anzeigen","Copy":"Kopieren","Copied":"Kopiert",
  "Download":"Herunterladen","Upload":"Hochladen","Next":"Weiter","Previous":"Zurück",
  "Done":"Fertig","Skip":"Überspringen","Accounts":"Konten",
};

const PT: Translations = {
  // Navigation & Header
  "Welcome back":"Bem-vindo de volta","Hi,":"Olá,","Total balance":"Saldo total",
  "Quick Links":"Links rápidos","Customise":"Personalizar","Settings":"Configurações",
  "Notifications":"Notificações","Home":"Início","Transactions":"Transações",
  "Support":"Suporte","Transfer":"Transferência","Local Transfer":"Transferência local",
  "Wire Transfer":"Transferência bancária","Internal Transfer":"Transferência interna",
  "Pay Bills":"Pagar contas","Buy Crypto":"Comprar cripto",
  "Add Beneficiary":"Adicionar beneficiário","Check Deposit":"Depósito de cheque",
  "Crypto Deposit":"Depósito cripto","Transaction History":"Histórico de transações",
  "Card Deposit":"Depósito por cartão","Cards":"Cartões",
  
  // Common Actions
  "Cancel":"Cancelar","Continue":"Continuar","Confirm":"Confirmar","Back":"Voltar",
  "Send":"Enviar","Close":"Fechar","Save":"Salvar","Edit":"Editar",
  "Delete":"Excluir","Add":"Adicionar","Remove":"Remover","Update":"Atualizar",
  "Create":"Criar","Submit":"Enviar","Reset":"Redefinir","Refresh":"Atualizar",
  "Search":"Pesquisar",
  
  // Form Fields
  "Amount":"Valor","Note":"Nota","Account":"Conta","First Name":"Nome",
  "Last Name":"Sobrenome","Email":"E-mail","Recipient":"Destinatário",
  "Bank Name":"Nome do banco","Account Number":"Número da conta",
  "Routing Number":"Número de roteamento","SWIFT Code":"Código SWIFT","IBAN":"IBAN",
  "Description":"Descrição","Reference":"Referência","Memo":"Memorando",
  "Enter amount":"Digite o valor","Select account":"Selecionar conta",
  "Select beneficiary":"Selecionar beneficiário","Enter description":"Digite a descrição",
  "Enter note":"Digite uma nota",
  
  // Transaction Details
  "Date & Time":"Data e hora","Status":"Status","Decline Reason":"Motivo da recusa",
  "Account Type":"Tipo de conta","Transaction Type":"Tipo de transação","Fee":"Taxa",
  "Net Amount":"Valor líquido","Exchange Rate":"Taxa de câmbio","Recipient Name":"Nome do destinatário",
  
  // Account & Profile
  "Activity":"Atividade","Profile":"Perfil","Top Up":"Recarregar",
  "Recent Transactions":"Transações recentes","View All":"Ver tudo",
  "Total Balance":"Saldo total","Available Funds":"Fundos disponíveis",
  "Account Status":"Status da conta","Personal Information":"Informações pessoais",
  "Region":"Região","United States":"Estados Unidos",
  
  // Filters & Views
  "All":"Tudo","Unread":"Não lido","Mark all read":"Marcar tudo como lido","Filter":"Filtrar",
  "Credits Only":"Somente créditos","Debits Only":"Somente débitos",
  "All Accounts":"Todas as contas","Checking":"Corrente","Savings":"Poupança",
  
  // Status & Notifications
  "Pending":"Pendente","Completed":"Concluído","Failed":"Falhou","Approved":"Aprovado",
  "Cancelled":"Cancelado","Processing":"Processando","Transaction Failed":"Transação falhou",
  "Transaction Declined":"Transação recusada","Transaction Approved":"Transação aprovada",
  "Beneficiary Approved":"Beneficiário aprovado","Balance Updated":"Saldo atualizado",
  "No notifications yet":"Sem notificações","No transactions found":"Nenhuma transação encontrada",
  "Loading":"Carregando","Just now":"Agora mesmo",
  
  // Settings & Security
  "Language":"Idioma","Select Language":"Selecionar idioma","Theme":"Tema",
  "Dark":"Escuro","Light":"Claro","Sign Out":"Sair","Security":"Segurança",
  "Privacy":"Privacidade","Preferences":"Preferências","Linked Accounts":"Contas vinculadas",
  "Change Password":"Alterar senha","Contact Support":"Contatar suporte",
  "Enable Notifications":"Ativar notificações","Email Alerts":"Alertas de e-mail",
  "Push Alerts":"Alertas push","Two-Factor Authentication":"Autenticação de dois fatores",
  "Biometric Login":"Login biométrico","Login Activity":"Atividade de login",
  "Privacy Controls":"Controles de privacidade","External Bank Accounts":"Contas bancárias externas",
  "Connected Cards":"Cartões conectados",
  
  // Messages & Prompts
  "To update your information, please contact support.":"Para atualizar suas informações, entre em contato com o suporte.",
  "Please log in to view transactions.":"Faça login para ver as transações.",
  "Please enter a valid amount":"Digite um valor válido",
  "Insufficient funds":"Fundos insuficientes",
  "Transaction submitted successfully":"Transação enviada com sucesso",
  "Something went wrong. Please try again.":"Algo deu errado. Tente novamente.",
  "Success":"Sucesso","Error":"Erro","Are you sure?":"Tem certeza?",
  "This action cannot be undone":"Esta ação não pode ser desfeita",
  
  // Crypto Specific
  "Current Price":"Preço atual","24h Change":"Variação 24h","You will receive":"Você receberá",
  "Price per coin":"Preço por moeda","Network Fee":"Taxa de rede","Total Cost":"Custo total",
  
  // Bills & Transfers
  "Beneficiary":"Beneficiário","Select Bank":"Selecionar banco",
  "Enter recipient details":"Digite os dados do destinatário","Review transfer":"Revisar transferência",
  "Transfer from":"Transferir de","Transfer to":"Transferir para","Wire details":"Detalhes da transferência",
  "Local bank transfer":"Transferência bancária local","Internal account transfer":"Transferência de conta interna",
  "Bill payment":"Pagamento de conta","Pay to":"Pagar para","Bill amount":"Valor da conta",
  
  // Card & Deposits
  "Card Number":"Número do cartão","Expiration Date":"Data de validade","CVV":"CVV",
  "Cardholder Name":"Nome do titular","Check front":"Frente do cheque","Check back":"Verso do cheque",
  "Upload check image":"Enviar imagem do cheque","Deposit amount":"Valor do depósito",
  
  // Validation Messages
  "Required":"Obrigatório","Invalid":"Inválido","Too short":"Muito curto","Too long":"Muito longo",
  "Must be a number":"Deve ser um número","Must be positive":"Deve ser positivo",
  "Exceeds balance":"Excede o saldo","Minimum amount":"Valor mínimo",
  "Maximum amount":"Valor máximo",
  
  // Time & Dates
  "Today":"Hoje","Yesterday":"Ontem","This Week":"Esta semana","This Month":"Este mês",
  "Last Month":"Mês passado","All Time":"Todo o tempo",
  
  // Common UI
  "Show more":"Mostrar mais","Show less":"Mostrar menos","Copy":"Copiar","Copied":"Copiado",
  "Download":"Baixar","Upload":"Enviar","Next":"Próximo","Previous":"Anterior",
  "Done":"Concluído","Skip":"Pular","Accounts":"Contas",
};

const IT: Translations = { ...EN,
  "Welcome back":"Bentornato","Hi,":"Ciao,","Total balance":"Saldo totale",
  "Quick Links":"Link rapidi","Customise":"Personalizza","Settings":"Impostazioni",
  "Notifications":"Notifiche","Home":"Home","Transactions":"Transazioni",
  "Support":"Supporto","Transfer":"Bonifico","Local Transfer":"Bonifico locale",
  "Wire Transfer":"Bonifico bancario","Internal Transfer":"Bonifico interno",
  "Pay Bills":"Paga bollette","Buy Crypto":"Acquista Crypto",
  "Add Beneficiary":"Aggiungi beneficiario","Check Deposit":"Deposito assegno",
  "Crypto Deposit":"Deposito crypto","Transaction History":"Cronologia transazioni",
  "Card Deposit":"Deposito carta","Cards":"Carte","Cancel":"Annulla",
  "Continue":"Continua","Confirm":"Conferma","Back":"Indietro","Send":"Invia",
  "Close":"Chiudi","Save":"Salva","Edit":"Modifica","Delete":"Elimina",
  "Add":"Aggiungi","Remove":"Rimuovi","Update":"Aggiorna","Create":"Crea",
  "Submit":"Invia","Reset":"Ripristina","Refresh":"Aggiorna","Search":"Cerca",
  "Amount":"Importo","Note":"Nota","Account":"Conto","First Name":"Nome",
  "Last Name":"Cognome","Email":"Email","Recipient":"Destinatario",
  "Bank Name":"Nome banca","Account Number":"Numero conto","Routing Number":"Numero di routing",
  "SWIFT Code":"Codice SWIFT","IBAN":"IBAN","Description":"Descrizione",
  "Reference":"Riferimento","Memo":"Promemoria","Enter amount":"Inserisci importo",
  "Select account":"Seleziona conto","Select beneficiary":"Seleziona beneficiario",
  "Enter description":"Inserisci descrizione","Enter note":"Inserisci nota",
  "Date & Time":"Data e ora","Status":"Stato","Decline Reason":"Motivo rifiuto",
  "Account Type":"Tipo di conto","Transaction Type":"Tipo transazione","Fee":"Commissione",
  "Net Amount":"Importo netto","Exchange Rate":"Tasso di cambio","Recipient Name":"Nome destinatario",
  "Activity":"Attività","Profile":"Profilo","Top Up":"Ricarica",
  "Recent Transactions":"Transazioni recenti","View All":"Vedi tutto",
  "Total Balance":"Saldo totale","Available Funds":"Fondi disponibili",
  "Account Status":"Stato del conto","Personal Information":"Informazioni personali",
  "Region":"Regione","United States":"Stati Uniti","All":"Tutto","Unread":"Non letto",
  "Mark all read":"Segna tutto come letto","Filter":"Filtra",
  "Credits Only":"Solo crediti","Debits Only":"Solo debiti",
  "All Accounts":"Tutti i conti","Checking":"Corrente","Savings":"Risparmio",
  "Pending":"In attesa","Completed":"Completato","Failed":"Fallito",
  "Approved":"Approvato","Cancelled":"Annullato","Processing":"In elaborazione",
  "Transaction Failed":"Transazione fallita","Transaction Declined":"Transazione rifiutata",
  "Transaction Approved":"Transazione approvata","Beneficiary Approved":"Beneficiario approvato",
  "Balance Updated":"Saldo aggiornato","No notifications yet":"Nessuna notifica",
  "No transactions found":"Nessuna transazione trovata","Loading":"Caricamento",
  "Just now":"Proprio ora","Language":"Lingua","Select Language":"Seleziona lingua",
  "Theme":"Tema","Dark":"Scuro","Light":"Chiaro","Sign Out":"Esci",
  "Security":"Sicurezza","Privacy":"Privacy","Preferences":"Preferenze",
  "Linked Accounts":"Conti collegati","Change Password":"Cambia password",
  "Contact Support":"Contatta supporto","Enable Notifications":"Abilita notifiche",
  "Email Alerts":"Avvisi email","Push Alerts":"Avvisi push",
  "Two-Factor Authentication":"Autenticazione a due fattori",
  "Biometric Login":"Login biometrico","Login Activity":"Attività di login",
  "Privacy Controls":"Controlli privacy","External Bank Accounts":"Conti bancari esterni",
  "Connected Cards":"Carte collegate",
  "To update your information, please contact support.":"Per aggiornare le tue informazioni, contatta il supporto.",
  "Please log in to view transactions.":"Accedi per vedere le transazioni.",
  "Please enter a valid amount":"Inserisci un importo valido",
  "Insufficient funds":"Fondi insufficienti",
  "Transaction submitted successfully":"Transazione inviata con successo",
  "Something went wrong. Please try again.":"Qualcosa è andato storto. Riprova.",
  "Success":"Successo","Error":"Errore","Are you sure?":"Sei sicuro?",
  "This action cannot be undone":"Questa azione non può essere annullata",
  "Current Price":"Prezzo attuale","24h Change":"Variazione 24h","You will receive":"Riceverai",
  "Price per coin":"Prezzo per moneta","Network Fee":"Commissione di rete","Total Cost":"Costo totale",
  "Beneficiary":"Beneficiario","Select Bank":"Seleziona banca",
  "Enter recipient details":"Inserisci dettagli destinatario","Review transfer":"Rivedi bonifico",
  "Transfer from":"Trasferisci da","Transfer to":"Trasferisci a","Wire details":"Dettagli bonifico",
  "Local bank transfer":"Bonifico bancario locale","Internal account transfer":"Bonifico interno",
  "Bill payment":"Pagamento bolletta","Pay to":"Paga a","Bill amount":"Importo bolletta",
  "Card Number":"Numero carta","Expiration Date":"Data scadenza","CVV":"CVV",
  "Cardholder Name":"Nome titolare","Check front":"Fronte assegno","Check back":"Retro assegno",
  "Upload check image":"Carica immagine assegno","Deposit amount":"Importo deposito",
  "Required":"Richiesto","Invalid":"Non valido","Too short":"Troppo corto","Too long":"Troppo lungo",
  "Must be a number":"Deve essere un numero","Must be positive":"Deve essere positivo",
  "Exceeds balance":"Supera il saldo","Minimum amount":"Importo minimo","Maximum amount":"Importo massimo",
  "Today":"Oggi","Yesterday":"Ieri","This Week":"Questa settimana","This Month":"Questo mese",
  "Last Month":"Mese scorso","All Time":"Sempre",
  "Show more":"Mostra altro","Show less":"Mostra meno","Copy":"Copia","Copied":"Copiato",
  "Download":"Scarica","Upload":"Carica","Next":"Avanti","Previous":"Precedente",
  "Done":"Fatto","Skip":"Salta","Accounts":"Conti",
};

const NL: Translations = { ...EN,
  "Welcome back":"Welkom terug","Hi,":"Hallo,","Total balance":"Totaal saldo",
  "Quick Links":"Snelkoppelingen","Customise":"Aanpassen","Settings":"Instellingen",
  "Notifications":"Meldingen","Home":"Startpagina","Transactions":"Transacties",
  "Support":"Ondersteuning","Transfer":"Overschrijving","Local Transfer":"Lokale overschrijving",
  "Wire Transfer":"Bankoverschrijving","Internal Transfer":"Interne overschrijving",
  "Pay Bills":"Rekeningen betalen","Buy Crypto":"Crypto kopen",
  "Add Beneficiary":"Begunstigde toevoegen","Check Deposit":"Cheque storting",
  "Crypto Deposit":"Crypto storting","Transaction History":"Transactiegeschiedenis",
  "Card Deposit":"Kaartstorting","Cards":"Kaarten","Cancel":"Annuleren",
  "Continue":"Doorgaan","Confirm":"Bevestigen","Back":"Terug","Send":"Versturen",
  "Close":"Sluiten","Save":"Opslaan","Edit":"Bewerken","Delete":"Verwijderen",
  "Add":"Toevoegen","Remove":"Verwijderen","Update":"Bijwerken","Create":"Aanmaken",
  "Submit":"Indienen","Reset":"Resetten","Refresh":"Vernieuwen","Search":"Zoeken",
  "Amount":"Bedrag","Note":"Notitie","Account":"Rekening","First Name":"Voornaam",
  "Last Name":"Achternaam","Email":"E-mail","Recipient":"Ontvanger",
  "Bank Name":"Banknaam","Account Number":"Rekeningnummer","Routing Number":"Routenummer",
  "SWIFT Code":"SWIFT-code","IBAN":"IBAN","Description":"Beschrijving",
  "Reference":"Referentie","Memo":"Memo","Enter amount":"Bedrag invoeren",
  "Select account":"Rekening selecteren","Select beneficiary":"Begunstigde selecteren",
  "Enter description":"Beschrijving invoeren","Enter note":"Notitie invoeren",
  "Date & Time":"Datum en tijd","Status":"Status","Decline Reason":"Reden afwijzing",
  "Account Type":"Rekeningtype","Transaction Type":"Transactietype","Fee":"Kosten",
  "Net Amount":"Netto bedrag","Exchange Rate":"Wisselkoers","Recipient Name":"Naam ontvanger",
  "Activity":"Activiteit","Profile":"Profiel","Top Up":"Opladen",
  "Recent Transactions":"Recente transacties","View All":"Alles bekijken",
  "Total Balance":"Totaal saldo","Available Funds":"Beschikbare middelen",
  "Account Status":"Rekeningsstatus","Personal Information":"Persoonlijke informatie",
  "Region":"Regio","United States":"Verenigde Staten","All":"Alles","Unread":"Ongelezen",
  "Mark all read":"Alles als gelezen markeren","Filter":"Filter",
  "Credits Only":"Alleen credits","Debits Only":"Alleen debits",
  "All Accounts":"Alle rekeningen","Checking":"Betaalrekening","Savings":"Spaarrekening",
  "Pending":"In behandeling","Completed":"Voltooid","Failed":"Mislukt",
  "Approved":"Goedgekeurd","Cancelled":"Geannuleerd","Processing":"Verwerken",
  "Transaction Failed":"Transactie mislukt","Transaction Declined":"Transactie geweigerd",
  "Transaction Approved":"Transactie goedgekeurd","Beneficiary Approved":"Begunstigde goedgekeurd",
  "Balance Updated":"Saldo bijgewerkt","No notifications yet":"Nog geen meldingen",
  "No transactions found":"Geen transacties gevonden","Loading":"Laden",
  "Just now":"Zojuist","Language":"Taal","Select Language":"Taal selecteren",
  "Theme":"Thema","Dark":"Donker","Light":"Licht","Sign Out":"Uitloggen",
  "Security":"Beveiliging","Privacy":"Privacy","Preferences":"Voorkeuren",
  "Linked Accounts":"Gekoppelde rekeningen","Change Password":"Wachtwoord wijzigen",
  "Contact Support":"Contact opnemen","Enable Notifications":"Meldingen inschakelen",
  "Email Alerts":"E-mailmeldingen","Push Alerts":"Push-meldingen",
  "Two-Factor Authentication":"Twee-factor authenticatie",
  "Biometric Login":"Biometrische login","Login Activity":"Login activiteit",
  "Privacy Controls":"Privacy-instellingen","External Bank Accounts":"Externe bankrekeningen",
  "Connected Cards":"Gekoppelde kaarten",
  "To update your information, please contact support.":"Neem contact op met ondersteuning om uw gegevens bij te werken.",
  "Please log in to view transactions.":"Log in om transacties te bekijken.",
  "Please enter a valid amount":"Voer een geldig bedrag in",
  "Insufficient funds":"Onvoldoende saldo",
  "Transaction submitted successfully":"Transactie succesvol ingediend",
  "Something went wrong. Please try again.":"Er is iets misgegaan. Probeer het opnieuw.",
  "Success":"Succes","Error":"Fout","Are you sure?":"Weet je het zeker?",
  "This action cannot be undone":"Deze actie kan niet ongedaan worden gemaakt",
  "Current Price":"Huidige prijs","24h Change":"24u wijziging","You will receive":"U ontvangt",
  "Price per coin":"Prijs per munt","Network Fee":"Netwerkkosten","Total Cost":"Totale kosten",
  "Beneficiary":"Begunstigde","Select Bank":"Bank selecteren",
  "Enter recipient details":"Ontvanger details invoeren","Review transfer":"Overschrijving controleren",
  "Transfer from":"Overmaken van","Transfer to":"Overmaken naar","Wire details":"Overboekingsdetails",
  "Local bank transfer":"Lokale bankoverschrijving","Internal account transfer":"Interne rekening overschrijving",
  "Bill payment":"Rekening betaling","Pay to":"Betalen aan","Bill amount":"Rekeningbedrag",
  "Card Number":"Kaartnummer","Expiration Date":"Vervaldatum","CVV":"CVV",
  "Cardholder Name":"Naam kaarthouder","Check front":"Cheque voorkant","Check back":"Cheque achterkant",
  "Upload check image":"Cheque afbeelding uploaden","Deposit amount":"Stortingsbedrag",
  "Required":"Verplicht","Invalid":"Ongeldig","Too short":"Te kort","Too long":"Te lang",
  "Must be a number":"Moet een nummer zijn","Must be positive":"Moet positief zijn",
  "Exceeds balance":"Overschrijdt saldo","Minimum amount":"Minimum bedrag","Maximum amount":"Maximum bedrag",
  "Today":"Vandaag","Yesterday":"Gisteren","This Week":"Deze week","This Month":"Deze maand",
  "Last Month":"Vorige maand","All Time":"Alle tijd",
  "Show more":"Meer tonen","Show less":"Minder tonen","Copy":"Kopiëren","Copied":"Gekopieerd",
  "Download":"Downloaden","Upload":"Uploaden","Next":"Volgende","Previous":"Vorige",
  "Done":"Klaar","Skip":"Overslaan","Accounts":"Rekeningen",
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
  // Read synchronously on the client, "en" on server
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    if (typeof window === "undefined") return "en";
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
      if (stored && SUPPORTED_LANGUAGES.some((l) => l.code === stored)) return stored;
    } catch {}
    return "en";
  });

  useEffect(() => {

    const handler = (e?: Event) => {
      try {
        const code = (e as CustomEvent)?.detail ||
          localStorage.getItem(STORAGE_KEY);
        if (code && SUPPORTED_LANGUAGES.some((l) => l.code === code)) {
          setLanguageState(code as LanguageCode);
        }
      } catch {}
    };
    window.addEventListener("nexus-language-change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("nexus-language-change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const setLanguage = (code: LanguageCode) => {
    setLanguageState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
      window.dispatchEvent(new CustomEvent("nexus-language-change", { detail: code }));
    } catch {}
  };

  const t = (key: string): string =>
    (translations as any)[language]?.[key] ??
    (translations as any)["en"]?.[key] ??
    key;

  const currentLanguage = SUPPORTED_LANGUAGES.find((l) => l.code === language)!;

  return { language, setLanguage, t, currentLanguage, supportedLanguages: SUPPORTED_LANGUAGES };
}
