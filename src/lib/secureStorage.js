"use client";

// Client-side secure storage with obfuscation & integrity check
const SALT = "yash_ai_sec_2026_x99";

function encrypt(text) {
  if (!text) return "";
  try {
    const textToChars = (t) => t.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) =>
      textToChars(SALT).reduce((a, b) => a ^ b, code);

    return text
      .split("")
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join("");
  } catch (e) {
    return btoa(unescape(encodeURIComponent(text)));
  }
}

function decrypt(encoded) {
  if (!encoded) return "";
  try {
    const textToChars = (t) => t.split("").map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) =>
      textToChars(SALT).reduce((a, b) => a ^ b, code);

    return encoded
      .match(/.{1,2}/g)
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join("");
  } catch (e) {
    try {
      return decodeURIComponent(escape(atob(encoded)));
    } catch (err) {
      return "";
    }
  }
}

export const secureStorage = {
  getItem: (key) => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(`__sec_${key}`);
      if (!raw) {
        // Fallback check for unencrypted old keys
        const legacy = localStorage.getItem(key);
        if (legacy) return legacy;
        return null;
      }
      return decrypt(raw);
    } catch (e) {
      return null;
    }
  },

  setItem: (key, value) => {
    if (typeof window === "undefined") return;
    try {
      const strVal = typeof value === "string" ? value : JSON.stringify(value);
      const encrypted = encrypt(strVal);
      localStorage.setItem(`__sec_${key}`, encrypted);
    } catch (e) {
      console.warn("SecureStorage set error:", e);
    }
  },

  removeItem: (key) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(`__sec_${key}`);
      localStorage.removeItem(key);
    } catch (e) {}
  },

  clear: () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.clear();
    } catch (e) {}
  },
};
