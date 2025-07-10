export interface Person {
  id: string
  name: string
  profilePicture?: string
  dateOfBirth?: string
  dateOfDeath?: string
  isDeceased: boolean
  gender: "male" | "female" | "other"
  occupation?: string
  bio?: string
  spouseId?: string
  parentIds: string[]
  childrenIds: string[]
}

export interface FamilyTreeData {
  people: Record<string, Person>
  rootPersonId: string
}
