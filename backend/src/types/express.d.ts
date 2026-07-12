
import { LanguageServiceMode } from "typescript";

declare global {
  namespace Express {
    interface Request {
      userId: string; // Declares that userId can exist on Express Request globally
    }
  }
}