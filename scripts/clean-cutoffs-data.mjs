import fs from 'fs';
import path from 'path';

// Function to clean institute names by removing duplicates and standardizing format
function cleanInstituteName(name) {
  if (!name) return name;
  
  // Remove common prefixes and suffixes
  let cleaned = name
    .replace(/^E\d+\s*-\s*College:\s*/, '') // Remove "E001 - College:" prefix
    .replace(/^E\d+\s*-\s*/, '') // Remove "E001 - " prefix
    .replace(/\s*\([^)]*\)\s*$/, '') // Remove trailing parentheses
    .replace(/\s*\([^)]*\)\s*/, ' ') // Remove middle parentheses
    .trim();
  
  return cleaned;
}

// Function to extract institute code from name
function extractInstituteCode(name) {
  const match = name.match(/^E(\d+)/);
  return match ? `E${match[1]}` : null;
}

// Function to standardize course names
function standardizeCourseName(course) {
  if (!course) return course;
  
  // Common course name mappings
  const courseMappings = {
    'Aero Space\nEngg.': 'Aerospace Engineering',
    'Aero Space Engineering': 'Aerospace Engineering',
    'Agriculture\nEngineering': 'Agriculture Engineering',
    'Artificial\nIntel, Data Sc': 'Artificial Intelligence',
    'Auto. And\nRobot.': 'Automobile Engineering',
    'Automotive\nEngg.': 'Automobile Engineering',
    'B Tech In\nAeronaut. Engg.': 'B.Tech Aeronautical Engineering',
    'B Tech In\nComp.Sc.Art.Int': 'B.Tech Computer Science (AI)',
    'B Tech In Ad': 'B.Tech Advertising',
    'B Tech In Aero Space Engineering': 'B.Tech Aerospace Engineering',
    'B Tech In Agricultural Engineering': 'B.Tech Agricultural Engineering',
    'B Tech In Aiml': 'B.Tech AI & ML',
    'B Tech In Am': 'B.Tech Applied Mechanics',
    'B Tech In As': 'B.Tech Applied Sciences',
    'B Tech In Bd': 'B.Tech Big Data',
    'B Tech In Bio- Technology': 'B.Tech Biotechnology',
    'B Tech In Bs': 'B.Tech Business Systems',
    'B Tech In Cc': 'B.Tech Cloud Computing',
    'B Tech In Cg': 'B.Tech Computer Graphics',
    'B Tech In Ci': 'B.Tech Computer Information',
    'B Tech In Co': 'B.Tech Computer Engineering',
    'B Tech In Computer Engineering': 'B.Tech Computer Engineering',
    'B Tech In Cy': 'B.Tech Cyber Security',
    'B Tech In Do': 'B.Tech Data Operations',
    'B Tech In Ds': 'B.Tech Data Science',
    'B Tech In Electronics & Computer Engineering': 'B.Tech Electronics & Computer Engineering',
    'B Tech In En': 'B.Tech Energy Engineering',
    'B Tech In Energy Engineering': 'B.Tech Energy Engineering',
    'B Tech In Eo': 'B.Tech Energy Operations',
    'B Tech In Ev': 'B.Tech Electric Vehicles',
    'B Tech In Ib': 'B.Tech Information Business',
    'B Tech In Information Technology': 'B.Tech Information Technology',
    'B Tech In Io': 'B.Tech Internet of Things',
    'B Tech In Iot': 'B.Tech Internet of Things',
    'B Tech In It': 'B.Tech Information Technology',
    'B Tech In Iy': 'B.Tech Information Systems',
    'B Tech In Lc': 'B.Tech Learning Computing',
    'B Tech In Mc': 'B.Tech Machine Computing',
    'B Tech In Mechatronics Engineering': 'B.Tech Mechatronics Engineering',
    'B Tech In Ms': 'B.Tech Management Systems',
    'B Tech In Pe': 'B.Tech Product Engineering',
    'B Tech In Ra': 'B.Tech Robotics & Automation',
    'B Tech In Rai': 'B.Tech Robotics & AI',
    'B Tech In Re': 'B.Tech Renewable Energy',
    'B Tech In Ro': 'B.Tech Robotics',
    'B Tech In Robotics And Automation': 'B.Tech Robotics & Automation',
    'B Tech In Ss': 'B.Tech Software Systems',
    'B.Tech In\nComp.Sci. Desi.': 'B.Tech Computer Science & Design',
    'B.Tech In\nIn.Tch.Dat.Anal': 'B.Tech Information Technology (Data Analytics)',
    'B.Tech In\nPharm. Engg.': 'B.Tech Pharmaceutical Engineering',
    'B.Tech In Computer Engineering(Sof Tware Product Development)': 'B.Tech Computer Engineering (Software Product Development)',
    'B.Tech In Electronics Engineering (Vlsi And Embedded System)': 'B.Tech Electronics Engineering (VLSI & Embedded Systems)',
    'B.Tech In Emd.\nSys. Vlsi': 'B.Tech Embedded Systems & VLSI',
    'B.Tech In Vlsi': 'B.Tech VLSI Design',
    'B.Tech(Agri.Engg)': 'B.Tech Agricultural Engineering',
    'B.Tech. In\nMech.Smar.Manu': 'B.Tech Mechanical Engineering (Smart Manufacturing)',
    'B.Tech.In\nInf.Tec.Aug.Rea': 'B.Tech Information Technology (AR/VR)',
    'B.Tehin\nCom.Sce.Eng(Robo)': 'B.Tech Computer Science Engineering (Robotics)',
    'Bio-Medical Engineering': 'Biomedical Engineering',
    'Biomed. And\nRobotic Engg': 'Biomedical & Robotic Engineering',
    'Btech In Electronics Engineering(Vlsi Design & Technology)': 'B.Tech Electronics Engineering (VLSI Design & Technology)',
    'Btech In Information Technology Augmented Reality And Virutal Reality(Ar/Vr)': 'B.Tech Information Technology (AR/VR)',
    'Btech In Information Technology Data Analytics': 'B.Tech Information Technology (Data Analytics)',
    'Btech In Pharmaceutical Engineering': 'B.Tech Pharmaceutical Engineering',
    'Comp. Sc. And\nBus Sys.': 'Computer Science & Business Systems',
    'Comp. Sc. Engg-\nData Sc.': 'Computer Science Engineering (Data Science)',
    'Comp. Sce.And\nEng(Art.Int)': 'Computer Science Engineering (Artificial Intelligence)',
    'Computer\nEngineering': 'Computer Engineering',
    'Computer\nScience And Tech': 'Computer Science & Technology',
    'Computer And\nComm. Engg.': 'Computer & Communication Engineering',
    'Computer Sc.\nAnd Design': 'Computer Science & Design',
    'Const. Tech.\nMgmt.': 'Construction Technology & Management',
    'Elec.\nTelecommn. Engg.': 'Electronics & Telecommunication Engineering',
    'Elec. Inst.\nEngg': 'Electrical Instrumentation Engineering',
    'Electrical And\nComputer': 'Electrical & Computer Engineering',
    'Electronics And\nComput': 'Electronics & Computer Engineering',
    'Electronics And\nComputer': 'Electronics & Computer Engineering',
    'Electronics And Telecommunicat Ion Engineering': 'Electronics & Telecommunication Engineering',
    'Electronics,\nInstr. Tech.': 'Electronics & Instrumentation Technology',
    'Engineering\nDesign': 'Engineering Design',
    'Ind.Prodn.': 'Industrial Production Engineering',
    'Info.Science': 'Information Science',
    'Information\nScience': 'Information Science',
    'Marine\nEngineering': 'Marine Engineering',
    'Mechatronics': 'Mechatronics Engineering',
    'Med.Elect.': 'Medical Electronics',
    'Mining\nEngineering': 'Mining Engineering',
    'Mn Mining\nEngineering': 'Mining Engineering',
    'Polymer Tech.': 'Polymer Technology',
    'Robotics And\nAutomation': 'Robotics & Automation',
    'Silk Tech.': 'Silk Technology',
    'Telecommn.': 'Telecommunication Engineering'
  };
  
  return courseMappings[course] || course;
}

// Function to clean and deduplicate the data
function cleanCutoffsData(data) {
  console.log('Starting data cleaning process...');
  
  // Create a map to track unique institutes
  const uniqueInstitutes = new Map();
  const cleanedCutoffs = [];
  
  // Process each cutoff entry
  data.cutoffs.forEach(entry => {
    const instituteCode = extractInstituteCode(entry.institute);
    const cleanedInstituteName = cleanInstituteName(entry.institute);
    const standardizedCourse = standardizeCourseName(entry.course);
    
    // Create a unique key for each institute
    const instituteKey = instituteCode || cleanedInstituteName;
    
    // If we haven't seen this institute before, add it to our map
    if (!uniqueInstitutes.has(instituteKey)) {
      uniqueInstitutes.set(instituteKey, {
        code: instituteCode,
        name: cleanedInstituteName,
        originalName: entry.institute
      });
    }
    
    // Add the cleaned entry
    cleanedCutoffs.push({
      institute: uniqueInstitutes.get(instituteKey).name,
      institute_code: instituteCode,
      course: standardizedCourse,
      category: entry.category,
      cutoff_rank: entry.cutoff_rank,
      year: entry.year,
      round: entry.round
    });
  });
  
  // Create cleaned unique institutes list
  const cleanedUniqueInstitutes = Array.from(uniqueInstitutes.values())
    .map(inst => inst.name)
    .filter(name => name && name !== 'Unknown Institute');
  
  // Create cleaned unique courses list
  const uniqueCourses = [...new Set(cleanedCutoffs.map(entry => entry.course))].sort();
  
  // Create cleaned unique categories list
  const uniqueCategories = [...new Set(cleanedCutoffs.map(entry => entry.course))].sort();
  
  // Create the cleaned data structure
  const cleanedData = {
    metadata: {
      extraction_date: new Date().toISOString(),
      total_entries: cleanedCutoffs.length,
      files_processed: data.metadata?.files_processed || 1,
      unique_courses: uniqueCourses,
      unique_institutes: cleanedUniqueInstitutes,
      categories: data.metadata?.categories || []
    },
    cutoffs: cleanedCutoffs
  };
  
  console.log(`Original entries: ${data.cutoffs.length}`);
  console.log(`Cleaned entries: ${cleanedCutoffs.length}`);
  console.log(`Original unique institutes: ${data.metadata?.unique_institutes?.length || 0}`);
  console.log(`Cleaned unique institutes: ${cleanedUniqueInstitutes.length}`);
  console.log(`Original unique courses: ${data.metadata?.unique_courses?.length || 0}`);
  console.log(`Cleaned unique courses: ${uniqueCourses.length}`);
  
  return cleanedData;
}

// Main execution
async function main() {
  try {
    console.log('Reading kcet_cutoffs_complete.json...');
    
    // Read the original file
    const originalData = JSON.parse(fs.readFileSync('kcet_cutoffs_complete.json', 'utf8'));
    
    console.log('Cleaning data...');
    const cleanedData = cleanCutoffsData(originalData);
    
    // Write the cleaned data back to the same file
    console.log('Writing cleaned data back to kcet_cutoffs_complete.json...');
    fs.writeFileSync('kcet_cutoffs_complete.json', JSON.stringify(cleanedData, null, 2));
    
    console.log('Data cleaning completed successfully!');
    console.log('File saved as: kcet_cutoffs_complete.json');
    
  } catch (error) {
    console.error('Error processing file:', error);
    process.exit(1);
  }
}

// Run the script
main();
