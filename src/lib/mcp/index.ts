import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchColleges from "./tools/search-colleges";
import searchScholarships from "./tools/search-scholarships";
import listSavedItems from "./tools/list-saved-items";
import saveCollege from "./tools/save-college";
import saveScholarship from "./tools/save-scholarship";
import saveCareer from "./tools/save-career";

const projectRef = import.meta.env["VITE_SUPABASE_PROJECT_ID"] ?? "project-ref-unset";

export default defineMcp({
  name: "futurepath-ai-06",
  title: "FuturePath AI (06)",
  version: "0.1.0",
  instructions:
    "Career guidance tools for FuturePath AI. Search India's college directory and scholarship hub, and read or update the signed-in student's saved careers, colleges and scholarships.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchColleges, searchScholarships, listSavedItems, saveCollege, saveScholarship, saveCareer],
});
