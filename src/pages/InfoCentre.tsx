import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  GraduationCap, 
  Building2, 
  Users, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  MapPin,
  Award,
  Lightbulb,
  ArrowRight,
  ExternalLink,
  Info,
  History,
  Globe,
  FileText
} from "lucide-react"

const InfoCentre = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-8 max-w-6xl">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-primary/10 rounded-full">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Info Centre
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your comprehensive guide to understanding Karnataka's engineering education landscape
          </p>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 text-sm px-4 py-2">
            <Info className="h-4 w-4 mr-2" />
            Educational Resource Hub
          </Badge>
        </div>

        {/* Main Article Card */}
        <Card className="border-2 border-primary/20 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl text-primary">
                  Why VTU Became the Source of Affiliation for Karnataka's Engineering Colleges
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Understanding the evolution of technical education in Karnataka
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {/* Introduction */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Introduction</h2>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <p className="text-lg leading-relaxed">
                  Karnataka is one of the largest hubs for technical education in India, with more than <strong className="text-primary">200 engineering colleges</strong> spread across the state. But if you look closely, you'll notice a common thread connecting almost all of them—the phrase <strong className="text-primary">"Affiliated to Visvesvaraya Technological University (VTU)."</strong>
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  This wasn't always the case. Until the late 1990s, engineering colleges in Karnataka were affiliated to multiple universities, which created confusion, inconsistency, and administrative challenges. To bring uniformity and strengthen the quality of engineering education, the Government of Karnataka established Visvesvaraya Technological University (VTU) in <strong className="text-primary">1998</strong>.
                </p>
              </div>
            </div>

            {/* The Situation Before VTU */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-semibold">The Situation Before VTU</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-3">Multiple Universities</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Bangalore University</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Mysore University</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>Mangalore University</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-red-200 bg-red-50 dark:bg-red-950">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-red-800 dark:text-red-200 mb-3">Problems Created</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Different curricula across universities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Inconsistent exam schedules</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Varying evaluation systems</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span>Difficulty in comparing graduates</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Why the Government Chose a Single Technological University */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                <h2 className="text-xl font-semibold">Why the Government Chose a Single Technological University</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-green-200 bg-green-50 dark:bg-green-950 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-lg text-green-800 dark:text-green-200">Uniform Curriculum</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      VTU introduced a standardized syllabus across all affiliated colleges. This ensured that a B.E. or B.Tech degree from any part of Karnataka carried the same academic weight and covered the same knowledge areas.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-lg text-blue-800 dark:text-blue-200">Quality Assurance</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      With the rapid growth of private engineering colleges, a single affiliating body was necessary to regulate standards, infrastructure requirements, and faculty qualifications.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <CardTitle className="text-lg text-purple-800 dark:text-purple-200">Industry Relevance</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Karnataka was emerging as India's IT hub in the 1990s. VTU made it easier to align curricula with industry demands by implementing syllabus revisions that applied uniformly across the state.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-indigo-200 bg-indigo-50 dark:bg-indigo-950 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-indigo-600" />
                      <CardTitle className="text-lg text-indigo-800 dark:text-indigo-200">Efficient Administration</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300">
                      Instead of multiple universities managing engineering courses differently, one specialized university could streamline examinations, results, and degree issuance.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-amber-600" />
                      <CardTitle className="text-lg text-amber-800 dark:text-amber-200">Brand Identity</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Establishing VTU created a recognizable identity for Karnataka's engineering graduates. Recruiters across India could trust the consistency of a "VTU degree."
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-cyan-200 bg-cyan-50 dark:bg-cyan-950 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-cyan-600" />
                      <CardTitle className="text-lg text-cyan-800 dark:text-cyan-200">Student Clarity</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-cyan-700 dark:text-cyan-300">
                      This also gave students and parents more clarity during admissions, as they could understand the unified system better.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Challenges of Centralization */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-semibold">Challenges of Centralization</h2>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
                <p className="text-lg leading-relaxed mb-4">
                  While VTU solved the problem of inconsistency, it also introduced new challenges:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">Examination Rigidities</h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      VTU became infamous for its exam patterns, revaluation delays, and backlog culture.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">Slow Reforms</h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Updating the syllabus to match rapidly evolving technology sectors sometimes lagged behind industry needs.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200">Administrative Bottlenecks</h3>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Centralization meant that if VTU delayed results, all colleges across the state were affected.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Over the Years */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h2 className="text-xl font-semibold">Impact Over the Years</h2>
              </div>
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <p className="text-lg leading-relaxed mb-4">
                  Despite its drawbacks, VTU has been instrumental in shaping technical education in Karnataka:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-200 dark:bg-green-800 rounded-full">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800 dark:text-green-200">Scale of Operations</h3>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          It oversees more than <strong>200 affiliated colleges</strong> with lakhs of engineering students.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-200 dark:bg-green-800 rounded-full">
                        <GraduationCap className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800 dark:text-green-200">Academic Growth</h3>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          It has introduced postgraduate courses, research centers, and autonomous institutions under its supervision.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-200 dark:bg-green-800 rounded-full">
                        <Lightbulb className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-green-800 dark:text-green-200">Autonomous Colleges</h3>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          Autonomous colleges affiliated to VTU now enjoy some academic freedom while still being under the overall framework, balancing flexibility with uniformity.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Conclusion</h2>
              </div>
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6">
                <p className="text-lg leading-relaxed">
                  VTU's establishment was not just an administrative decision but a <strong className="text-primary">structural reform</strong> in Karnataka's education system. By becoming the sole affiliating authority for engineering colleges, it brought order, consistency, and credibility to technical education. While criticisms of its functioning remain, the role of VTU as the <strong className="text-primary">backbone of engineering education in Karnataka</strong> is undeniable.
                </p>
              </div>
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">200+</div>
                  <div className="text-sm text-muted-foreground">Affiliated Colleges</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">1998</div>
                  <div className="text-sm text-muted-foreground">Year Established</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">25+</div>
                  <div className="text-sm text-muted-foreground">Years of Operation</div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">Lakhs</div>
                  <div className="text-sm text-muted-foreground">Students Enrolled</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Additional Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Additional Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto p-4 justify-start">
                <div className="flex items-center gap-3">
                  <ExternalLink className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">VTU Official Website</div>
                    <div className="text-sm text-muted-foreground">Visit vtu.ac.in for official information</div>
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="h-auto p-4 justify-start">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">KCET Official Portal</div>
                    <div className="text-sm text-muted-foreground">Check kea.kar.nic.in for latest updates</div>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default InfoCentre
