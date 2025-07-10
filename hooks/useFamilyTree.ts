"use client"

import { useState, useCallback } from "react"
import type { Person, FamilyTreeData } from "../types/family"

const initialData: FamilyTreeData = {
  people: {
    // Founders - John and Mary Smith (Married Couple)
    "1": {
      id: "1",
      name: "John Smith",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "1950-05-15",
      isDeceased: false,
      gender: "male",
      occupation: "Engineer",
      bio: "Family patriarch, retired engineer, married to Mary since 1972",
      spouseId: "2",
      parentIds: [],
      childrenIds: ["3", "4", "5", "6", "7"],
    },
    "2": {
      id: "2",
      name: "Mary Smith",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "1952-08-22",
      isDeceased: false,
      gender: "female",
      occupation: "Teacher",
      bio: "Retired school teacher, married to John since 1972, loves gardening",
      spouseId: "1",
      parentIds: [],
      childrenIds: ["3", "4", "5", "6", "7"],
    },

    // 1st Generation - John's Children
    "3": {
      id: "3",
      name: "David Smith",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "1975-03-10",
      isDeceased: false,
      gender: "male",
      occupation: "Doctor",
      bio: "Cardiologist at City Hospital, married to Lisa since 2001",
      spouseId: "8",
      parentIds: ["1", "2"],
      childrenIds: ["13", "14"],
    },
    "8": {
      id: "8",
      name: "Lisa Smith",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "1976-07-18",
      isDeceased: false,
      gender: "female",
      occupation: "Nurse",
      bio: "Pediatric nurse, married to David since 2001, loves children",
      spouseId: "3",
      parentIds: [],
      childrenIds: ["13", "14"],
    },

    "4": {
      id: "4",
      name: "Sarah Johnson",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "1977-11-05",
      isDeceased: false,
      gender: "female",
      occupation: "Artist",
      bio: "Professional painter and art teacher, married to Mark since 2000",
      spouseId: "9",
      parentIds: ["1", "2"],
      childrenIds: ["15", "16", "17"],
    },
    "9": {
      id: "9",
      name: "Mark Johnson",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "1975-04-25",
      isDeceased: false,
      gender: "male",
      occupation: "Architect",
      bio: "Residential architect, married to Sarah since 2000, designs beautiful homes",
      spouseId: "4",
      parentIds: [],
      childrenIds: ["15", "16", "17"],
    },

    "5": {
      id: "5",
      name: "Michael Smith",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "1979-07-18",
      dateOfDeath: "2020-04-12",
      isDeceased: true,
      gender: "male",
      occupation: "Musician",
      bio: "Talented musician who passed away young from illness, never married",
      parentIds: ["1", "2"],
      childrenIds: [],
    },

    "6": {
      id: "6",
      name: "Jennifer Wilson",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "1981-09-22",
      isDeceased: false,
      gender: "female",
      occupation: "Lawyer",
      bio: "Corporate lawyer, married to James since 2005, works at top law firm",
      spouseId: "10",
      parentIds: ["1", "2"],
      childrenIds: ["18"],
    },
    "10": {
      id: "10",
      name: "James Wilson",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "1980-01-15",
      isDeceased: false,
      gender: "male",
      occupation: "Engineer",
      bio: "Software engineer, married to Jennifer since 2005, tech entrepreneur",
      spouseId: "6",
      parentIds: [],
      childrenIds: ["18"],
    },

    "7": {
      id: "7",
      name: "Robert Smith",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "1983-12-03",
      isDeceased: false,
      gender: "male",
      occupation: "Teacher",
      bio: "High school math teacher, married to Amanda since 2010, loves education",
      spouseId: "11",
      parentIds: ["1", "2"],
      childrenIds: [],
    },
    "11": {
      id: "11",
      name: "Amanda Smith",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "1985-06-10",
      isDeceased: false,
      gender: "female",
      occupation: "Veterinarian",
      bio: "Small animal veterinarian, married to Robert since 2010, animal lover",
      spouseId: "7",
      parentIds: [],
      childrenIds: [],
    },

    // 2nd Generation - Grandchildren
    "13": {
      id: "13",
      name: "Emma Smith",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "2005-12-03",
      isDeceased: false,
      gender: "female",
      occupation: "Student",
      bio: "College student studying medicine, married to Ryan since 2023",
      spouseId: "19",
      parentIds: ["3", "8"],
      childrenIds: ["25"],
    },
    "19": {
      id: "19",
      name: "Ryan Davis",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "2004-09-12",
      isDeceased: false,
      gender: "male",
      occupation: "Student",
      bio: "Engineering student, married to Emma since 2023, future engineer",
      spouseId: "13",
      parentIds: [],
      childrenIds: ["25"],
    },

    "14": {
      id: "14",
      name: "Alex Smith",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "2008-08-15",
      isDeceased: false,
      gender: "male",
      occupation: "Student",
      bio: "High school student, loves sports, single",
      parentIds: ["3", "8"],
      childrenIds: [],
    },

    "15": {
      id: "15",
      name: "Olivia Johnson",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "2003-05-20",
      isDeceased: false,
      gender: "female",
      occupation: "Student",
      bio: "Art student like her mother, married to Lucas since 2022",
      spouseId: "20",
      parentIds: ["4", "9"],
      childrenIds: ["26", "27"],
    },
    "20": {
      id: "20",
      name: "Lucas Martinez",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "2002-07-30",
      isDeceased: false,
      gender: "male",
      occupation: "Artist",
      bio: "Digital artist, married to Olivia since 2022, creative couple",
      spouseId: "15",
      parentIds: [],
      childrenIds: ["26", "27"],
    },

    "16": {
      id: "16",
      name: "Ethan Johnson",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "2006-02-14",
      isDeceased: false,
      gender: "male",
      occupation: "Student",
      bio: "High school student, married to Ava since 2024, young love",
      spouseId: "21",
      parentIds: ["4", "9"],
      childrenIds: ["28"],
    },
    "21": {
      id: "21",
      name: "Ava Thompson",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "2007-01-18",
      isDeceased: false,
      gender: "female",
      occupation: "Student",
      bio: "High school student, married to Ethan since 2024, young parents",
      spouseId: "16",
      parentIds: [],
      childrenIds: ["28"],
    },

    "17": {
      id: "17",
      name: "Sophia Johnson",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "2009-11-08",
      isDeceased: false,
      gender: "female",
      occupation: "Student",
      bio: "Middle school student, loves painting, single",
      parentIds: ["4", "9"],
      childrenIds: [],
    },

    "18": {
      id: "18",
      name: "Noah Wilson",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "2010-03-25",
      isDeceased: false,
      gender: "male",
      occupation: "Student",
      bio: "Elementary school student, loves computers, single",
      parentIds: ["6", "10"],
      childrenIds: [],
    },

    // 3rd Generation - Great-grandchildren
    "25": {
      id: "25",
      name: "Lily Davis",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "2024-01-15",
      isDeceased: false,
      gender: "female",
      occupation: "Baby",
      bio: "Newest addition to the family, Emma and Ryan's daughter",
      parentIds: ["13", "19"],
      childrenIds: [],
    },
    "26": {
      id: "26",
      name: "Mason Martinez",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "2023-06-10",
      isDeceased: false,
      gender: "male",
      occupation: "Toddler",
      bio: "Energetic toddler, loves to draw, Olivia and Lucas's son",
      parentIds: ["15", "20"],
      childrenIds: [],
    },
    "27": {
      id: "27",
      name: "Grace Martinez",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "2024-09-22",
      isDeceased: false,
      gender: "female",
      occupation: "Baby",
      bio: "Sweet baby girl, Olivia and Lucas's daughter",
      parentIds: ["15", "20"],
      childrenIds: [],
    },
    "28": {
      id: "28",
      name: "Liam Thompson",
      profilePicture: "/placeholder.svg?height=80&width=80",
      dateOfBirth: "2024-03-08",
      isDeceased: false,
      gender: "male",
      occupation: "Baby",
      bio: "Happy baby boy, Ethan and Ava's son",
      parentIds: ["16", "21"],
      childrenIds: [],
    },
  },
  rootPersonId: "1",
}

export function useFamilyTree() {
  const [familyData, setFamilyData] = useState<FamilyTreeData>(initialData)

  const addPerson = useCallback((person: Omit<Person, "id">) => {
    const id = Date.now().toString()
    const newPerson: Person = { ...person, id }

    setFamilyData((prev) => ({
      ...prev,
      people: {
        ...prev.people,
        [id]: newPerson,
      },
    }))

    return id
  }, [])

  const updatePerson = useCallback((id: string, updates: Partial<Person>) => {
    setFamilyData((prev) => ({
      ...prev,
      people: {
        ...prev.people,
        [id]: { ...prev.people[id], ...updates },
      },
    }))
  }, [])

  const addChild = useCallback(
    (parentIds: string[], childData: Omit<Person, "id" | "parentIds">) => {
      const childId = addPerson({ ...childData, parentIds })

      // Update parents to include this child
      parentIds.forEach((parentId) => {
        setFamilyData((prev) => ({
          ...prev,
          people: {
            ...prev.people,
            [parentId]: {
              ...prev.people[parentId],
              childrenIds: [...prev.people[parentId].childrenIds, childId],
            },
          },
        }))
      })

      return childId
    },
    [addPerson],
  )

  const addSpouse = useCallback(
    (personId: string, spouseData: Omit<Person, "id" | "spouseId">) => {
      const spouseId = addPerson({ ...spouseData, spouseId: personId })

      // Update the original person to have this spouse
      updatePerson(personId, { spouseId })

      return spouseId
    },
    [addPerson, updatePerson],
  )

  return {
    familyData,
    addPerson,
    updatePerson,
    addChild,
    addSpouse,
  }
}
