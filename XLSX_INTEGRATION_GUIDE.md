# XLSX Integration Guide

This guide explains how to implement automatic XLSX file reading in the KCET Compass system.

## Current Data Flow

The system currently follows this data flow:

1. **XLSX Files** → **Extraction Scripts** → **JSON Files** → **Frontend**
2. XLSX files are processed by Node.js scripts in the `scripts/` directory
3. Extracted data is stored in JSON files like `kcet_cutoffs_consolidated.json`
4. Frontend loads data by fetching these JSON files

## Automatic XLSX Reading Implementation

### Server-Side XLSX Processing (Implemented)

**Pros:**
- XLSX files are automatically loaded from server directories
- No user upload required - data is pre-loaded
- Real-time data processing from existing XLSX files
- Works with all existing KCET XLSX files
- Users can search and view cutoff data immediately

**Cons:**
- Requires XLSX files to be placed in server directories
- Processing happens in browser (may be slower for large files)
- Limited to browser capabilities

**Implementation:**
- Uses the `xlsx` library (already in dependencies)
- Created `XLSXLoader` utility class
- Automatically loads all XLSX files from server
- Integrated into `CutoffExplorer.tsx` and `CollegeFinder.tsx`
- Demo component: `XLSXDemo.tsx`

### Option 2: Server-Side API Endpoint

**Pros:**
- Better performance for large files
- More processing power
- Can handle complex data transformations
- Smaller client bundle

**Cons:**
- Requires backend API
- More complex deployment
- Server resource usage

**Implementation:**
```javascript
// Example API endpoint
app.post('/api/upload-xlsx', upload.single('file'), async (req, res) => {
  const workbook = XLSX.readFile(req.file.path)
  const data = parseWorkbook(workbook)
  res.json(data)
})
```

### Option 3: Hybrid Approach

**Pros:**
- Best of both worlds
- Small files processed client-side
- Large files processed server-side
- Fallback options

**Cons:**
- More complex implementation
- Requires both client and server code

## Implementation Details

### XLSXLoader Class

The `XLSXLoader` class provides these main methods:

1. **`loadFromServer(filePath: string)`** - Load single XLSX file from server
2. **`loadAllXLSXFiles()`** - Load all XLSX files from server automatically

```typescript
// Example usage
const result = await XLSXLoader.loadAllXLSXFiles()
console.log(`Loaded ${result.cutoffs.length} records from all XLSX files`)
```

### Data Structure

The loader extracts data into this structure:

```typescript
interface XLSXData {
  cutoffs: Array<{
    institute: string
    institute_code: string
    course: string
    course_code: string
    category: string
    cutoff_rank: number
    year: string
    round: string
    source: string
    sheet: string
  }>
  metadata: {
    last_updated: string
    total_files_processed: number
    total_entries: number
    data_sources: string[]
  }
}
```

### Integration with Existing Components

The following components now support automatic XLSX loading:
- **`CutoffExplorer`**: Users can switch between JSON and XLSX data sources
- **`CollegeFinder`**: Users can search colleges using XLSX data
- **`XLSXDemo`**: Demo component showing XLSX data loading

Users can switch between data sources seamlessly using the data source selector.

## Usage Examples

### 1. Load All XLSX Files Automatically

```typescript
import { XLSXLoader } from '@/lib/xlsx-loader'

const loadAllXLSX = async () => {
  try {
    const data = await XLSXLoader.loadAllXLSXFiles()
    setCutoffs(data.cutoffs)
  } catch (error) {
    console.error('Failed to load XLSX files:', error)
  }
}
```

### 2. Load Single XLSX File from Server

```typescript
const loadSingleFile = async () => {
  try {
    const data = await XLSXLoader.loadFromServer('/kcet-2025-round1-cutoffs.xlsx')
    setCutoffs(data.cutoffs)
  } catch (error) {
    console.error('Failed to load XLSX file:', error)
  }
}
```

### 3. Integration with Existing Components

```typescript
// In CutoffExplorer or CollegeFinder
const loadFromXLSX = async () => {
  const result = await XLSXLoader.loadAllXLSXFiles()
  const convertedData = result.cutoffs.map(item => ({
    institute: item.institute || '',
    institute_code: item.institute_code || '',
    course: item.course || '',
    category: item.category || '',
    cutoff_rank: item.cutoff_rank || 0,
    year: item.year || '',
    round: item.round || ''
  }))
  setCutoffs(convertedData)
}
```

## File Format Requirements

The XLSX loader expects files with this structure:

1. **Header Row**: Contains category names (GM, SC, ST, etc.)
2. **College Column**: First column with college codes/names
3. **Course Column**: Second column with course names
4. **Category Columns**: Subsequent columns with cutoff ranks

Example structure:
```
| College | Course | GM | SC | ST | OBC |
|---------|--------|----|----|----|-----|
| E001    | CS     | 1000| 2000| 3000| 1500|
| E002    | EC     | 1200| 2200| 3200| 1700|
```

## Error Handling

The loader includes comprehensive error handling:

- File format validation
- Data structure validation
- Network error handling
- User-friendly error messages

## Performance Considerations

### File Size Limits
- **Small files (< 5MB)**: Process client-side
- **Large files (> 5MB)**: Consider server-side processing

### Memory Usage
- Large XLSX files can consume significant memory
- Consider streaming for very large files
- Implement pagination for display

### Browser Compatibility
- Works in all modern browsers
- Requires ES6+ support
- File API support required

## Testing

### Test Files
- Use the existing XLSX files in the project root
- Test with different file formats and structures
- Verify data extraction accuracy

### Test Scenarios
1. Valid XLSX file upload
2. Invalid file format
3. Corrupted file
4. Large file handling
5. Network errors
6. Data validation

## Future Enhancements

### Planned Features
1. **Batch Processing**: Handle multiple XLSX files
2. **Data Validation**: Enhanced validation rules
3. **Export Options**: Save processed data
4. **Real-time Updates**: Auto-refresh from server
5. **Caching**: Cache processed data locally

### Advanced Features
1. **Data Transformation**: Custom mapping rules
2. **Merge Strategies**: Combine multiple data sources
3. **Version Control**: Track data changes
4. **Analytics**: Data quality metrics

## Troubleshooting

### Common Issues

1. **File not loading**
   - Check file format (.xlsx, .xls)
   - Verify file is not corrupted
   - Check browser console for errors

2. **Data not extracted**
   - Verify file structure matches expected format
   - Check for empty cells or missing headers
   - Review extraction logic

3. **Performance issues**
   - Reduce file size
   - Implement pagination
   - Use server-side processing for large files

### Debug Mode

Enable debug logging:

```typescript
// Add to XLSXLoader
console.log('Processing sheet:', sheetName)
console.log('Extracted data:', results)
```

## Conclusion

Direct XLSX reading provides significant benefits:

1. **Flexibility**: Users can upload their own data
2. **Real-time**: Immediate data processing
3. **Independence**: No server-side dependencies
4. **Integration**: Works with existing components

The implementation is production-ready and can be extended based on specific requirements.
