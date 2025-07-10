"use client"

import { useState } from "react"
import type { Person } from "../types/family"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar, Edit, Save, X } from "lucide-react"

interface PersonModalProps {
  person: Person | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (id: string, updates: Partial<Person>) => void
}

export function PersonModal({ person, isOpen, onClose, onUpdate }: PersonModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<Person>>({})

  if (!person) return null

  const handleEdit = () => {
    setEditData(person)
    setIsEditing(true)
  }

  const handleSave = () => {
    onUpdate(person.id, editData)
    setIsEditing(false)
    setEditData({})
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({})
  }

  const currentData = isEditing ? { ...person, ...editData } : person

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {currentData.name}
            {!isEditing ? (
              <Button onClick={handleEdit} size="sm" variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} size="sm" variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-center">
              <img
                src={currentData.profilePicture || "/placeholder.svg?height=120&width=120"}
                alt={currentData.name}
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-200"
              />
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={currentData.name}
                    onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="profilePicture">Profile Picture URL</Label>
                  <Input
                    id="profilePicture"
                    value={currentData.profilePicture || ""}
                    onChange={(e) => setEditData((prev) => ({ ...prev, profilePicture: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={currentData.gender}
                    onValueChange={(value) => setEditData((prev) => ({ ...prev, gender: value as Person["gender"] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p>
                  <strong>Gender:</strong> {currentData.gender}
                </p>
                {currentData.dateOfBirth && (
                  <p className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <strong>Born:</strong> {new Date(currentData.dateOfBirth).toLocaleDateString()}
                  </p>
                )}
                {currentData.isDeceased && currentData.dateOfDeath && (
                  <p className="flex items-center text-red-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <strong>Died:</strong> {new Date(currentData.dateOfDeath).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={currentData.dateOfBirth || ""}
                    onChange={(e) => setEditData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isDeceased"
                    checked={currentData.isDeceased}
                    onCheckedChange={(checked) => setEditData((prev) => ({ ...prev, isDeceased: checked }))}
                  />
                  <Label htmlFor="isDeceased">Deceased</Label>
                </div>

                {currentData.isDeceased && (
                  <div>
                    <Label htmlFor="dateOfDeath">Date of Death</Label>
                    <Input
                      id="dateOfDeath"
                      type="date"
                      value={currentData.dateOfDeath || ""}
                      onChange={(e) => setEditData((prev) => ({ ...prev, dateOfDeath: e.target.value }))}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    value={currentData.occupation || ""}
                    onChange={(e) => setEditData((prev) => ({ ...prev, occupation: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea
                    id="bio"
                    value={currentData.bio || ""}
                    onChange={(e) => setEditData((prev) => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                  />
                </div>
              </>
            ) : (
              <>
                {currentData.occupation && (
                  <p>
                    <strong>Occupation:</strong> {currentData.occupation}
                  </p>
                )}
                {currentData.bio && (
                  <div>
                    <strong>Biography:</strong>
                    <p className="mt-1 text-gray-700">{currentData.bio}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
