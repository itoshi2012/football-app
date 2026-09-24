import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

// Firestore documents are capped at ~1MB, and we're using Firestore instead of
// Firebase Storage (Storage requires the paid Blaze plan). To keep photos safely
// small, every picked image is resized down and re-compressed as JPEG before
// being turned into a base64 data URI that gets saved straight on the player doc.
export async function pickAndCompressPlayerPhoto() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error("PERMISSION_DENIED");
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
    allowsEditing: true,
    aspect: [4, 5],
  });

  if (result.canceled || !result.assets?.length) return null;

  const manipulated = await ImageManipulator.manipulateAsync(
    result.assets[0].uri,
    [{ resize: { width: 480 } }],
    { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG, base64: true }
  );

  return `data:image/jpeg;base64,${manipulated.base64}`;
}
