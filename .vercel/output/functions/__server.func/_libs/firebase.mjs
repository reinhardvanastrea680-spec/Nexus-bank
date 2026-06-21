import "./firebase__firestore.mjs";
import { r as registerVersion } from "./firebase__app.mjs";
import "./firebase__auth.mjs";
import "./firebase__logger.mjs";
import "./firebase__storage.mjs";
var name = "firebase";
var version = "12.15.0";
registerVersion(name, version, "app");
