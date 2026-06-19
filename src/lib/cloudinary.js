// Subida de imágenes a Cloudinary (unsigned upload).
// No expone API secret: usa un "upload preset" configurado como unsigned en Cloudinary.
// Settings → Upload → Upload presets → Add → Signing Mode: Unsigned.

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Sube un archivo a Cloudinary y devuelve la URL segura (https).
 * @param {File} file
 * @param {string} [folder] carpeta destino en Cloudinary (ej. 'products', 'categories')
 * @returns {Promise<string>} secure_url
 */
export async function uploadToCloudinary(file, folder = '') {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary no configurado (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  if (folder) formData.append('folder', folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok || !data.secure_url) {
    throw new Error(data.error?.message || 'Error al subir imagen a Cloudinary');
  }
  return data.secure_url;
}

/**
 * Sube varios archivos en paralelo. Devuelve array de URLs en el mismo orden.
 */
export async function uploadManyToCloudinary(files, folder = '') {
  return Promise.all(Array.from(files).map((f) => uploadToCloudinary(f, folder)));
}
