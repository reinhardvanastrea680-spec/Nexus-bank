import { b as _registerComponent, r as registerVersion, S as SDK_VERSION, a as _isFirebaseServerApp, _ as _getProvider, g as getApp } from "./firebase__app.mjs";
import { F as FirebaseError, a as getModularInstance, c as getDefaultEmulatorHostnameAndPort, e as isCloudWorkstation, p as pingServer, f as createMockUserToken } from "./firebase__util.mjs";
import { a as Component } from "./firebase__component.mjs";
const DEFAULT_HOST = "firebasestorage.googleapis.com";
const CONFIG_STORAGE_BUCKET_KEY = "storageBucket";
const DEFAULT_MAX_OPERATION_RETRY_TIME = 2 * 60 * 1e3;
const DEFAULT_MAX_UPLOAD_RETRY_TIME = 10 * 60 * 1e3;
class StorageError extends FirebaseError {
  /**
   * @param code - A `StorageErrorCode` string to be prefixed with 'storage/' and
   *  added to the end of the message.
   * @param message  - Error message.
   * @param status_ - Corresponding HTTP Status Code
   */
  constructor(code, message, status_ = 0) {
    super(prependCode(code), `Firebase Storage: ${message} (${prependCode(code)})`);
    this.status_ = status_;
    this.customData = { serverResponse: null };
    this._baseMessage = this.message;
    Object.setPrototypeOf(this, StorageError.prototype);
  }
  get status() {
    return this.status_;
  }
  set status(status) {
    this.status_ = status;
  }
  /**
   * Compares a `StorageErrorCode` against this error's code, filtering out the prefix.
   */
  _codeEquals(code) {
    return prependCode(code) === this.code;
  }
  /**
   * Optional response message that was added by the server.
   */
  get serverResponse() {
    return this.customData.serverResponse;
  }
  set serverResponse(serverResponse) {
    this.customData.serverResponse = serverResponse;
    if (this.customData.serverResponse) {
      this.message = `${this._baseMessage}
${this.customData.serverResponse}`;
    } else {
      this.message = this._baseMessage;
    }
  }
}
var StorageErrorCode;
(function(StorageErrorCode2) {
  StorageErrorCode2["UNKNOWN"] = "unknown";
  StorageErrorCode2["OBJECT_NOT_FOUND"] = "object-not-found";
  StorageErrorCode2["BUCKET_NOT_FOUND"] = "bucket-not-found";
  StorageErrorCode2["PROJECT_NOT_FOUND"] = "project-not-found";
  StorageErrorCode2["QUOTA_EXCEEDED"] = "quota-exceeded";
  StorageErrorCode2["UNAUTHENTICATED"] = "unauthenticated";
  StorageErrorCode2["UNAUTHORIZED"] = "unauthorized";
  StorageErrorCode2["UNAUTHORIZED_APP"] = "unauthorized-app";
  StorageErrorCode2["RETRY_LIMIT_EXCEEDED"] = "retry-limit-exceeded";
  StorageErrorCode2["INVALID_CHECKSUM"] = "invalid-checksum";
  StorageErrorCode2["CANCELED"] = "canceled";
  StorageErrorCode2["INVALID_EVENT_NAME"] = "invalid-event-name";
  StorageErrorCode2["INVALID_URL"] = "invalid-url";
  StorageErrorCode2["INVALID_DEFAULT_BUCKET"] = "invalid-default-bucket";
  StorageErrorCode2["NO_DEFAULT_BUCKET"] = "no-default-bucket";
  StorageErrorCode2["CANNOT_SLICE_BLOB"] = "cannot-slice-blob";
  StorageErrorCode2["SERVER_FILE_WRONG_SIZE"] = "server-file-wrong-size";
  StorageErrorCode2["NO_DOWNLOAD_URL"] = "no-download-url";
  StorageErrorCode2["INVALID_ARGUMENT"] = "invalid-argument";
  StorageErrorCode2["INVALID_ARGUMENT_COUNT"] = "invalid-argument-count";
  StorageErrorCode2["APP_DELETED"] = "app-deleted";
  StorageErrorCode2["INVALID_ROOT_OPERATION"] = "invalid-root-operation";
  StorageErrorCode2["INVALID_FORMAT"] = "invalid-format";
  StorageErrorCode2["INTERNAL_ERROR"] = "internal-error";
  StorageErrorCode2["UNSUPPORTED_ENVIRONMENT"] = "unsupported-environment";
})(StorageErrorCode || (StorageErrorCode = {}));
function prependCode(code) {
  return "storage/" + code;
}
function unknown() {
  const message = "An unknown error occurred, please check the error payload for server response.";
  return new StorageError(StorageErrorCode.UNKNOWN, message);
}
function retryLimitExceeded() {
  return new StorageError(StorageErrorCode.RETRY_LIMIT_EXCEEDED, "Max retry time for operation exceeded, please try again.");
}
function canceled() {
  return new StorageError(StorageErrorCode.CANCELED, "User canceled the upload/download.");
}
function invalidUrl(url) {
  return new StorageError(StorageErrorCode.INVALID_URL, "Invalid URL '" + url + "'.");
}
function invalidDefaultBucket(bucket) {
  return new StorageError(StorageErrorCode.INVALID_DEFAULT_BUCKET, "Invalid default bucket '" + bucket + "'.");
}
function invalidArgument(message) {
  return new StorageError(StorageErrorCode.INVALID_ARGUMENT, message);
}
function appDeleted() {
  return new StorageError(StorageErrorCode.APP_DELETED, "The Firebase app was deleted.");
}
function invalidRootOperation(name2) {
  return new StorageError(StorageErrorCode.INVALID_ROOT_OPERATION, "The operation '" + name2 + "' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').");
}
class Location {
  constructor(bucket, path) {
    this.bucket = bucket;
    this.path_ = path;
  }
  get path() {
    return this.path_;
  }
  get isRoot() {
    return this.path.length === 0;
  }
  fullServerUrl() {
    const encode = encodeURIComponent;
    return "/b/" + encode(this.bucket) + "/o/" + encode(this.path);
  }
  bucketOnlyServerUrl() {
    const encode = encodeURIComponent;
    return "/b/" + encode(this.bucket) + "/o";
  }
  static makeFromBucketSpec(bucketString, host) {
    let bucketLocation;
    try {
      bucketLocation = Location.makeFromUrl(bucketString, host);
    } catch (e) {
      return new Location(bucketString, "");
    }
    if (bucketLocation.path === "") {
      return bucketLocation;
    } else {
      throw invalidDefaultBucket(bucketString);
    }
  }
  static makeFromUrl(url, host) {
    let location = null;
    const bucketDomain = "([A-Za-z0-9.\\-_]+)";
    function gsModify(loc) {
      if (loc.path.charAt(loc.path.length - 1) === "/") {
        loc.path_ = loc.path_.slice(0, -1);
      }
    }
    const gsPath = "(/(.*))?$";
    const gsRegex = new RegExp("^gs://" + bucketDomain + gsPath, "i");
    const gsIndices = { bucket: 1, path: 3 };
    function httpModify(loc) {
      loc.path_ = decodeURIComponent(loc.path);
    }
    const version2 = "v[A-Za-z0-9_]+";
    const firebaseStorageHost = host.replace(/[.]/g, "\\.");
    const firebaseStoragePath = "(/([^?#]*).*)?$";
    const firebaseStorageRegExp = new RegExp(`^https?://${firebaseStorageHost}/${version2}/b/${bucketDomain}/o${firebaseStoragePath}`, "i");
    const firebaseStorageIndices = { bucket: 1, path: 3 };
    const cloudStorageHost = host === DEFAULT_HOST ? "(?:storage.googleapis.com|storage.cloud.google.com)" : host;
    const cloudStoragePath = "([^?#]*)";
    const cloudStorageRegExp = new RegExp(`^https?://${cloudStorageHost}/${bucketDomain}/${cloudStoragePath}`, "i");
    const cloudStorageIndices = { bucket: 1, path: 2 };
    const groups = [
      { regex: gsRegex, indices: gsIndices, postModify: gsModify },
      {
        regex: firebaseStorageRegExp,
        indices: firebaseStorageIndices,
        postModify: httpModify
      },
      {
        regex: cloudStorageRegExp,
        indices: cloudStorageIndices,
        postModify: httpModify
      }
    ];
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const captures = group.regex.exec(url);
      if (captures) {
        const bucketValue = captures[group.indices.bucket];
        let pathValue = captures[group.indices.path];
        if (!pathValue) {
          pathValue = "";
        }
        location = new Location(bucketValue, pathValue);
        group.postModify(location);
        break;
      }
    }
    if (location == null) {
      throw invalidUrl(url);
    }
    return location;
  }
}
class FailRequest {
  constructor(error) {
    this.promise_ = Promise.reject(error);
  }
  /** @inheritDoc */
  getPromise() {
    return this.promise_;
  }
  /** @inheritDoc */
  cancel(_appDelete = false) {
  }
}
function start(doRequest, backoffCompleteCb, timeout) {
  let waitSeconds = 1;
  let retryTimeoutId = null;
  let globalTimeoutId = null;
  let hitTimeout = false;
  let cancelState = 0;
  function canceled2() {
    return cancelState === 2;
  }
  let triggeredCallback = false;
  function triggerCallback(...args) {
    if (!triggeredCallback) {
      triggeredCallback = true;
      backoffCompleteCb.apply(null, args);
    }
  }
  function callWithDelay(millis) {
    retryTimeoutId = setTimeout(() => {
      retryTimeoutId = null;
      doRequest(responseHandler, canceled2());
    }, millis);
  }
  function clearGlobalTimeout() {
    if (globalTimeoutId) {
      clearTimeout(globalTimeoutId);
    }
  }
  function responseHandler(success, ...args) {
    if (triggeredCallback) {
      clearGlobalTimeout();
      return;
    }
    if (success) {
      clearGlobalTimeout();
      triggerCallback.call(null, success, ...args);
      return;
    }
    const mustStop = canceled2() || hitTimeout;
    if (mustStop) {
      clearGlobalTimeout();
      triggerCallback.call(null, success, ...args);
      return;
    }
    if (waitSeconds < 64) {
      waitSeconds *= 2;
    }
    let waitMillis;
    if (cancelState === 1) {
      cancelState = 2;
      waitMillis = 0;
    } else {
      waitMillis = (waitSeconds + Math.random()) * 1e3;
    }
    callWithDelay(waitMillis);
  }
  let stopped = false;
  function stop2(wasTimeout) {
    if (stopped) {
      return;
    }
    stopped = true;
    clearGlobalTimeout();
    if (triggeredCallback) {
      return;
    }
    if (retryTimeoutId !== null) {
      if (!wasTimeout) {
        cancelState = 2;
      }
      clearTimeout(retryTimeoutId);
      callWithDelay(0);
    } else {
      if (!wasTimeout) {
        cancelState = 1;
      }
    }
  }
  callWithDelay(0);
  globalTimeoutId = setTimeout(() => {
    hitTimeout = true;
    stop2(true);
  }, timeout);
  return stop2;
}
function stop(id) {
  id(false);
}
function isJustDef(p) {
  return p !== void 0;
}
function validateNumber(argument, minValue, maxValue, value) {
  if (value < minValue) {
    throw invalidArgument(`Invalid value for '${argument}'. Expected ${minValue} or greater.`);
  }
  if (value > maxValue) {
    throw invalidArgument(`Invalid value for '${argument}'. Expected ${maxValue} or less.`);
  }
}
function makeQueryString(params) {
  const encode = encodeURIComponent;
  let queryPart = "?";
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const nextPart = encode(key) + "=" + encode(params[key]);
      queryPart = queryPart + nextPart + "&";
    }
  }
  queryPart = queryPart.slice(0, -1);
  return queryPart;
}
var ErrorCode;
(function(ErrorCode2) {
  ErrorCode2[ErrorCode2["NO_ERROR"] = 0] = "NO_ERROR";
  ErrorCode2[ErrorCode2["NETWORK_ERROR"] = 1] = "NETWORK_ERROR";
  ErrorCode2[ErrorCode2["ABORT"] = 2] = "ABORT";
})(ErrorCode || (ErrorCode = {}));
function isRetryStatusCode(status, additionalRetryCodes) {
  const isFiveHundredCode = status >= 500 && status < 600;
  const extraRetryCodes = [
    // Request Timeout: web server didn't receive full request in time.
    408,
    // Too Many Requests: you're getting rate-limited, basically.
    429
  ];
  const isExtraRetryCode = extraRetryCodes.indexOf(status) !== -1;
  const isAdditionalRetryCode = additionalRetryCodes.indexOf(status) !== -1;
  return isFiveHundredCode || isExtraRetryCode || isAdditionalRetryCode;
}
class NetworkRequest {
  constructor(url_, method_, headers_, body_, successCodes_, additionalRetryCodes_, callback_, errorCallback_, timeout_, progressCallback_, connectionFactory_, retry = true, isUsingEmulator = false) {
    this.url_ = url_;
    this.method_ = method_;
    this.headers_ = headers_;
    this.body_ = body_;
    this.successCodes_ = successCodes_;
    this.additionalRetryCodes_ = additionalRetryCodes_;
    this.callback_ = callback_;
    this.errorCallback_ = errorCallback_;
    this.timeout_ = timeout_;
    this.progressCallback_ = progressCallback_;
    this.connectionFactory_ = connectionFactory_;
    this.retry = retry;
    this.isUsingEmulator = isUsingEmulator;
    this.pendingConnection_ = null;
    this.backoffId_ = null;
    this.canceled_ = false;
    this.appDelete_ = false;
    this.promise_ = new Promise((resolve, reject) => {
      this.resolve_ = resolve;
      this.reject_ = reject;
      this.start_();
    });
  }
  /**
   * Actually starts the retry loop.
   */
  start_() {
    const doTheRequest = (backoffCallback, canceled2) => {
      if (canceled2) {
        backoffCallback(false, new RequestEndStatus(false, null, true));
        return;
      }
      const connection = this.connectionFactory_();
      this.pendingConnection_ = connection;
      const progressListener = (progressEvent) => {
        const loaded = progressEvent.loaded;
        const total = progressEvent.lengthComputable ? progressEvent.total : -1;
        if (this.progressCallback_ !== null) {
          this.progressCallback_(loaded, total);
        }
      };
      if (this.progressCallback_ !== null) {
        connection.addUploadProgressListener(progressListener);
      }
      connection.send(this.url_, this.method_, this.isUsingEmulator, this.body_, this.headers_).then(() => {
        if (this.progressCallback_ !== null) {
          connection.removeUploadProgressListener(progressListener);
        }
        this.pendingConnection_ = null;
        const hitServer = connection.getErrorCode() === ErrorCode.NO_ERROR;
        const status = connection.getStatus();
        if (!hitServer || isRetryStatusCode(status, this.additionalRetryCodes_) && this.retry) {
          const wasCanceled = connection.getErrorCode() === ErrorCode.ABORT;
          backoffCallback(false, new RequestEndStatus(false, null, wasCanceled));
          return;
        }
        const successCode = this.successCodes_.indexOf(status) !== -1;
        backoffCallback(true, new RequestEndStatus(successCode, connection));
      });
    };
    const backoffDone = (requestWentThrough, status) => {
      const resolve = this.resolve_;
      const reject = this.reject_;
      const connection = status.connection;
      if (status.wasSuccessCode) {
        try {
          const result = this.callback_(connection, connection.getResponse());
          if (isJustDef(result)) {
            resolve(result);
          } else {
            resolve();
          }
        } catch (e) {
          reject(e);
        }
      } else {
        if (connection !== null) {
          const err = unknown();
          err.serverResponse = connection.getErrorText();
          if (this.errorCallback_) {
            reject(this.errorCallback_(connection, err));
          } else {
            reject(err);
          }
        } else {
          if (status.canceled) {
            const err = this.appDelete_ ? appDeleted() : canceled();
            reject(err);
          } else {
            const err = retryLimitExceeded();
            reject(err);
          }
        }
      }
    };
    if (this.canceled_) {
      backoffDone(false, new RequestEndStatus(false, null, true));
    } else {
      this.backoffId_ = start(doTheRequest, backoffDone, this.timeout_);
    }
  }
  /** @inheritDoc */
  getPromise() {
    return this.promise_;
  }
  /** @inheritDoc */
  cancel(appDelete) {
    this.canceled_ = true;
    this.appDelete_ = appDelete || false;
    if (this.backoffId_ !== null) {
      stop(this.backoffId_);
    }
    if (this.pendingConnection_ !== null) {
      this.pendingConnection_.abort();
    }
  }
}
class RequestEndStatus {
  constructor(wasSuccessCode, connection, canceled2) {
    this.wasSuccessCode = wasSuccessCode;
    this.connection = connection;
    this.canceled = !!canceled2;
  }
}
function addAuthHeader_(headers, authToken) {
  if (authToken !== null && authToken.length > 0) {
    headers["Authorization"] = "Firebase " + authToken;
  }
}
function addVersionHeader_(headers, firebaseVersion) {
  headers["X-Firebase-Storage-Version"] = "webjs/" + (firebaseVersion ?? "AppManager");
}
function addGmpidHeader_(headers, appId) {
  if (appId) {
    headers["X-Firebase-GMPID"] = appId;
  }
}
function addAppCheckHeader_(headers, appCheckToken) {
  if (appCheckToken !== null) {
    headers["X-Firebase-AppCheck"] = appCheckToken;
  }
}
function makeRequest(requestInfo, appId, authToken, appCheckToken, requestFactory, firebaseVersion, retry = true, isUsingEmulator = false) {
  const queryPart = makeQueryString(requestInfo.urlParams);
  const url = requestInfo.url + queryPart;
  const headers = Object.assign({}, requestInfo.headers);
  addGmpidHeader_(headers, appId);
  addAuthHeader_(headers, authToken);
  addVersionHeader_(headers, firebaseVersion);
  addAppCheckHeader_(headers, appCheckToken);
  return new NetworkRequest(url, requestInfo.method, headers, requestInfo.body, requestInfo.successCodes, requestInfo.additionalRetryCodes, requestInfo.handler, requestInfo.errorHandler, requestInfo.timeout, requestInfo.progressCallback, requestFactory, retry, isUsingEmulator);
}
function parent(path) {
  if (path.length === 0) {
    return null;
  }
  const index = path.lastIndexOf("/");
  if (index === -1) {
    return "";
  }
  const newPath = path.slice(0, index);
  return newPath;
}
function lastComponent(path) {
  const index = path.lastIndexOf("/", path.length - 2);
  if (index === -1) {
    return path;
  } else {
    return path.slice(index + 1);
  }
}
class Reference {
  constructor(_service, location) {
    this._service = _service;
    if (location instanceof Location) {
      this._location = location;
    } else {
      this._location = Location.makeFromUrl(location, _service.host);
    }
  }
  /**
   * Returns the URL for the bucket and path this object references,
   *     in the form gs://<bucket>/<object-path>
   * @override
   */
  toString() {
    return "gs://" + this._location.bucket + "/" + this._location.path;
  }
  _newRef(service, location) {
    return new Reference(service, location);
  }
  /**
   * A reference to the root of this object's bucket.
   */
  get root() {
    const location = new Location(this._location.bucket, "");
    return this._newRef(this._service, location);
  }
  /**
   * The name of the bucket containing this reference's object.
   */
  get bucket() {
    return this._location.bucket;
  }
  /**
   * The full path of this object.
   */
  get fullPath() {
    return this._location.path;
  }
  /**
   * The short name of this object, which is the last component of the full path.
   * For example, if fullPath is 'full/path/image.png', name is 'image.png'.
   */
  get name() {
    return lastComponent(this._location.path);
  }
  /**
   * The `StorageService` instance this `StorageReference` is associated with.
   */
  get storage() {
    return this._service;
  }
  /**
   * A `StorageReference` pointing to the parent location of this `StorageReference`, or null if
   * this reference is the root.
   */
  get parent() {
    const newPath = parent(this._location.path);
    if (newPath === null) {
      return null;
    }
    const location = new Location(this._location.bucket, newPath);
    return new Reference(this._service, location);
  }
  /**
   * Utility function to throw an error in methods that do not accept a root reference.
   */
  _throwIfRoot(name2) {
    if (this._location.path === "") {
      throw invalidRootOperation(name2);
    }
  }
}
function extractBucket(host, config) {
  const bucketString = config?.[CONFIG_STORAGE_BUCKET_KEY];
  if (bucketString == null) {
    return null;
  }
  return Location.makeFromBucketSpec(bucketString, host);
}
function connectStorageEmulator$1(storage, host, port, options = {}) {
  storage.host = `${host}:${port}`;
  const useSsl = isCloudWorkstation(host);
  if (useSsl) {
    void pingServer(`https://${storage.host}/b`);
  }
  storage._isUsingEmulator = true;
  storage._protocol = useSsl ? "https" : "http";
  const { mockUserToken } = options;
  if (mockUserToken) {
    storage._overrideAuthToken = typeof mockUserToken === "string" ? mockUserToken : createMockUserToken(mockUserToken, storage.app.options.projectId);
  }
}
class FirebaseStorageImpl {
  constructor(app, _authProvider, _appCheckProvider, _url, _firebaseVersion, _isUsingEmulator = false) {
    this.app = app;
    this._authProvider = _authProvider;
    this._appCheckProvider = _appCheckProvider;
    this._url = _url;
    this._firebaseVersion = _firebaseVersion;
    this._isUsingEmulator = _isUsingEmulator;
    this._bucket = null;
    this._host = DEFAULT_HOST;
    this._protocol = "https";
    this._appId = null;
    this._deleted = false;
    this._maxOperationRetryTime = DEFAULT_MAX_OPERATION_RETRY_TIME;
    this._maxUploadRetryTime = DEFAULT_MAX_UPLOAD_RETRY_TIME;
    this._requests = /* @__PURE__ */ new Set();
    if (_url != null) {
      this._bucket = Location.makeFromBucketSpec(_url, this._host);
    } else {
      this._bucket = extractBucket(this._host, this.app.options);
    }
  }
  /**
   * The host string for this service, in the form of `host` or
   * `host:port`.
   */
  get host() {
    return this._host;
  }
  set host(host) {
    this._host = host;
    if (this._url != null) {
      this._bucket = Location.makeFromBucketSpec(this._url, host);
    } else {
      this._bucket = extractBucket(host, this.app.options);
    }
  }
  /**
   * The maximum time to retry uploads in milliseconds.
   */
  get maxUploadRetryTime() {
    return this._maxUploadRetryTime;
  }
  set maxUploadRetryTime(time) {
    validateNumber(
      "time",
      /* minValue=*/
      0,
      /* maxValue= */
      Number.POSITIVE_INFINITY,
      time
    );
    this._maxUploadRetryTime = time;
  }
  /**
   * The maximum time to retry operations other than uploads or downloads in
   * milliseconds.
   */
  get maxOperationRetryTime() {
    return this._maxOperationRetryTime;
  }
  set maxOperationRetryTime(time) {
    validateNumber(
      "time",
      /* minValue=*/
      0,
      /* maxValue= */
      Number.POSITIVE_INFINITY,
      time
    );
    this._maxOperationRetryTime = time;
  }
  async _getAuthToken() {
    if (this._overrideAuthToken) {
      return this._overrideAuthToken;
    }
    const auth = this._authProvider.getImmediate({ optional: true });
    if (auth) {
      const tokenData = await auth.getToken();
      if (tokenData !== null) {
        return tokenData.accessToken;
      }
    }
    return null;
  }
  async _getAppCheckToken() {
    if (_isFirebaseServerApp(this.app) && this.app.settings.appCheckToken) {
      return this.app.settings.appCheckToken;
    }
    const appCheck = this._appCheckProvider.getImmediate({ optional: true });
    if (appCheck) {
      const result = await appCheck.getToken();
      return result.token;
    }
    return null;
  }
  /**
   * Stop running requests and prevent more from being created.
   */
  _delete() {
    if (!this._deleted) {
      this._deleted = true;
      this._requests.forEach((request) => request.cancel());
      this._requests.clear();
    }
    return Promise.resolve();
  }
  /**
   * Returns a new firebaseStorage.Reference object referencing this StorageService
   * at the given Location.
   */
  _makeStorageReference(loc) {
    return new Reference(this, loc);
  }
  /**
   * @param requestInfo - HTTP RequestInfo object
   * @param authToken - Firebase auth token
   */
  _makeRequest(requestInfo, requestFactory, authToken, appCheckToken, retry = true) {
    if (!this._deleted) {
      const request = makeRequest(requestInfo, this._appId, authToken, appCheckToken, requestFactory, this._firebaseVersion, retry, this._isUsingEmulator);
      this._requests.add(request);
      request.getPromise().then(() => this._requests.delete(request), () => this._requests.delete(request));
      return request;
    } else {
      return new FailRequest(appDeleted());
    }
  }
  async makeRequestWithTokens(requestInfo, requestFactory) {
    const [authToken, appCheckToken] = await Promise.all([
      this._getAuthToken(),
      this._getAppCheckToken()
    ]);
    return this._makeRequest(requestInfo, requestFactory, authToken, appCheckToken).getPromise();
  }
}
const name = "@firebase/storage";
const version = "0.14.3";
const STORAGE_TYPE = "storage";
function getStorage(app = getApp(), bucketUrl) {
  app = getModularInstance(app);
  const storageProvider = _getProvider(app, STORAGE_TYPE);
  const storageInstance = storageProvider.getImmediate({
    identifier: bucketUrl
  });
  const emulator = getDefaultEmulatorHostnameAndPort("storage");
  if (emulator) {
    connectStorageEmulator(storageInstance, ...emulator);
  }
  return storageInstance;
}
function connectStorageEmulator(storage, host, port, options = {}) {
  connectStorageEmulator$1(storage, host, port, options);
}
function factory(container, { instanceIdentifier: url }) {
  const app = container.getProvider("app").getImmediate();
  const authProvider = container.getProvider("auth-internal");
  const appCheckProvider = container.getProvider("app-check-internal");
  return new FirebaseStorageImpl(app, authProvider, appCheckProvider, url, SDK_VERSION);
}
function registerStorage() {
  _registerComponent(new Component(
    STORAGE_TYPE,
    factory,
    "PUBLIC"
    /* ComponentType.PUBLIC */
  ).setMultipleInstances(true));
  registerVersion(name, version);
}
registerStorage();
export {
  getStorage as g
};
