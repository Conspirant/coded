import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, CheckCircle, AlertCircle, Copy, FileCheck, AlertTriangle, TriangleAlert } from "lucide-react"

const Documents = () => {
  const documentCategories = [
    {
      title: "Essential Academic Documents",
      documents: [
        {
          name: "SSLC/10th Standard Marks Card",
          type: "Original + Copies",
          copies: 4,
          description: "Original marks card or equivalent certificate + 3 copies (may vary college to college) + 1 for own reference",
          required: true
        },
        {
          name: "2nd PUC/12th Standard Marks Card",
          type: "Original + Copies",
          copies: 4,
          description: "Original marks card or equivalent certificate + 3 copies (may vary college to college) + 1 for own reference",
          required: true
        },
        {
          name: "10th Standard Study Certificate",
          type: "Original + Copies",
          copies: 4,
          description: "Study certificate from 10th standard institution + 3 copies (may vary college to college) + 1 for own reference",
          required: true
        },
        {
          name: "12th Standard Study Certificate",
          type: "Original + Copies",
          copies: 4,
          description: "Must include SSLC or 2nd PUC/12th std details, combined into single PDF + 3 copies (may vary college to college) + 1 for own reference",
          required: true
        },
        {
          name: "12th Standard Transfer Certificate",
          type: "Original + Copies",
          copies: 4,
          description: "Transfer certificate from the last institution attended + 3 copies (may vary college to college) + 1 for own reference",
          required: true
        }
      ]
    },
    {
      title: "KCET/NEET Related Documents",
      documents: [
        {
          name: "KEA UGCET/UG-NEET 2025 Verification Slip",
          type: "Copy",
          copies: 4,
          description: "Official verification slip from KEA + 3 copies (may vary college to college) + 1 for own reference",
          required: true
        },
        {
          name: "KEA UGCET/UG-NEET 2025 Online Application Form",
          type: "Copy",
          copies: 4,
          description: "Complete online application form + 3 copies (may vary college to college) + 1 for own reference",
          required: true
        },
        {
          name: "CET/NEET 2025 Admission Ticket",
          type: "Copy",
          copies: 4,
          description: "Original admission ticket for the entrance exam + 3 copies (may vary college to college) + 1 for own reference",
          required: true
        },
        {
          name: "Confirmation Slip",
          type: "Copy",
          copies: 4,
          description: "Confirmation slip from the application process + 3 copies (may vary college to college) + 1 for own reference",
          required: true
        },
        {
          name: "Fee Receipt",
          type: "Original + Copies",
          copies: 4,
          description: "Original fee payment receipt + 3 copies (may vary college to college) + 1 for own reference",
          required: true
        }
      ]
    },
    {
      title: "Identity and Personal Documents",
      documents: [
        {
          name: "Photo Identity Proof",
          type: "Original + Copies",
          copies: 4,
          description: "PAN Card, Driving License, Voter ID, Passport, or Aadhaar Card + 3 copies (may vary college to college) + 1 for own reference",
          required: true
        },
        {
          name: "Aadhaar Card",
          type: "Copy",
          copies: 4,
          description: "Copy of Aadhaar card for verification + 3 copies (may vary college to college) + 1 for own reference",
          required: true
        },
        {
          name: "Passport Size Photos",
          type: "Original",
          copies: 8,
          description: "Recent passport size photographs (minimum 8 photos required)",
          required: true
        }
      ]
    },
    {
      title: "Reservation and Category Documents",
      documents: [
        {
          name: "Caste/Income Certificate",
          type: "Copy",
          copies: 4,
          description: "For SC/ST (Form-D), Cat-1 (Form-E), 2A, 2B, 3A & 3B (Form-F). Must be issued by concerned Tahsildar of Karnataka + 3 copies (may vary college to college) + 1 for own reference",
          required: false
        },
        {
          name: "Hyd-Karnataka / 371(j) Certificate",
          type: "Copy",
          copies: 4,
          description: "Certificate issued by competent authority for claiming reservation under 371(j) (Annexure-A) + 3 copies (may vary college to college) + 1 for own reference",
          required: false
        },
        {
          name: "Rural Certificate",
          type: "Copy",
          copies: 4,
          description: "For candidates claiming rural reservation benefits + 3 copies (may vary college to college) + 1 for own reference",
          required: false
        }
      ]
    }
  ]



  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
        <p className="text-foreground/70">Complete list of documents required for KCET/UG-NEET 2025 admission process.</p>
      </div>

      {/* Contact Dev Note */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <p className="font-medium">
            <strong>Missing a document?</strong> Please contact the developer if you notice any documents missing from this listing or if you require information about other documents not mentioned here. 
            It's crucial to ensure everyone has a clear picture of all required documentation.
          </p>
        </AlertDescription>
      </Alert>



      <div className="space-y-6">
        {documentCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="rounded-none border-2 shadow-[6px_6px_0_0_rgba(0,0,0,0.35)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,0.12)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {category.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {category.documents.map((doc, docIndex) => (
                  <div key={docIndex} className="flex items-start justify-between p-4 border rounded-lg bg-muted/30">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{doc.name}</h3>
                        {doc.required ? (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">If Applicable</Badge>
                        )}
                      </div>
                      <p className="text-sm text-foreground/70">{doc.description}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Copy className="h-4 w-4" />
                          {doc.type}
                        </div>
                        <div className="text-xs text-foreground/70">
                          {doc.copies} {doc.copies === 1 ? 'copy' : 'copies'}
                        </div>
                      </div>
                      {doc.required ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="rounded-none border-2 shadow-[6px_6px_0_0_rgba(0,0,0,0.35)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,0.12)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <TriangleAlert className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="font-bold text-red-800">4 COPIES OF EACH DOCUMENT (3 for submission + 1 for own reference)</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="font-semibold text-orange-800">IMPORTANT: This list might not include every possible academic document. Please cross-check with official sources and take ALL academic documents you have.</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p>All documents mentioned above must be arranged in the same order as listed</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Keep one complete set of copies in the same order for your records</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p>All original documents must be in good condition and clearly legible</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p>Category certificates must be issued by the competent authority in Karnataka</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p>Documents marked as "If Applicable" are only required if you belong to that specific category</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Documents


