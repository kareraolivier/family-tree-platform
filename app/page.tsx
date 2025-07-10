"use client"

import { FamilyTree } from "../components/FamilyTree"
import { useFamilyTree } from "../hooks/useFamilyTree"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function FamilyTreePlatform() {
  const { familyData, updatePerson, addChild, addSpouse } = useFamilyTree()

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Users className="w-6 h-6 mr-2" />
              Family Tree Platform
            </CardTitle>
            <p className="text-gray-600">
              Click on any family member to view their details. Use the buttons below each person to add children or
              spouses.
            </p>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-6">
            <FamilyTree
              familyData={familyData}
              onUpdatePerson={updatePerson}
              onAddChild={addChild}
              onAddSpouse={addSpouse}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
