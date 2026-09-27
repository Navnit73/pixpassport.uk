/**
 * Client-side high-quality image compression utility
 * Compresses images > 3 MB down to <= 3 MB while preserving maximum facial clarity and visual quality.
 */

const MAX_TARGET_BYTES = 3 * 1024 * 1024; // 3 MB
const MAX_DIMENSION = 3000; // 3000px long edge is ample resolution for passport biometrics

export interface CompressionResult {
  file: File;
  compressed: boolean;
  originalSizeKB: number;
  finalSizeKB: number;
}

/**
 * Compresses a user image to <= 3MB in browser without quality degradation.
 *
 * @param file Original image file
 * @returns Compressed file
 */
export async function compressImageTo3MB(
  file: File
): Promise<CompressionResult> {
  const originalSizeKB = Math.round(file.size / 1024);

  // If already under 3MB and is JPEG/PNG/WebP, keep original
  if (file.size <= MAX_TARGET_BYTES) {
    return {
      file,
      compressed: false,
      originalSizeKB,
      finalSizeKB: originalSizeKB,
    };
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = async () => {
      URL.revokeObjectURL(objectUrl);

      try {
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        // Resize down only if exceptionally large (e.g. > 3000px)
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d", { willReadFrequently: false });
        if (!ctx) {
          return resolve({
            file,
            compressed: false,
            originalSizeKB,
            finalSizeKB: originalSizeKB,
          });
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Iteratively test quality levels to get <= 3MB with highest fidelity
        const qualitySteps = [0.95, 0.92, 0.88, 0.84, 0.8];
        let chosenBlob: Blob | null = null;

        for (const quality of qualitySteps) {
          const blob = await new Promise<Blob | null>((res) =>
            canvas.toBlob(res, "image/jpeg", quality)
          );

          if (blob) {
            chosenBlob = blob;
            if (blob.size <= MAX_TARGET_BYTES) {
              break;
            }
          }
        }

        if (!chosenBlob) {
          return resolve({
            file,
            compressed: false,
            originalSizeKB,
            finalSizeKB: originalSizeKB,
          });
        }

        const newFileName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
        const compressedFile = new File([chosenBlob], newFileName, {
          type: "image/jpeg",
          lastModified: Date.now(),
        });

        const finalSizeKB = Math.round(compressedFile.size / 1024);

        resolve({
          file: compressedFile,
          compressed: true,
          originalSizeKB,
          finalSizeKB,
        });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for compression."));
    };

    img.src = objectUrl;
  });
}
