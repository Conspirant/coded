import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Construction, Clock, Calculator } from "lucide-react"

const FeeCalculator = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Fee Calculator</h1>
        <p className="text-muted-foreground">Estimate your annual cost across colleges and categories</p>
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
            The Fee Calculator will help you estimate the total cost of education across different 
            colleges and categories, including tuition fees, hostel charges, and other expenses.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default FeeCalculator