import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Construction, Clock, Scale } from "lucide-react"

const CollegeCompare = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">College Compare</h1>
        <p className="text-muted-foreground">Contrast colleges side-by-side with cutoffs, fees, and ratings</p>
      </div>

      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Construction className="h-5 w-5" />
            Under Development
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-orange-800">
            <Clock className="h-5 w-5" />
            <p className="font-medium">This feature is currently under development and will be rolling out soon.</p>
          </div>
          <p className="text-sm text-orange-700">
            College Compare will allow you to compare multiple colleges side-by-side with detailed 
            information about cutoffs, fees, placements, and other important factors.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default CollegeCompare