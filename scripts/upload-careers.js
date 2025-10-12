import { database } from "../lib/firebase";
import { ref, set } from "firebase/database";
import careers from "../data/careers.json";

const uploadCareers = async () => {
  try {
    const careersRef = ref(database, "careers");
    await set(careersRef, careers);
    console.log("Careers data uploaded successfully.");
  } catch (error) {
    console.error("Error uploading careers data:", error);
  }
};

uploadCareers();