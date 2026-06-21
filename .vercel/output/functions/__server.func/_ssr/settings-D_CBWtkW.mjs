import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useUserAuth } from "./useUserAuth-Dj040xaQ.mjs";
import { u as useUserAccount } from "./useUserAccount-DGi8dU3l.mjs";
import { u as useTheme } from "./use-theme-BfOV-CAK.mjs";
import { B as BottomNav, t as themeColors } from "./BottomNav-CtUMOiqo.mjs";
import "../_libs/firebase__firestore.mjs";
import "../_libs/firebase.mjs";
import "../_libs/firebase__auth.mjs";
import "../_libs/firebase__app.mjs";
import "../_libs/firebase__logger.mjs";
import "../_libs/firebase__storage.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowLeft, m as User, a as Mail, B as Bell, n as Smartphone, L as Lock, o as Shield, p as FingerprintPattern, e as History, E as Eye, q as Link2, r as Languages, G as Globe, s as Palette, t as LogOut } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "../_libs/tanstack__history.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "async_hooks";
import "stream";
import "util";
import "crypto";
import "../_libs/isbot.mjs";
import "./router-8iYk_PDV.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/firebase__component.mjs";
import "../_libs/firebase__util.mjs";
import "../_libs/firebase__webchannel-wrapper.mjs";
import "../_libs/@grpc/grpc-js.mjs";
import "process";
import "tls";
import "fs";
import "os";
import "net";
import "events";
import "http2";
import "http";
import "url";
import "dns";
import "zlib";
import "../_libs/@grpc/proto-loader.mjs";
import "path";
import "../_libs/lodash.camelcase.mjs";
import "../_libs/protobufjs.mjs";
import "../_libs/protobufjs__aspromise.mjs";
import "../_libs/protobufjs__base64.mjs";
import "../_libs/protobufjs__eventemitter.mjs";
import "../_libs/protobufjs__float.mjs";
import "../_libs/protobufjs__utf8.mjs";
import "../_libs/protobufjs__pool.mjs";
import "../_libs/long.mjs";
import "../_libs/protobufjs__codegen.mjs";
import "../_libs/protobufjs__fetch.mjs";
import "../_libs/protobufjs__path.mjs";
import "../_libs/re2js.mjs";
import "../_libs/idb.mjs";
import "./adminConfig-D-CDJgKq.mjs";
function Settings() {
  const navigate = useNavigate();
  const {
    user,
    userLogout
  } = useUserAuth();
  const {
    account
  } = useUserAccount();
  const {
    theme,
    toggleTheme
  } = useTheme();
  const t = themeColors(theme);
  const [notificationsEnabled, setNotificationsEnabled] = reactExports.useState(true);
  const [emailAlerts, setEmailAlerts] = reactExports.useState(true);
  const [pushAlerts, setPushAlerts] = reactExports.useState(true);
  const [smsAlerts, setSmsAlerts] = reactExports.useState(false);
  const [language] = reactExports.useState("English");
  const [twoFactorEnabled, setTwoFactorEnabled] = reactExports.useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = reactExports.useState(false);
  const handleLogout = async () => {
    try {
      await userLogout();
      navigate({
        to: "/login"
      });
    } catch (e) {
      console.error(e);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen w-full flex flex-col pb-24", style: {
    background: t.pageBg
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 pt-10 pb-6 flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigate({
        to: "/"
      }), className: "p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 24, style: {
        color: t.textPrimary
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold flex-1 text-center", style: {
        color: t.textPrimary
      }, children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 flex-1 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", style: {
          color: t.textMuted
        }, children: "Profile" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full flex items-center justify-between p-4 rounded-2xl", style: {
          background: t.cardBg
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center", style: {
            background: "#38BDF8",
            color: "#0B1120"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 18 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", style: {
              color: t.textPrimary
            }, children: account?.fullName || "User Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", style: {
              color: t.textMuted
            }, children: user?.email })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-2xl space-y-4", style: {
          background: t.cardBg
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full flex items-center justify-center", style: {
              background: t.inputBg
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 16, style: {
              color: "#38BDF8"
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
              color: t.textPrimary
            }, children: "Personal Information" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full flex items-center justify-center", style: {
              background: t.inputBg
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 16, style: {
              color: "#38BDF8"
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
              color: t.textPrimary
            }, children: "Contact Details" })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", style: {
          color: t.textMuted
        }, children: "Notifications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-2xl space-y-4", style: {
          background: t.cardBg
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full flex items-center justify-center", style: {
                background: t.inputBg
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 16, style: {
                color: "#38BDF8"
              } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
                color: t.textPrimary
              }, children: "Enable Notifications" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setNotificationsEnabled(!notificationsEnabled), className: "w-12 h-6 rounded-full flex items-center", style: {
              background: notificationsEnabled ? t.accentCyan : t.inputBg,
              paddingLeft: notificationsEnabled ? "26px" : "2px"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full", style: {
              background: "#FFFFFF"
            } }) })
          ] }),
          notificationsEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { size: 16, style: {
                  color: "#38BDF8"
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                  color: t.textPrimary
                }, children: "Email Alerts" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEmailAlerts(!emailAlerts), className: "w-12 h-6 rounded-full flex items-center", style: {
                background: emailAlerts ? t.accentCyan : t.inputBg,
                paddingLeft: emailAlerts ? "26px" : "2px"
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full", style: {
                background: "#FFFFFF"
              } }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 16, style: {
                  color: "#38BDF8"
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                  color: t.textPrimary
                }, children: "Push Alerts" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setPushAlerts(!pushAlerts), className: "w-12 h-6 rounded-full flex items-center", style: {
                background: pushAlerts ? t.accentCyan : t.inputBg,
                paddingLeft: pushAlerts ? "26px" : "2px"
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full", style: {
                background: "#FFFFFF"
              } }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 16, style: {
                  color: "#38BDF8"
                } }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
                  color: t.textPrimary
                }, children: "SMS Alerts" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSmsAlerts(!smsAlerts), className: "w-12 h-6 rounded-full flex items-center", style: {
                background: smsAlerts ? t.accentCyan : t.inputBg,
                paddingLeft: smsAlerts ? "26px" : "2px"
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full", style: {
                background: "#FFFFFF"
              } }) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", style: {
          color: t.textMuted
        }, children: "Security" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full flex items-center justify-between p-4 rounded-2xl", style: {
            background: t.cardBg
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full flex items-center justify-center", style: {
              background: t.inputBg
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { size: 16, style: {
              color: "#38BDF8"
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
              color: t.textPrimary
            }, children: "Change Password" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-2xl", style: {
            background: t.cardBg
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full flex items-center justify-center", style: {
                  background: t.inputBg
                }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { size: 16, style: {
                  color: "#38BDF8"
                } }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
                  color: t.textPrimary
                }, children: "Two-Factor Authentication" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTwoFactorEnabled(!twoFactorEnabled), className: "w-12 h-6 rounded-full flex items-center", style: {
                background: twoFactorEnabled ? t.accentCyan : t.inputBg,
                paddingLeft: twoFactorEnabled ? "26px" : "2px"
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full", style: {
                background: "#FFFFFF"
              } }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full flex items-center justify-center", style: {
                  background: t.inputBg
                }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FingerprintPattern, { size: 16, style: {
                  color: "#38BDF8"
                } }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
                  color: t.textPrimary
                }, children: "Biometric Login" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setBiometricsEnabled(!biometricsEnabled), className: "w-12 h-6 rounded-full flex items-center", style: {
                background: biometricsEnabled ? t.accentCyan : t.inputBg,
                paddingLeft: biometricsEnabled ? "26px" : "2px"
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-5 h-5 rounded-full", style: {
                background: "#FFFFFF"
              } }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full flex items-center justify-between p-4 rounded-2xl", style: {
            background: t.cardBg
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full flex items-center justify-center", style: {
              background: t.inputBg
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(History, { size: 16, style: {
              color: "#38BDF8"
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
              color: t.textPrimary
            }, children: "Login Activity" })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", style: {
          color: t.textMuted
        }, children: "Privacy" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full flex items-center justify-between p-4 rounded-2xl", style: {
          background: t.cardBg
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full flex items-center justify-center", style: {
            background: t.inputBg
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 16, style: {
            color: "#38BDF8"
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
            color: t.textPrimary
          }, children: "Privacy Controls" })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", style: {
          color: t.textMuted
        }, children: "Linked Accounts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full flex items-center justify-between p-4 rounded-2xl", style: {
            background: t.cardBg
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full flex items-center justify-center", style: {
              background: t.inputBg
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { size: 16, style: {
              color: "#38BDF8"
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
              color: t.textPrimary
            }, children: "External Bank Accounts" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "w-full flex items-center justify-between p-4 rounded-2xl", style: {
            background: t.cardBg
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full flex items-center justify-center", style: {
              background: t.inputBg
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { size: 16, style: {
              color: "#38BDF8"
            } }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
              color: t.textPrimary
            }, children: "Connected Cards" })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", style: {
          color: t.textMuted
        }, children: "Preferences" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "w-full flex items-center justify-between p-4 rounded-2xl", style: {
            background: t.cardBg
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full flex items-center justify-center", style: {
                background: t.inputBg
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Languages, { size: 16, style: {
                color: "#38BDF8"
              } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
                color: t.textPrimary
              }, children: "Language" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t.textMuted
            }, children: language })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "w-full flex items-center justify-between p-4 rounded-2xl", style: {
            background: t.cardBg
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full flex items-center justify-center", style: {
                background: t.inputBg
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 16, style: {
                color: "#38BDF8"
              } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
                color: t.textPrimary
              }, children: "Region" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", style: {
              color: t.textMuted
            }, children: "United States" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 rounded-2xl", style: {
            background: t.cardBg
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full flex items-center justify-center", style: {
                background: t.inputBg
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 16, style: {
                color: "#38BDF8"
              } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
                color: t.textPrimary
              }, children: "Theme" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: toggleTheme, className: "flex items-center gap-2 px-3 py-2 rounded-full", style: {
              background: t.inputBg
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
              color: t.textPrimary
            }, children: theme === "dark" ? "Dark" : "Light" }) })
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleLogout, className: "w-full flex items-center justify-center gap-2 p-4 rounded-2xl", style: {
        background: "rgba(255,77,106,0.1)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 18, style: {
          color: "#FF4D6A"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", style: {
          color: "#FF4D6A"
        }, children: "Log Out" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, { active: "settings" })
  ] });
}
export {
  Settings as component
};
