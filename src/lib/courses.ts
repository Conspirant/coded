export type Course = { code: string; name: string };

// These are now loaded dynamically from kcet_cutoffs.json (consolidated data)
// Keeping this file for backward compatibility and type definitions
export const COURSES: Course[] = [];

export const COURSE_CODE_TO_NAME: Record<string, string> = {};

export const COURSE_NAME_TO_CODE: Record<string, string> = {};

// Function to get course display name (can be used for formatting)
export const getCourseDisplayName = (courseName: string): string => {
  return courseName || 'Unknown Course';
};

// Function to get course code from name (if needed)
export const getCourseCode = (courseName: string): string => {
  // Extract first few characters as code for display purposes
  const words = courseName.split(' ');
  if (words.length >= 2) {
    return words.slice(0, 2).map(word => word.charAt(0)).join('').toUpperCase();
  }
  return courseName.substring(0, 3).toUpperCase();
};


