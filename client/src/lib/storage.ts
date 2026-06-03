/**
 * storage.ts
 * Camada de armazenamento criptografado com Web Crypto API nativa.
 * Substitui todos os usos diretos de localStorage.getItem / setItem.
 * Sem dependências externas.
 */

const SALT_KEY = "__avb_salt__";
const KEY_MATERIAL = "avb-secure-storage-v1";

// ─── Geração / recuperação de chave ──────────────────────────────────────────

async function getDerivedKey(): Promise<CryptoKey> {
  let saltHex = localStorage.getItem(SALT_KEY);
  let salt: Uint8Array<ArrayBuffer>;

  if (saltHex) {
    salt = new Uint8Array(
      saltHex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16))
    );
  } else {
    salt = crypto.getRandomValues(new Uint8Array(16)) as Uint8Array<ArrayBuffer>;
    saltHex = Array.from(salt)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    localStorage.setItem(SALT_KEY, saltHex);
  }

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(KEY_MATERIAL),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100_000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// ─── Criptografia ─────────────────────────────────────────────────────────────

async function encrypt(plaintext: string): Promise<string> {
  const key = await getDerivedKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plaintext);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoded
  );
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.byteLength);
  return btoa(Array.from(combined).map(b => String.fromCharCode(b)).join(""));
}

async function decrypt(encoded: string): Promise<string> {
  const key = await getDerivedKey();
  const combined = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
}

// ─── API pública ──────────────────────────────────────────────────────────────

/**
 * Verifica se a Web Crypto API está disponível (requer HTTPS ou localhost).
 */
export function isCryptoAvailable(): boolean {
  return (
    typeof crypto !== "undefined" &&
    typeof crypto.subtle !== "undefined" &&
    typeof crypto.getRandomValues !== "undefined"
  );
}

/**
 * Salva um valor criptografado no localStorage.
 * @param key   Chave de armazenamento
 * @param value Qualquer valor serializável em JSON
 */
export async function saveEncrypted<T>(key: string, value: T): Promise<void> {
  try {
    const json = JSON.stringify(value);
    if (isCryptoAvailable()) {
      const encrypted = await encrypt(json);
      localStorage.setItem(key, encrypted);
    } else {
      // Fallback para ambientes sem HTTPS (desenvolvimento)
      localStorage.setItem(key, json);
    }
  } catch (err) {
    console.error("[storage] Falha ao salvar:", key, err);
  }
}

/**
 * Carrega e descriptografa um valor do localStorage.
 * Retorna `defaultValue` em caso de qualquer falha — sem quebrar a aplicação.
 * Suporta migração transparente de dados legados (não criptografados).
 * @param key          Chave de armazenamento
 * @param defaultValue Valor padrão caso a leitura falhe ou a chave não exista
 */
export async function loadEncrypted<T>(
  key: string,
  defaultValue: T
): Promise<T> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;

    if (isCryptoAvailable()) {
      // Tentativa 1: descriptografar (dados novos)
      try {
        const json = await decrypt(raw);
        return JSON.parse(json) as T;
      } catch {
        // Tentativa 2: JSON puro (dados legados — migração transparente)
        try {
          const parsed = JSON.parse(raw) as T;
          // Re-salva já criptografado para migrar o dado
          await saveEncrypted(key, parsed);
          return parsed;
        } catch {
          // Dado corrompido — limpa e usa padrão
          localStorage.removeItem(key);
          return defaultValue;
        }
      }
    } else {
      // Sem crypto: trata como JSON puro
      try {
        return JSON.parse(raw) as T;
      } catch {
        localStorage.removeItem(key);
        return defaultValue;
      }
    }
  } catch (err) {
    console.error("[storage] Falha ao carregar:", key, err);
    return defaultValue;
  }
}

/**
 * Remove um item do localStorage.
 */
export function removeItem(key: string): void {
  localStorage.removeItem(key);
}
